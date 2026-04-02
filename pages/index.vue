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

    <!-- Instructions -->
    <div class="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-8 rounded-xl space-y-6 shadow-sm transition-colors">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">📚 API Documentation</h2>
      
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-2">Authentication</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-2">All API requests require authentication using your JWT token in the Authorization header. You receive this token upon logging in with your wallet.</p>
        <code class="block bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-transparent p-4 rounded text-sm text-blue-600 dark:text-blue-400 overflow-x-auto whitespace-nowrap transition-colors">
          Authorization: Bearer {{ auth.token ? auth.token.slice(0, 20) + '...' : '<YOUR_JWT_TOKEN>' }}
        </code>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-2">Base URL</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-2">All API requests should be made to:</p>
        <code class="block bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-transparent p-4 rounded text-sm text-blue-600 dark:text-blue-400 transition-colors">
          {{ config.public.apiBase }}/api
        </code>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-2">Example: Chat Completions</h3>
        <pre class="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-transparent p-4 rounded-xl text-sm text-gray-800 dark:text-gray-300 overflow-x-auto font-mono leading-relaxed transition-colors"><code>curl {{ config.public.apiBase }}/api/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{ auth.token ? auth.token.slice(0, 15) + '...' : '<YOUR_JWT_TOKEN>' }}" \
  -d '{
    "model": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const auth = useAuthStore()

const loading = ref(false)
const error = ref(null)

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
})
</script>
