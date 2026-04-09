<template>
  <div class="p-8 lg:p-12 max-w-7xl mx-auto space-y-10 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight mb-2">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Dashboard</span>
        </h1>
        <p class="text-gray-500 dark:text-gray-500 text-sm">Overview of your usage and API settings.</p>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Balance -->
      <div class="metric-card group relative bg-white/70 dark:bg-[#0c0c1d]/60 backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] p-6 rounded-2xl transition-all duration-500 hover:border-accent-emerald/30 dark:hover:border-accent-emerald/20 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-accent-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="absolute -top-12 -right-12 w-24 h-24 bg-accent-emerald/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="flex justify-between items-start mb-4 relative z-10">
          <h3 class="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Balance</h3>
          <div class="p-2 bg-accent-emerald/10 text-accent-emerald rounded-xl">
            <LucideWallet class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-baseline gap-1.5 relative z-10">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ loading ? '...' : metrics.balance }}
          </span>
          <span class="text-xs font-bold text-gray-400 dark:text-gray-500">{{ metrics.currency }}</span>
        </div>
      </div>

      <!-- Monthly Cost -->
      <div class="metric-card group relative bg-white/70 dark:bg-[#0c0c1d]/60 backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] p-6 rounded-2xl transition-all duration-500 hover:border-accent-blue/30 dark:hover:border-accent-blue/20 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="absolute -top-12 -right-12 w-24 h-24 bg-accent-blue/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="flex justify-between items-start mb-4 relative z-10">
          <h3 class="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Monthly Cost</h3>
          <div class="p-2 bg-accent-blue/10 text-accent-blue rounded-xl">
            <LucideTrendingDown class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-baseline gap-1.5 relative z-10">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ loading ? '...' : formatNumber(metrics.monthly_cost, 5) }}
          </span>
          <span class="text-xs font-bold text-gray-400 dark:text-gray-500">{{ metrics.currency }}</span>
        </div>
      </div>

      <!-- Monthly Requests -->
      <div class="metric-card group relative bg-white/70 dark:bg-[#0c0c1d]/60 backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] p-6 rounded-2xl transition-all duration-500 hover:border-primary-400/30 dark:hover:border-primary-400/20 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="absolute -top-12 -right-12 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="flex justify-between items-start mb-4 relative z-10">
          <h3 class="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Requests</h3>
          <div class="p-2 bg-primary-500/10 text-primary-400 rounded-xl">
            <LucideActivity class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-baseline gap-1.5 relative z-10">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ loading ? '...' : formatInt(metrics.monthly_requests) }}
          </span>
          <span class="text-xs font-bold text-gray-400 dark:text-gray-500">reqs</span>
        </div>
      </div>

      <!-- Monthly Tokens -->
      <div class="metric-card group relative bg-white/70 dark:bg-[#0c0c1d]/60 backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] p-6 rounded-2xl transition-all duration-500 hover:border-accent-pink/30 dark:hover:border-accent-pink/20 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-accent-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="absolute -top-12 -right-12 w-24 h-24 bg-accent-pink/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="flex justify-between items-start mb-4 relative z-10">
          <h3 class="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Tokens</h3>
          <div class="p-2 bg-accent-pink/10 text-accent-pink rounded-xl">
            <LucideZap class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-baseline gap-1.5 relative z-10">
          <span class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ loading ? '...' : formatInt(metrics.monthly_token_used) }}
          </span>
          <span class="text-xs font-bold text-gray-400 dark:text-gray-500">tokens</span>
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
      <div class="xl:col-span-1 space-y-6">

        <!-- API Key Card -->
        <section class="group relative bg-white/70 dark:bg-[#0c0c1d]/60 backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary-400/20">
          <div class="p-6 border-b border-gray-100 dark:border-white/[0.04]">
            <div class="flex items-center gap-3 mb-1">
              <div class="p-2 bg-primary-500/10 rounded-xl">
                <LucideKey class="w-4 h-4 text-primary-400" />
              </div>
              <h2 class="text-base font-bold text-gray-900 dark:text-white">API Key</h2>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 pl-[44px]">Authenticate your API requests.</p>
          </div>
          <div class="p-5 bg-gray-50/50 dark:bg-black/20">
            <div class="flex items-center justify-between bg-white dark:bg-[#0a0a18] border border-gray-200 dark:border-white/[0.06] rounded-xl p-1 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500/30">
              <div class="px-3 py-2 flex-1 overflow-hidden relative">
                <span v-if="isKeyLoading" class="text-gray-400 text-sm flex items-center gap-2">
                  <LucideLoader2 class="w-4 h-4 animate-spin" /> Loading...
                </span>
                <span v-else-if="!apiKey" class="text-gray-400 text-sm">No key found.</span>
                <span v-else class="text-gray-800 dark:text-gray-300 text-sm font-mono truncate block" :class="{'blur-sm select-none': !showKey}">
                  {{ apiKey }}
                </span>
              </div>
              <div class="flex items-center gap-0.5 px-1">
                <button
                  v-if="apiKey"
                  @click="showKey = !showKey"
                  class="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-all"
                  :title="showKey ? 'Hide key' : 'Show key'"
                >
                  <LucideEyeOff v-if="showKey" class="w-4 h-4" />
                  <LucideEye v-else class="w-4 h-4" />
                </button>
                <button
                  v-if="apiKey"
                  @click="copyApiKey"
                  class="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-all relative"
                  title="Copy key"
                >
                  <LucideCheck v-if="copied" class="w-4 h-4 text-accent-emerald" />
                  <LucideCopy v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Base URL Card -->
        <section class="group relative bg-white/70 dark:bg-[#0c0c1d]/60 backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent-cyan/20">
          <div class="p-6 border-b border-gray-100 dark:border-white/[0.04]">
            <div class="flex items-center gap-3 mb-1">
              <div class="p-2 bg-accent-cyan/10 rounded-xl">
                <LucideGlobe class="w-4 h-4 text-accent-cyan" />
              </div>
              <h2 class="text-base font-bold text-gray-900 dark:text-white">Base URL</h2>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 pl-[44px]">The gateway endpoint for all requests.</p>
          </div>
          <div class="p-5 bg-gray-50/50 dark:bg-black/20">
            <div class="bg-white dark:bg-[#0a0a18] border border-gray-200 dark:border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
              <code class="text-sm text-gray-800 dark:text-gray-300 font-mono">{{ config.public.apiBase }}/v1</code>
              <button @click="copyBaseUrl" class="text-gray-400 hover:text-accent-cyan transition-colors">
                <LucideCopy class="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: API Docs -->
      <div class="xl:col-span-2 space-y-6">
        <h2 class="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
          <div class="p-2 bg-primary-500/10 rounded-xl">
            <LucideBookOpen class="w-4 h-4 text-primary-400" />
          </div>
          API Reference
        </h2>

        <!-- Endpoint: Chat Completions -->
        <div class="group relative bg-white/70 dark:bg-[#0c0c1d]/60 backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary-400/20">
          <div class="p-5 border-b border-gray-100 dark:border-white/[0.04] flex items-center gap-4">
            <span class="bg-accent-blue/10 text-accent-blue text-[11px] font-bold px-3 py-1.5 rounded-lg">POST</span>
            <span class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">/chat/completions</span>
          </div>
          <div class="p-5 space-y-5">
            <p class="text-sm text-gray-500 dark:text-gray-400">Create a chat completion (OpenAI-compatible endpoint).</p>

            <div class="space-y-3">
              <h3 class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Request</h3>
              <div class="relative bg-gray-50 dark:bg-[#08081a] border border-gray-200/60 dark:border-white/[0.06] rounded-xl overflow-hidden">
                <div class="flex items-center px-4 py-2.5 bg-gray-100/80 dark:bg-white/[0.03] border-b border-gray-200/60 dark:border-white/[0.04]">
                  <div class="flex gap-1.5">
                    <div class="w-2.5 h-2.5 rounded-full bg-red-400/60"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-yellow-400/60"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-green-400/60"></div>
                  </div>
                  <div class="mx-auto text-[11px] text-gray-400 dark:text-gray-500 font-mono font-medium">cURL</div>
                </div>
                <div class="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
                  <div class="text-accent-pink dark:text-accent-pink">curl <span class="text-gray-700 dark:text-gray-400">-X POST {{ config.public.apiBase }}/v1/chat/completions \</span></div>
                  <div class="text-gray-700 dark:text-gray-400">  -H <span class="text-accent-emerald">"Content-Type: application/json"</span> \</div>
                  <div class="text-gray-700 dark:text-gray-400">  -H <span class="text-accent-emerald">"Authorization: Bearer <span class="opacity-50">{{ apiKey || '$API_KEY' }}</span>"</span> \</div>
                  <div class="text-gray-700 dark:text-gray-400">  -d <span class="text-yellow-500 dark:text-yellow-400">'{</span></div>
                  <div class="text-gray-700 dark:text-gray-400"><span class="text-yellow-500 dark:text-yellow-400">    "model": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",</span></div>
                  <div class="text-gray-700 dark:text-gray-400"><span class="text-yellow-500 dark:text-yellow-400">    "messages": [{"role": "user", "content": "Hello!"}]</span></div>
                  <div class="text-gray-700 dark:text-gray-400"><span class="text-yellow-500 dark:text-yellow-400">  }'</span></div>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Response</h3>
              <div class="relative bg-gray-50 dark:bg-[#08081a] border border-gray-200/60 dark:border-white/[0.06] rounded-xl overflow-hidden">
                <div class="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed text-gray-700 dark:text-gray-400">
<pre><code>{
  <span class="text-primary-500 dark:text-primary-400">"id"</span>: <span class="text-accent-emerald">"chatcmpl-123"</span>,
  <span class="text-primary-500 dark:text-primary-400">"object"</span>: <span class="text-accent-emerald">"chat.completion"</span>,
  <span class="text-primary-500 dark:text-primary-400">"created"</span>: <span class="text-accent-pink">1677652288</span>,
  <span class="text-primary-500 dark:text-primary-400">"choices"</span>: [{
    <span class="text-primary-500 dark:text-primary-400">"index"</span>: <span class="text-accent-pink">0</span>,
    <span class="text-primary-500 dark:text-primary-400">"message"</span>: {
      <span class="text-primary-500 dark:text-primary-400">"role"</span>: <span class="text-accent-emerald">"assistant"</span>,
      <span class="text-primary-500 dark:text-primary-400">"content"</span>: <span class="text-accent-emerald">"Hello! How can I help you?"</span>
    },
    <span class="text-primary-500 dark:text-primary-400">"finish_reason"</span>: <span class="text-accent-emerald">"stop"</span>
  }],
  <span class="text-primary-500 dark:text-primary-400">"usage"</span>: {
    <span class="text-primary-500 dark:text-primary-400">"prompt_tokens"</span>: <span class="text-accent-pink">9</span>,
    <span class="text-primary-500 dark:text-primary-400">"completion_tokens"</span>: <span class="text-accent-pink">12</span>,
    <span class="text-primary-500 dark:text-primary-400">"total_tokens"</span>: <span class="text-accent-pink">21</span>
  }
}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Endpoint: List Models -->
        <div class="group relative bg-white/70 dark:bg-[#0c0c1d]/60 backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent-emerald/20">
          <div class="p-5 border-b border-gray-100 dark:border-white/[0.04] flex items-center gap-4">
            <span class="bg-accent-emerald/10 text-accent-emerald text-[11px] font-bold px-3 py-1.5 rounded-lg">GET</span>
            <span class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">/models</span>
          </div>
          <div class="p-5 space-y-5">
            <p class="text-sm text-gray-500 dark:text-gray-400">List available models.</p>

            <div class="space-y-3">
              <div class="relative bg-gray-50 dark:bg-[#08081a] border border-gray-200/60 dark:border-white/[0.06] rounded-xl overflow-hidden">
                <div class="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed text-gray-700 dark:text-gray-400">
<pre><code>{
  <span class="text-primary-500 dark:text-primary-400">"object"</span>: <span class="text-accent-emerald">"list"</span>,
  <span class="text-primary-500 dark:text-primary-400">"data"</span>: [
    {
      <span class="text-primary-500 dark:text-primary-400">"id"</span>: <span class="text-accent-emerald">"Qwen/Qwen3-235B-A22B-Instruct-2507-FP8"</span>,
      <span class="text-primary-500 dark:text-primary-400">"object"</span>: <span class="text-accent-emerald">"model"</span>,
      <span class="text-primary-500 dark:text-primary-400">"created"</span>: <span class="text-accent-pink">1677610602</span>,
      <span class="text-primary-500 dark:text-primary-400">"owned_by"</span>: <span class="text-accent-emerald">"gonka"</span>
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

<style scoped>
.metric-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.metric-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}
.dark .metric-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.dark .metric-card:hover {
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.06);
}
</style>
