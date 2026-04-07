<template>
  <div class="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Dashboard</h1>
        <p class="text-gray-500 dark:text-gray-400">Overview of your usage and API settings.</p>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Balance -->
      <div class="bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400">Available Balance</h3>
          <div class="p-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
            <LucideWallet class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-baseline gap-1.5 relative z-10">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ loading ? '...' : metrics.balance}}
          </span>
          <span class="text-sm font-medium text-gray-500">{{ metrics.currency }}</span>
        </div>
      </div>
      
      <!-- Monthly Cost -->
      <div class="bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400">Monthly Cost</h3>
          <div class="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
            <LucideTrendingDown class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-baseline gap-1.5 relative z-10">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ loading ? '...' : formatNumber(metrics.monthly_cost, 5) }}
          </span>
          <span class="text-sm font-medium text-gray-500">{{ metrics.currency }}</span>
        </div>
      </div>

      <!-- Monthly Requests -->
      <div class="bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400">Monthly Requests</h3>
          <div class="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
            <LucideActivity class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-baseline gap-1.5 relative z-10">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ loading ? '...' : formatInt(metrics.monthly_requests) }}
          </span>
          <span class="text-sm font-medium text-gray-500">reqs</span>
        </div>
      </div>

      <!-- Monthly Tokens -->
      <div class="bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400">Monthly Tokens</h3>
          <div class="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg">
            <LucideZap class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-baseline gap-1.5 relative z-10">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ loading ? '...' : formatInt(metrics.monthly_token_used) }}
          </span>
          <span class="text-sm font-medium text-gray-500">tokens</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
      <LucideAlertCircle class="w-5 h-5 shrink-0" />
      {{ error }}
    </div>

    <!-- Configurations & API -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
      <!-- Left Column: Keys & Config -->
      <div class="xl:col-span-1 space-y-8">
        
        <!-- API Key Card -->
        <section class="bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-white/5">
            <div class="flex items-center gap-3 mb-1">
              <LucideKey class="w-5 h-5 text-gray-400" />
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">API Key</h2>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Authenticate your API requests.</p>
          </div>
          <div class="p-6 bg-gray-50/50 dark:bg-black/20">
            <div class="flex items-center justify-between bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl p-1 shadow-inner overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
              <div class="px-3 py-2 flex-1 overflow-hidden relative">
                <span v-if="isKeyLoading" class="text-gray-400 text-sm flex items-center gap-2">
                  <LucideLoader2 class="w-4 h-4 animate-spin" /> Loading...
                </span>
                <span v-else-if="!apiKey" class="text-gray-400 text-sm">No key found.</span>
                <span v-else class="text-gray-800 dark:text-gray-200 text-sm font-mono truncate block" :class="{'blur-sm select-none': !showKey}">
                  {{ apiKey }}
                </span>
              </div>
              <div class="flex items-center gap-1 px-1">
                <button 
                  v-if="apiKey"
                  @click="showKey = !showKey" 
                  class="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                  :title="showKey ? 'Hide key' : 'Show key'"
                >
                  <LucideEyeOff v-if="showKey" class="w-4 h-4" />
                  <LucideEye v-else class="w-4 h-4" />
                </button>
                <button 
                  v-if="apiKey"
                  @click="copyApiKey" 
                  class="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors relative"
                  title="Copy key"
                >
                  <LucideCheck v-if="copied" class="w-4 h-4 text-green-500" />
                  <LucideCopy v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Base URL Card -->
        <section class="bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-white/5">
            <div class="flex items-center gap-3 mb-1">
              <LucideGlobe class="w-5 h-5 text-gray-400" />
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Base URL</h2>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">The gateway endpoint for all requests.</p>
          </div>
          <div class="p-6 bg-gray-50/50 dark:bg-black/20">
            <div class="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl p-3 shadow-inner flex items-center justify-between">
              <code class="text-sm text-gray-800 dark:text-gray-300 font-mono">{{ config.public.apiBase }}/v1</code>
              <button @click="copyBaseUrl" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                <LucideCopy class="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </div>

      <!-- Right Column: API Docs -->
      <div class="xl:col-span-2 space-y-6">
        <h2 class="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
          <LucideBookOpen class="w-5 h-5" /> API Reference
        </h2>
        
        <!-- Endpoint: Chat Completions -->
        <div class="bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
            <span class="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-md">POST</span>
            <span class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">/chat/completions</span>
          </div>
          <div class="p-6 space-y-6">
            <p class="text-sm text-gray-600 dark:text-gray-400">Create a chat completion (OpenAI-compatible endpoint).</p>
            
            <div class="space-y-3">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Request</h3>
              <div class="relative bg-[#fafafa] dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden group">
                <div class="flex items-center px-4 py-2 bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  <div class="flex gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                    <div class="w-3 h-3 rounded-full bg-green-400/80"></div>
                  </div>
                  <div class="mx-auto text-xs text-gray-400 font-mono">cURL</div>
                </div>
                <div class="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                  <div class="text-pink-600 dark:text-pink-400">curl <span class="text-gray-800 dark:text-gray-300">-X POST {{ config.public.apiBase }}/v1/chat/completions \</span></div>
                  <div class="text-gray-800 dark:text-gray-300">  -H <span class="text-green-600 dark:text-green-400">"Content-Type: application/json"</span> \</div>
                  <div class="text-gray-800 dark:text-gray-300">  -H <span class="text-green-600 dark:text-green-400">"Authorization: Bearer <span class="opacity-60">{{ apiKey || '$API_KEY' }}</span>"</span> \</div>
                  <div class="text-gray-800 dark:text-gray-300">  -d <span class="text-yellow-600 dark:text-yellow-400">'{</span></div>
                  <div class="text-gray-800 dark:text-gray-300"><span class="text-yellow-600 dark:text-yellow-400">    "model": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",</span></div>
                  <div class="text-gray-800 dark:text-gray-300"><span class="text-yellow-600 dark:text-yellow-400">    "messages": [{"role": "user", "content": "Hello!"}]</span></div>
                  <div class="text-gray-800 dark:text-gray-300"><span class="text-yellow-600 dark:text-yellow-400">  }'</span></div>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Response</h3>
              <div class="relative bg-[#fafafa] dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                <div class="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-gray-800 dark:text-gray-300">
<pre><code>{
  <span class="text-blue-600 dark:text-blue-400">"id"</span>: <span class="text-green-600 dark:text-green-400">"chatcmpl-123"</span>,
  <span class="text-blue-600 dark:text-blue-400">"object"</span>: <span class="text-green-600 dark:text-green-400">"chat.completion"</span>,
  <span class="text-blue-600 dark:text-blue-400">"created"</span>: <span class="text-orange-600 dark:text-orange-400">1677652288</span>,
  <span class="text-blue-600 dark:text-blue-400">"choices"</span>: [{
    <span class="text-blue-600 dark:text-blue-400">"index"</span>: <span class="text-orange-600 dark:text-orange-400">0</span>,
    <span class="text-blue-600 dark:text-blue-400">"message"</span>: {
      <span class="text-blue-600 dark:text-blue-400">"role"</span>: <span class="text-green-600 dark:text-green-400">"assistant"</span>,
      <span class="text-blue-600 dark:text-blue-400">"content"</span>: <span class="text-green-600 dark:text-green-400">"Hello! How can I help you?"</span>
    },
    <span class="text-blue-600 dark:text-blue-400">"finish_reason"</span>: <span class="text-green-600 dark:text-green-400">"stop"</span>
  }],
  <span class="text-blue-600 dark:text-blue-400">"usage"</span>: {
    <span class="text-blue-600 dark:text-blue-400">"prompt_tokens"</span>: <span class="text-orange-600 dark:text-orange-400">9</span>,
    <span class="text-blue-600 dark:text-blue-400">"completion_tokens"</span>: <span class="text-orange-600 dark:text-orange-400">12</span>,
    <span class="text-blue-600 dark:text-blue-400">"total_tokens"</span>: <span class="text-orange-600 dark:text-orange-400">21</span>
  }
}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Endpoint: List Models -->
        <div class="bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
            <span class="bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-md">GET</span>
            <span class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">/models</span>
          </div>
          <div class="p-6 space-y-6">
            <p class="text-sm text-gray-600 dark:text-gray-400">List available models.</p>
            
            <div class="space-y-3">
              <div class="relative bg-[#fafafa] dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                <div class="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-gray-800 dark:text-gray-300">
<pre><code>{
  <span class="text-blue-600 dark:text-blue-400">"object"</span>: <span class="text-green-600 dark:text-green-400">"list"</span>,
  <span class="text-blue-600 dark:text-blue-400">"data"</span>: [
    {
      <span class="text-blue-600 dark:text-blue-400">"id"</span>: <span class="text-green-600 dark:text-green-400">"Qwen/Qwen3-235B-A22B-Instruct-2507-FP8"</span>,
      <span class="text-blue-600 dark:text-blue-400">"object"</span>: <span class="text-green-600 dark:text-green-400">"model"</span>,
      <span class="text-blue-600 dark:text-blue-400">"created"</span>: <span class="text-orange-600 dark:text-orange-400">1677610602</span>,
      <span class="text-blue-600 dark:text-blue-400">"owned_by"</span>: <span class="text-green-600 dark:text-green-400">"gonka"</span>
    }
  ]
}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideLoader2, LucideWallet, LucideTrendingDown, LucideActivity, 
  LucideZap, LucideAlertCircle, LucideKey, LucideCopy, LucideCheck,
  LucideEye, LucideEyeOff, LucideGlobe, LucideBookOpen
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const auth = useAuthStore()
const toast = useToast()

const loading = ref(false)
const error = ref(null)

const apiKey = ref('')
const isKeyLoading = ref(false)
const copied = ref(false)
const showKey = ref(false)

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

async function copyApiKey() {
  if (!apiKey.value) return
  try {
    await navigator.clipboard.writeText(apiKey.value)
    copied.value = true
    toast.success('API Key copied to clipboard')
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    toast.error('Failed to copy API key')
  }
}

async function copyBaseUrl() {
  const url = `${config.public.apiBase}/v1`
  try {
    await navigator.clipboard.writeText(url)
    toast.success('Base URL copied to clipboard')
  } catch (err) {
    toast.error('Failed to copy Base URL')
  }
}

async function fetchApiKey() {
  if (!auth.token) return
  isKeyLoading.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/api/keys`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    const key = data?.items[0]?.key
    apiKey.value = key || ''
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