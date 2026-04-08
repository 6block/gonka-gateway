<template>
  <div class="h-full flex flex-col p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in relative w-full">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Chat</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Interact with Qwen3-235B</p>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-2xl p-4 overflow-y-auto mb-6 flex flex-col space-y-6 shadow-sm group" ref="chatContainer">
      <div v-if="messages.length === 0" class="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 min-h-[300px]">
        <div class="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
          <LucideMessageSquare class="w-8 h-8 opacity-50" />
        </div>
        <p class="font-medium text-gray-600 dark:text-gray-400">Start a conversation</p>
        <p class="text-sm mt-1 max-w-xs text-center">Ask any question to test the API performance and response quality.</p>
      </div>

      <div v-for="(msg, i) in messages" :key="i" class="flex w-full" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <div class="flex items-start max-w-[85%] md:max-w-[75%] gap-3" :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
          <!-- Avatar -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
               :class="msg.role === 'user' ? 'bg-gradient-to-tr from-gray-900 to-gray-600 dark:from-white dark:to-gray-300' : 'bg-gradient-to-tr from-blue-500 to-purple-500'">
            <LucideUser v-if="msg.role === 'user'" class="w-4 h-4 text-white dark:text-black" />
            <LucideBot v-else class="w-4 h-4 text-white" />
          </div>
          
          <!-- Message Bubble -->
          <div class="rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm break-words overflow-hidden" 
               :class="[
                 msg.role === 'user' 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black rounded-tr-sm' 
                  : 'bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-sm',
                 msg.isError ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400' : '',
                 (!msg.content && isLoading && i === messages.length - 1 && msg.role === 'assistant') ? 'flex items-center min-h-[48px]' : ''
               ]">
            <div v-if="msg.content" class="whitespace-pre-wrap font-sans max-w-full overflow-x-auto custom-scrollbar">{{ msg.content }}</div>
            <div v-else-if="isLoading && i === messages.length - 1 && msg.role === 'assistant'" class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce"></span>
              <span class="w-2 h-2 bg-purple-500/60 rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
              <span class="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="relative shrink-0">
      <form @submit.prevent="sendMessage" class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[20px] blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
        <div class="relative flex items-end bg-white/90 dark:bg-[#111111]/90 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-[16px] shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/30">
          <textarea 
            v-model="input" 
            @keydown.enter.prevent="handleEnter"
            @input="adjustTextareaHeight"
            ref="textareaRef"
            placeholder="Type a message..." 
            class="w-full bg-transparent border-none px-5 py-4 text-[15px] text-gray-900 dark:text-white focus:outline-none resize-none max-h-[200px] min-h-[56px] custom-scrollbar"
            rows="1"
          ></textarea>
          <div class="p-2 shrink-0 flex items-end mb-1">
            <button 
              type="submit" 
              :disabled="!input.trim() || isLoading" 
              class="p-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-black rounded-xl transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-sm"
              title="Send (Enter)"
            >
              <LucideSend class="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
      <div class="text-center mt-3 text-xs text-gray-400 font-medium">
        Press <kbd class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 font-mono text-[10px]">Enter</kbd> to send, <kbd class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 font-mono text-[10px]">Shift</kbd> + <kbd class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 font-mono text-[10px]">Enter</kbd> for new line
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideSend, LucideMessageSquare, LucideUser, LucideBot } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { ref, nextTick, watch } from 'vue'

const auth = useAuthStore()
const toast = useToast()
const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)
const textareaRef = ref(null)
const config = useRuntimeConfig()

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Adjust textarea height automatically
const adjustTextareaHeight = () => {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`
}

// Watch input to shrink textarea when cleared
watch(input, (newVal) => {
  if (!newVal) {
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto'
      }
    })
  }
})

const handleEnter = (e) => {
  if (e.shiftKey) return // Allow new line
  sendMessage()
}

function getUserFriendlyErrorMessage(error) {
  if (error.message && error.message.startsWith('HTTP_ERROR:')) {
    try {
      const parts = error.message.split('|||')
      const status = parseInt(parts[1], 10)
      
      if (status === 400) return "The request was invalid. Please check your input."
      if (status === 401) return "Your session has expired or is invalid. Please log in again."
      if (status === 402) return "Insufficient balance. Please deposit funds to continue."
      if (status === 403) return "You do not have permission to perform this action."
      if (status === 404) return "The requested model or service is currently unavailable."
      if (status === 429) return "You're sending messages too fast. Please wait a moment and try again."
      if (status >= 500) return "The AI server is currently experiencing high load or maintenance. Please try again later."
      
      return "An unexpected server issue occurred. Please try again."
    } catch (e) {
      return "A communication error occurred. Please try again."
    }
  }
  
  if (error.name === 'TypeError' || (error.message && error.message.toLowerCase().includes('fetch'))) {
    return "Network error. Please check your internet connection and verify the server is reachable."
  }
  
  if (error.name === 'AbortError') {
    return "The request timed out. Please try again."
  }

  return "An unexpected error occurred while sending your message. Please try again."
}

async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return

  const userMsg = { role: 'user', content: input.value.trim() }
  messages.value.push(userMsg)
  input.value = ''
  isLoading.value = true
  scrollToBottom()

  const token = auth.token
  if (!token) {
    messages.value.push({ role: 'assistant', content: 'Error: No auth token found. Please login from the sidebar.', isError: true })
    isLoading.value = false
    toast.error('Authentication required')
    scrollToBottom()
    return
  }

  const assistantMsg = { role: 'assistant', content: '' }
  messages.value.push(assistantMsg)
  const activeMessageIndex = messages.value.length - 1

  const chatMessages = messages.value
    .slice(0, -1) // Exclude the empty assistant message just added
    .filter(m => m.content && !m.isError)
    .map(m => ({ role: m.role, content: m.content }))

  try {
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
      throw new Error(`HTTP_ERROR:|||${res.status}|||${errText}`)
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
    
  } catch (error) {
    console.error('Chat Error:', error)
    messages.value[activeMessageIndex].content = getUserFriendlyErrorMessage(error)
    messages.value[activeMessageIndex].isError = true
    toast.error('Message failed to send')
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>