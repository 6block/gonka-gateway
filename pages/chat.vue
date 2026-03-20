<template>
  <div class="h-full flex flex-col p-8 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Chat</h1>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 bg-[#111] border border-gray-800 rounded-xl p-4 overflow-y-auto mb-4 flex flex-col space-y-4" ref="chatContainer">
      <div v-if="messages.length === 0" class="flex-1 flex items-center justify-center text-gray-500 flex-col">
        <LucideMessageSquare class="w-12 h-12 mb-4 opacity-50" />
        <p>Start a conversation</p>
      </div>

      <div v-for="(msg, i) in messages" :key="i" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <div class="max-w-[80%] rounded-2xl px-4 py-3 text-sm" 
             :class="msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'">
          <div class="whitespace-pre-wrap">{{ msg.content }}</div>
        </div>
      </div>
      
      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-gray-800 text-gray-400 rounded-2xl px-4 py-3 text-sm flex items-center space-x-2">
          <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
          <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
          <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <form @submit.prevent="sendMessage" class="relative">
      <textarea 
        v-model="input" 
        @keydown.enter.prevent="sendMessage"
        placeholder="Type a message..." 
        class="w-full bg-[#111] border border-gray-800 rounded-xl pl-4 pr-12 py-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        rows="1"
        style="min-height: 56px;"
      ></textarea>
      <button type="submit" :disabled="!input.trim() || isLoading" class="absolute right-3 top-3 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <LucideSend class="w-4 h-4" />
      </button>
    </form>
  </div>
</template>

<script setup>
import { LucideSend, LucideMessageSquare } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { ref, nextTick } from 'vue'
import { useRuntimeConfig } from '#app'

const auth = useAuthStore()
const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)
const config = useRuntimeConfig()

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

  async function sendMessage() {
    if (!input.value.trim() || isLoading.value) return

    const userMsg = { role: 'user', content: input.value }
    messages.value.push(userMsg)
    input.value = ''
    isLoading.value = true
    scrollToBottom()

    // Find a valid API key -> Now using JWT token
    const token = auth.token
    if (!token) {
      messages.value.push({ role: 'assistant', content: 'Error: No auth token found. Please login again.' })
      isLoading.value = false
      return
    }

    const assistantMsg = { role: 'assistant', content: '' }
    messages.value.push(assistantMsg)

    const activeMessageIndex = messages.value.length - 1

    // 提取需要发送的消息格式（仅保留 role 和 content），避免传空 content
    const chatMessages = []
    for (let i = 0; i < messages.value.length - 1; i++) {
      const m = messages.value[i]
      if (m.content) {
        chatMessages.push({ role: m.role, content: m.content })
      }
    }

    try {
      const config = useRuntimeConfig()
      const res = await fetch(`${config.public.apiBase}/api/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8',
          messages: chatMessages,
          stream: true
        })
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Error ${res.status}: ${errText || res.statusText}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let buffer = ''

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk
          let boundary = buffer.indexOf('\n')
          
          while (boundary !== -1) {
            const line = buffer.slice(0, boundary).trim()
            buffer = buffer.slice(boundary + 1)
            boundary = buffer.indexOf('\n')
            
            if (!line) continue
            
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const jsonStr = line.slice(6).trim()
                if (!jsonStr || jsonStr === '[DONE]') continue
                
                const parsed = JSON.parse(jsonStr)
                if (parsed.choices && parsed.choices.length > 0) {
                  const content = parsed.choices[0]?.delta?.content
                  if (content !== undefined && content !== null) {
                    messages.value[activeMessageIndex].content += content
                    scrollToBottom()
                  }
                }
              } catch (e) {
                console.error('Frontend Parse Error:', e, line)
              }
            }
          }
        }
      }
      
      // Refresh balance after message
      auth.fetchUserInfo()
    } catch (error) {
      messages.value[activeMessageIndex].content = `[Request Failed: ${error.message}]`
    } finally {
      isLoading.value = false
      scrollToBottom()
    }
  }
</script>