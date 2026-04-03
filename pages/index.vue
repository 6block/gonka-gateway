<template>
  <div class="p-8 max-w-6xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Dashboard</h1>
      
      <!-- Connected Address (Moved to top right for a cleaner dashboard) -->
      <div v-if="auth.isLoggedIn" class="bg-white dark:bg-[rgb(17,17,17)] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-green-500"></div>
        <span class="text-sm font-mono text-gray-700 dark:text-gray-300" :title="auth.user?.address">
          {{ auth.user?.address ? auth.user.address.slice(0, 6) + '...' + auth.user.address.slice(-4) : 'Not Connected' }}
        </span>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Balance -->
      <div class="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm transition-colors relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <h3 class="text-sm text-gray-500 font-medium mb-2">Available Balance</h3>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-green-500">
            {{ loading ? '-' : metrics.balance}}
          </span>
          <span class="text-sm text-gray-500 font-medium">{{ metrics.currency }}</span>
        </div>
      </div>
      
      <!-- Monthly Cost -->
      <div class="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm transition-colors relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <h3 class="text-sm text-gray-500 font-medium mb-2">Monthly Cost</h3>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {{ loading ? '-' : formatNumber(metrics.monthly_cost, 5) }}
          </span>
          <span class="text-sm text-gray-500 font-medium">{{ metrics.currency }}</span>
        </div>
      </div>

      <!-- Monthly Requests -->
      <div class="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm transition-colors relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <h3 class="text-sm text-gray-500 font-medium mb-2">Monthly Requests</h3>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {{ loading ? '-' : formatInt(metrics.monthly_requests) }}
          </span>
          <span class="text-sm text-gray-500 font-medium">reqs</span>
        </div>
      </div>

      <!-- Monthly Tokens -->
      <div class="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm transition-colors relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <h3 class="text-sm text-gray-500 font-medium mb-2">Monthly Tokens</h3>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {{ loading ? '-' : formatInt(metrics.monthly_token_used) }}
          </span>
          <span class="text-sm text-gray-500 font-medium">tokens</span>
        </div>
      </div>

    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm transition-colors">
      {{ error }}
    </div>

    <!-- API Documentation -->
    <div class="space-y-12 pb-12 pt-4">

      <!-- API Key Section -->
      <section>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">API Key</h2>
        <div class="border-t-2 border-blue-500 pt-4">
          <p class="text-gray-600 dark:text-gray-400 mb-4 transition-colors">Use this key to authenticate your API requests. Keep it secure.</p>
          <div class="flex items-center justify-between bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-4 transition-colors">
            <code class="text-sm text-gray-700 dark:text-gray-300 font-mono transition-colors break-all">
              <span v-if="isKeyLoading" class="text-gray-400 flex items-center gap-2">
                <LucideLoader2 class="w-4 h-4 animate-spin" /> Loading API Key...
              </span>
              <span v-else>{{ apiKey || 'No API Key found. Please check your setup.' }}</span>
            </code>
            <button 
              v-if="apiKey"
              @click="copyApiKey" 
              class="ml-4 flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
              :class="copied ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-[#222] dark:text-gray-300 dark:border-gray-700 dark:hover:bg-[#2a2a2a]'"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
      </section>
      
      <!-- Base URL Section -->
      <section>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Base URL</h2>
        <div class="border-t-2 border-blue-500 pt-4">
          <p class="text-gray-600 dark:text-gray-400 mb-4 transition-colors">The gateway is served over <strong class="font-semibold text-gray-900 dark:text-gray-200">HTTPS</strong>. All API requests should be made to:</p>
          <div class="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-4 transition-colors">
            <code class="text-sm text-gray-700 dark:text-gray-300 font-mono transition-colors">{{ config.public.apiBase }}/v1</code>
          </div>
        </div>
      </section>

      <!-- API Endpoints Section -->
      <section>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">API Endpoints</h2>
        <div class="border-t-2 border-blue-500 pt-4 space-y-8">
          
          <!-- Endpoint 1: Chat Completions -->
          <div>
            <div class="bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6 transition-colors">
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                <span class="font-bold text-gray-900 dark:text-gray-200 font-mono transition-colors">/chat/completions</span>
              </div>
              <p class="text-gray-700 dark:text-gray-300 text-sm transition-colors">Create a chat completion (OpenAI-compatible)</p>
            </div>

            <!-- Request Block -->
            <div class="mb-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3 transition-colors">Request</h3>
              <div class="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 transition-colors overflow-x-auto">
                <div class="font-mono text-sm space-y-4">
                  <div class="text-gray-600 dark:text-gray-400 transition-colors">
                    <div class="mb-1"><span class="text-blue-600 dark:text-blue-400">POST</span> /chat/completions</div>
                    <div class="mb-1">Content-Type: application/json</div>
                    <div>Authorization: Bearer <span class="text-gray-900 dark:text-gray-300">{{ apiKey || 'sk-your-api-key' }}</span></div>
                  </div>
                  
                  <div class="text-gray-800 dark:text-gray-300 transition-colors">
<pre><code>{
  "model": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ],
  "stream": false
}</code></pre>
                  </div>
                </div>
              </div>
            </div>

            <!-- Response Block -->
            <div class="mb-6">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3 transition-colors">Response</h3>
              <div class="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 transition-colors overflow-x-auto">
                <pre class="font-mono text-sm text-gray-800 dark:text-gray-300 transition-colors"><code>{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}</code></pre>
              </div>
            </div>

            <!-- Streaming Block -->
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3 transition-colors">Streaming</h3>
              <p class="text-gray-700 dark:text-gray-300 text-sm mb-3 transition-colors">To enable streaming, set <code class="bg-gray-100 dark:bg-[#222] px-1.5 py-0.5 rounded text-gray-800 dark:text-gray-300 transition-colors">"stream": true</code> in the request:</p>
              <div class="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 transition-colors overflow-x-auto">
                <pre class="font-mono text-sm text-gray-800 dark:text-gray-300 transition-colors"><code>{
  "model": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
  "messages": [
    {"role": "user", "content": "Tell me a story"}
  ],
  "stream": true
}</code></pre>
              </div>
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-800 transition-colors" />

          <!-- Endpoint 2: List Models -->
          <div>
            <div class="bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6 transition-colors">
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                <span class="font-bold text-gray-900 dark:text-gray-200 font-mono transition-colors">/models</span>
              </div>
              <p class="text-gray-700 dark:text-gray-300 text-sm transition-colors">List available models</p>
            </div>

            <!-- Request Block -->
            <div class="mb-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3 transition-colors">Request</h3>
              <div class="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 transition-colors overflow-x-auto">
                <div class="font-mono text-sm space-y-4">
                  <div class="text-gray-600 dark:text-gray-400 transition-colors">
                    <div class="mb-1"><span class="text-green-600 dark:text-green-400">GET</span> /models</div>
                    <div>Authorization: Bearer <span class="text-gray-900 dark:text-gray-300">{{ apiKey || 'sk-your-api-key' }}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Response Block -->
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3 transition-colors">Response</h3>
              <div class="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 transition-colors overflow-x-auto">
                <pre class="font-mono text-sm text-gray-800 dark:text-gray-300 transition-colors"><code>{
  "object": "list",
  "data": [
    {
      "id": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
      "object": "model",
      "created": 1677610602,
      "owned_by": "gonka"
    }
  ]
}</code></pre>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { LucideLoader2 } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const auth = useAuthStore()

const loading = ref(false)
const error = ref(null)

const apiKey = ref('')
const isKeyLoading = ref(false)
const copied = ref(false)

const metrics = ref({
  balance: 0,
  currency: 'USDT',
  monthly_cost: 0,
  monthly_requests: 0,
  monthly_token_used: 0
})

function formatNumber(val, decimals = 2) {
  const n = parseFloat(val)
  if (isNaN(n)) return '0.00'
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: decimals })
}

function formatInt(val) {
  const n = parseInt(val, 10)
  if (isNaN(n)) return '0'
  return n.toLocaleString('en-US')
}

function copyApiKey() {
  if (!apiKey.value) return
  navigator.clipboard.writeText(apiKey.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

async function fetchApiKey() {
  if (!auth.token) return
  isKeyLoading.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/api/keys`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    console.log('fetchApiKey', data)
    const key = data?.items[0]?.key
    apiKey.value = key || ''
    console.log('apiKey', apiKey.value)
  } catch (e) {
    console.error('Fetch API key error:', e)
  } finally {
    isKeyLoading.value = false
  }
}

async function fetchBalance() {
  if (!auth.token) return
  
  loading.value = true
  error.value = null
  
  try {
    const data = await $fetch(`${config.public.apiBase}/api/me`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    
    if (data && data.balance) {
      metrics.value = {
        balance: data.balance.amount || 0,
        currency: data.balance.currency || 'USDT',
        monthly_cost: data.balance.monthly_cost || 0,
        monthly_requests: data.balance.monthly_requests || 0,
        monthly_token_used: data.balance.monthly_token_used || 0
      }
    }
  } catch (e) {
    error.value = e?.data?.message || e?.message || 'Failed to fetch balance information'
    console.error('Fetch balance error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBalance()
  fetchApiKey()
})
</script>
