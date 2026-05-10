<template>
  <div class="h-full flex flex-col p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in relative w-full">
    <div class="flex justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-black font-headline tracking-tight leading-none">Chat</h2>
        <p class="text-text-muted mt-2 font-body text-sm">
          Interact with frontier open-source models
        </p>
      </div>
      <div
        v-if="!auth.isLoggedIn"
        class="inline-flex items-center gap-3 bg-surface-container-high border border-white/5 rounded-full px-4 py-2 shrink-0"
      >
        <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" aria-hidden="true"></span>
        <span class="text-[10px] font-black text-text-muted tracking-widest uppercase">
          Guest Mode
        </span>
        <button
          @click="openLogin"
          class="text-[10px] font-black text-primary-container tracking-widest uppercase hover:text-primary-dim transition-colors"
        >
          Connect →
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div
      class="flex-1 bg-surface-container-high rounded-3xl p-5 md:p-6 overflow-y-auto mb-5 flex flex-col space-y-5 border border-white/5 custom-scrollbar"
      ref="chatContainer"
    >
      <div
        v-if="messages.length === 0"
        class="flex-1 flex flex-col items-center justify-center text-center min-h-[300px] space-y-6"
      >
        <div
          class="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center shadow-lg border border-white/5 animate-float"
        >
          <LucideMessageCircle class="w-8 h-8 text-primary-container" />
        </div>
        <div class="max-w-sm space-y-2">
          <h3 class="text-lg font-headline font-bold tracking-tight text-text-main">
            {{ auth.isLoggedIn ? 'Start a conversation' : 'Preview mode' }}
          </h3>
          <p class="text-text-muted text-sm font-body font-light leading-relaxed">
            <template v-if="auth.isLoggedIn">
              Initiate a session to evaluate reasoning depth and network latency.
            </template>
            <template v-else>
              Connect your wallet to send messages. You can still browse the interface
              as a guest.
            </template>
          </p>
        </div>
        <button
          v-if="!auth.isLoggedIn"
          @click="openLogin"
          class="inline-flex items-center gap-2 kinetic-gradient text-primary-on px-6 py-2.5 rounded-full font-black text-xs tracking-tight hover:shadow-glow-emerald transition-all active:scale-95"
        >
          <LucideWallet class="w-4 h-4" />
          Connect Wallet
        </button>
      </div>

      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="flex w-full animate-slide-up"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="flex items-start max-w-[85%] md:max-w-[75%] gap-3"
          :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
        >
          <!-- Avatar -->
          <div
            class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/5"
            :class="
              msg.role === 'user'
                ? 'bg-primary-container text-primary-on'
                : 'bg-surface-container-highest text-primary-container'
            "
          >
            <LucideUser v-if="msg.role === 'user'" class="w-4 h-4" />
            <LucideBot v-else class="w-4 h-4" />
          </div>

          <!-- Bubble -->
          <div
            class="rounded-3xl px-5 py-3.5 text-[15px] leading-relaxed break-words overflow-hidden transition-all"
            :class="[
              msg.role === 'user'
                ? 'bg-primary-container text-primary-on font-black'
                : 'bg-surface-container-highest text-text-main border border-white/5',
              msg.isError
                ? '!bg-red-500/10 !border-red-500/20 !text-red-400 font-medium'
                : '',
              !msg.content && isLoading && i === messages.length - 1 && msg.role === 'assistant'
                ? 'flex items-center min-h-[48px]'
                : ''
            ]"
          >
            <div
              v-if="msg.content"
              class="whitespace-pre-wrap font-body max-w-full overflow-x-auto custom-scrollbar"
            >
              {{ msg.content }}
            </div>
            <div
              v-else-if="
                isLoading && i === messages.length - 1 && msg.role === 'assistant'
              "
              class="flex items-center space-x-1.5 px-1"
            >
              <span
                class="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce"
              ></span>
              <span
                class="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce"
                style="animation-delay: 0.15s"
              ></span>
              <span
                class="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce"
                style="animation-delay: 0.3s"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="shrink-0 space-y-4">
      <!-- Model selector -->
      <div class="flex flex-wrap items-center gap-3">
        <span
          class="text-[10px] font-black uppercase tracking-widest text-text-muted"
        >
          Model
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="model in availableModels"
            :key="model.id"
            @click="selectedModel = model.id"
            class="px-4 py-1.5 rounded-full text-[10px] font-black transition-all border"
            :class="
              selectedModel === model.id
                ? 'bg-primary-container/20 border-primary-container text-primary-container shadow-lg shadow-primary-container/10'
                : 'bg-surface-container-high border-white/5 text-text-muted hover:border-white/10 hover:bg-white/5'
            "
          >
            {{ model.name }}
          </button>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="relative group">
        <div
          class="relative flex items-end bg-surface-container-high border border-white/5 rounded-2xl transition-all duration-300 focus-within:border-primary-container/40 focus-within:shadow-glow-emerald"
          :class="{ 'opacity-70': !auth.isLoggedIn }"
        >
          <textarea
            v-model="input"
            @keydown.enter.prevent="handleEnter"
            @input="adjustTextareaHeight"
            ref="textareaRef"
            :placeholder="
              auth.isLoggedIn ? 'Type a message...' : 'Connect wallet to chat'
            "
            :disabled="!auth.isLoggedIn"
            class="w-full bg-transparent border-none px-5 py-4 text-[15px] text-text-main focus:outline-none resize-none max-h-[200px] min-h-[56px] custom-scrollbar placeholder:text-text-muted/60 font-body disabled:cursor-not-allowed"
            rows="1"
          ></textarea>
          <div class="p-2 shrink-0 flex items-end mb-1">
            <button
              v-if="auth.isLoggedIn"
              type="submit"
              :disabled="!input.trim() || isLoading"
              class="p-2.5 kinetic-gradient text-primary-on rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 hover:shadow-glow-emerald"
              title="Send (Enter)"
            >
              <LucideSend class="w-4 h-4" />
            </button>
            <button
              v-else
              type="button"
              @click="openLogin"
              class="px-3 py-2 kinetic-gradient text-primary-on rounded-xl text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5 hover:shadow-glow-emerald active:scale-95 transition-all"
              title="Connect wallet"
            >
              <LucideWallet class="w-3.5 h-3.5" />
              Connect
            </button>
          </div>
        </div>
      </form>

      <div class="text-center text-[11px] text-text-muted font-medium">
        Press
        <kbd
          class="px-1.5 py-0.5 rounded-md bg-surface-container-highest border border-white/5 font-mono text-[10px]"
          >Enter</kbd
        >
        to send,
        <kbd
          class="px-1.5 py-0.5 rounded-md bg-surface-container-highest border border-white/5 font-mono text-[10px]"
          >Shift</kbd
        >
        +
        <kbd
          class="px-1.5 py-0.5 rounded-md bg-surface-container-highest border border-white/5 font-mono text-[10px]"
          >Enter</kbd
        >
        for new line
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  LucideSend,
  LucideMessageCircle,
  LucideUser,
  LucideBot,
  LucideWallet
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { useLoginModal } from '~/composables/useLoginModal'
import { ref, nextTick, watch } from 'vue'

const auth = useAuthStore()
const toast = useToast()
const { open: openLogin } = useLoginModal()
const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)
const textareaRef = ref(null)
const config = useRuntimeConfig()

const availableModels = [
  { name: 'Kimi-K2.6', id: 'moonshotai/Kimi-K2.6' },
  { name: 'Qwen3-235B-FP8', id: 'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8' }
]
const selectedModel = ref(availableModels[0].id)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const adjustTextareaHeight = () => {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`
}

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
  if (e.shiftKey) return
  sendMessage()
}

function getUserFriendlyErrorMessage(error) {
  if (error.message && error.message.startsWith('HTTP_ERROR:')) {
    try {
      const parts = error.message.split('|||')
      const status = parseInt(parts[1], 10)

      if (status === 400) return 'The request was invalid. Please check your input.'
      if (status === 401) return 'Your session has expired or is invalid. Please log in again.'
      if (status === 402) return 'Insufficient balance. Please deposit funds to continue.'
      if (status === 403) return 'You do not have permission to perform this action.'
      if (status === 404) return 'The requested model or service is currently unavailable.'
      if (status === 429) return "You're sending messages too fast. Please wait a moment and try again."
      if (status >= 500) return 'The AI server is currently experiencing high load or maintenance. Please try again later.'
      return 'An unexpected server issue occurred. Please try again.'
    } catch (e) {
      return 'A communication error occurred. Please try again.'
    }
  }

  if (error.name === 'TypeError' || (error.message && error.message.toLowerCase().includes('fetch'))) {
    return 'Network error. Please check your internet connection and verify the server is reachable.'
  }

  if (error.name === 'AbortError') {
    return 'The request timed out. Please try again.'
  }

  return 'An unexpected error occurred while sending your message. Please try again.'
}

async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return

  if (!auth.isLoggedIn) {
    openLogin()
    return
  }

  const userMsg = { role: 'user', content: input.value.trim() }
  messages.value.push(userMsg)
  input.value = ''
  isLoading.value = true
  scrollToBottom()

  const token = auth.token
  if (!token) {
    messages.value.push({
      role: 'assistant',
      content: 'Error: No auth token found. Please login from the sidebar.',
      isError: true
    })
    isLoading.value = false
    toast.error('Authentication required')
    scrollToBottom()
    return
  }

  const assistantMsg = { role: 'assistant', content: '' }
  messages.value.push(assistantMsg)
  const activeMessageIndex = messages.value.length - 1

  const chatMessages = messages.value
    .slice(0, -1)
    .filter((m) => m.content && !m.isError)
    .map((m) => ({ role: m.role, content: m.content }))

  try {
    const res = await fetch(`${config.public.apiBase}/api/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        model: selectedModel.value,
        messages: chatMessages,
        stream: true
      })
    })

    if (!res.ok) {
      if (res.status === 401) auth.logout()
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
              if (import.meta.dev) console.error('Frontend Parse Error:', e, line)
            }
          }
        }
      }
    }
  } catch (error) {
    if (import.meta.dev) console.error('Chat Error:', error)
    messages.value[activeMessageIndex].content = getUserFriendlyErrorMessage(error)
    messages.value[activeMessageIndex].isError = true
    toast.error('Message failed to send')
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}
</script>
