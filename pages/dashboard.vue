<template>
  <div class="p-8 lg:p-12 max-w-6xl mx-auto space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-2xl font-black font-headline tracking-tight leading-none">
          Dashboard
        </h1>
        <p class="text-text-muted mt-2 font-body text-sm">
          Overview of your neural gateway performance.
        </p>
      </div>
      <div
        v-if="!auth.isLoggedIn"
        class="inline-flex items-center gap-3 bg-surface-container-high border border-white/5 rounded-full px-4 py-2 animate-fade-in"
      >
        <span
          class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"
          aria-hidden="true"
        ></span>
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

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in metricsDisplay"
        :key="stat.key"
        class="bg-surface-container-high p-5 rounded-2xl flex justify-between items-start hover:bg-surface-container-highest transition-all group cursor-default border border-white/5"
      >
        <div>
          <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">
            {{ stat.label }}
          </p>
          <div class="flex items-baseline gap-1.5">
            <span
              class="text-2xl font-black font-headline tracking-tight group-hover:text-primary-container transition-colors"
            >
              {{ loading ? '…' : stat.value }}
            </span>
            <span class="text-[10px] font-bold text-text-muted">{{ stat.unit }}</span>
          </div>
        </div>
        <div
          class="p-2 bg-surface-container-highest rounded-xl group-hover:scale-105 transition-transform"
        >
          <component :is="stat.icon" class="w-[18px] h-[18px]" :class="stat.iconClass" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3"
    >
      <LucideAlertCircle class="w-5 h-5 shrink-0" />
      {{ error }}
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left column: credentials -->
      <div class="lg:col-span-1 space-y-6">
        <!-- API Key -->
        <div
          class="bg-surface-container-high p-6 rounded-2xl space-y-5 border border-white/5"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-surface-container-highest rounded-xl">
              <LucideTerminal class="w-[18px] h-[18px] text-primary-container" />
            </div>
            <h3 class="font-headline font-bold text-base tracking-tight">API Key</h3>
          </div>
          <p class="text-xs text-text-muted font-body leading-relaxed">
            Authenticate your high-frequency intelligence requests.
          </p>
          <div
            class="flex items-center gap-2 bg-surface-container-lowest p-3.5 rounded-xl border border-white/5"
          >
            <code
              class="text-xs font-mono flex-1 overflow-hidden text-ellipsis text-primary-dim whitespace-nowrap"
            >
              <template v-if="!auth.isLoggedIn">-</template>
              <template v-else-if="isKeyLoading">Loading…</template>
              <template v-else-if="!apiKey">-</template>
              <template v-else-if="!showKey">**************</template>
              <template v-else>{{ apiKey }}</template>
            </code>
            <div class="flex gap-0.5">
              <button
                v-if="auth.isLoggedIn && apiKey"
                @click="showKey = !showKey"
                class="p-1.5 rounded-lg transition-all hover:text-primary-container hover:bg-white/5"
                :title="showKey ? 'Hide' : 'Show'"
              >
                <LucideEyeOff v-if="showKey" class="w-4 h-4" />
                <LucideEye v-else class="w-4 h-4" />
              </button>
              <button
                v-if="auth.isLoggedIn && apiKey"
                @click="copyApiKey"
                class="p-1.5 rounded-lg transition-all hover:text-primary-container hover:bg-white/5"
                title="Copy"
              >
                <LucideCheck v-if="copied" class="w-4 h-4 text-primary-container" />
                <LucideCopy v-else class="w-4 h-4" />
              </button>
              <button
                v-else-if="!auth.isLoggedIn"
                @click="openLogin"
                class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary-container hover:bg-primary-container/10 transition-all"
                title="Connect wallet to view"
              >
                <LucideWallet class="w-3 h-3" />
                Connect
              </button>
            </div>
          </div>
          <p
            v-if="auth.isLoggedIn && keyError && !isKeyLoading"
            class="text-xs text-red-400 font-body flex items-center gap-2"
            role="alert"
          >
            <LucideAlertCircle class="w-3.5 h-3.5 shrink-0" />
            {{ keyError }}
          </p>
        </div>

        <!-- Base URL -->
        <div
          class="bg-surface-container-high p-6 rounded-2xl space-y-5 border border-white/5"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-surface-container-highest rounded-xl">
              <LucideGlobe class="w-[18px] h-[18px] text-secondary" />
            </div>
            <h3 class="font-headline font-bold text-base tracking-tight">Base URL</h3>
          </div>
          <p class="text-xs text-text-muted font-body leading-relaxed">
            The global endpoint for sub-millisecond routing.
          </p>
          <div
            class="flex items-center gap-2 bg-surface-container-lowest p-3.5 rounded-xl border border-white/5"
          >
            <code class="text-xs font-mono flex-1 text-secondary">
              {{ config.public.apiBase }}/v1
            </code>
            <button
              @click="copyBaseUrl"
              class="p-1.5 hover:text-primary-container hover:bg-white/5 rounded-lg transition-all"
              title="Copy"
            >
              <LucideCopy class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right column: API reference -->
      <div
        class="lg:col-span-2 bg-surface-container-high p-6 rounded-2xl space-y-6 border border-white/5"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 bg-surface-container-highest rounded-xl">
            <LucideTerminal class="w-[18px] h-[18px] text-tertiary" />
          </div>
          <h3 class="font-headline font-bold text-base tracking-tight">API Reference</h3>
        </div>

        <!-- POST /chat/completions -->
        <div class="space-y-5">
          <div class="flex items-center gap-3">
            <span
              class="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded-md font-label tracking-widest border border-blue-500/20"
            >
              POST
            </span>
            <span class="font-mono text-sm font-bold tracking-tight">/chat/completions</span>
          </div>
          <p class="text-sm text-text-muted font-body font-light">
            Create a chat completion using the optimized pipeline.
          </p>

          <!-- Request -->
          <div class="space-y-2">
            <p class="text-[9px] font-black text-text-muted tracking-[0.2em] uppercase px-1">
              Request
            </p>
            <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-white/5">
              <div
                class="bg-surface-container-high px-4 py-2 flex items-center justify-between border-b border-white/5"
              >
                <span
                  class="text-[9px] font-black text-text-muted tracking-widest uppercase"
                >
                  cURL
                </span>
                <button
                  @click="copyCurl"
                  class="p-1 hover:text-primary-container transition-colors"
                  title="Copy"
                >
                  <LucideCopy class="w-3.5 h-3.5" />
                </button>
              </div>
              <div class="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <pre class="text-secondary"><code><span class="text-primary-dim">curl</span> -X POST {{ config.public.apiBase }}/v1/chat/completions \
  -H <span class="text-tertiary">"Content-Type: application/json"</span> \
  -H <span class="text-tertiary">"Authorization: Bearer {{ apiKey && showKey ? apiKey : 'sk-xxxxxx' }}"</span> \
  -d <span class="text-tertiary">'{
    "model": "moonshotai/Kimi-K2.6",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'</span></code></pre>
              </div>
            </div>
          </div>

          <!-- Response -->
          <div class="space-y-2">
            <p class="text-[9px] font-black text-text-muted tracking-[0.2em] uppercase px-1">
              Response
            </p>
            <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-white/5">
              <div
                class="bg-surface-container-high px-4 py-2 flex items-center justify-between border-b border-white/5"
              >
                <span
                  class="text-[9px] font-black text-text-muted tracking-widest uppercase"
                >
                  JSON
                </span>
                <span
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-container/10 text-primary-container text-[9px] font-black tracking-widest border border-primary-container/20"
                >
                  200 OK
                </span>
              </div>
              <div class="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <pre class="text-secondary"><code>{
  <span class="text-primary-dim">"id"</span>: <span class="text-tertiary">"chatcmpl-123"</span>,
  <span class="text-primary-dim">"object"</span>: <span class="text-tertiary">"chat.completion"</span>,
  <span class="text-primary-dim">"created"</span>: <span class="text-tertiary">1677652288</span>,
  <span class="text-primary-dim">"choices"</span>: [{
    <span class="text-primary-dim">"index"</span>: <span class="text-tertiary">0</span>,
    <span class="text-primary-dim">"message"</span>: {
      <span class="text-primary-dim">"role"</span>: <span class="text-tertiary">"assistant"</span>,
      <span class="text-primary-dim">"content"</span>: <span class="text-tertiary">"Hello! How can I help you?"</span>
    },
    <span class="text-primary-dim">"finish_reason"</span>: <span class="text-tertiary">"stop"</span>
  }],
  <span class="text-primary-dim">"usage"</span>: {
    <span class="text-primary-dim">"prompt_tokens"</span>: <span class="text-tertiary">9</span>,
    <span class="text-primary-dim">"completion_tokens"</span>: <span class="text-tertiary">12</span>,
    <span class="text-primary-dim">"total_tokens"</span>: <span class="text-tertiary">21</span>
  }
}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- GET /models -->
        <div class="space-y-5">
          <div class="flex items-center gap-3">
            <span
              class="px-2 py-0.5 bg-primary-container/10 text-primary-container text-[9px] font-black rounded-md font-label tracking-widest border border-primary-container/20"
            >
              GET
            </span>
            <span class="font-mono text-sm font-bold tracking-tight">/models</span>
          </div>
          <p class="text-sm text-text-muted font-body font-light">
            List available models.
          </p>

          <!-- Request -->
          <div class="space-y-2">
            <p class="text-[9px] font-black text-text-muted tracking-[0.2em] uppercase px-1">
              Request
            </p>
            <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-white/5">
              <div
                class="bg-surface-container-high px-4 py-2 flex items-center justify-between border-b border-white/5"
              >
                <span
                  class="text-[9px] font-black text-text-muted tracking-widest uppercase"
                >
                  cURL
                </span>
                <button
                  @click="copyCurlModels"
                  class="p-1 hover:text-primary-container transition-colors"
                  title="Copy"
                >
                  <LucideCopy class="w-3.5 h-3.5" />
                </button>
              </div>
              <div class="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <pre class="text-secondary"><code><span class="text-primary-dim">curl</span> -X GET {{ config.public.apiBase }}/v1/models \
  -H <span class="text-tertiary">"Content-Type: application/json"</span> \
  -H <span class="text-tertiary">"Authorization: Bearer {{ apiKey && showKey ? apiKey : 'sk-xxxxxx' }}"</span></code></pre>
              </div>
            </div>
          </div>

          <!-- Response -->
          <div class="space-y-2">
            <p class="text-[9px] font-black text-text-muted tracking-[0.2em] uppercase px-1">
              Response
            </p>
            <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-white/5">
              <div
                class="bg-surface-container-high px-4 py-2 flex items-center justify-between border-b border-white/5"
              >
                <span
                  class="text-[9px] font-black text-text-muted tracking-widest uppercase"
                >
                  JSON
                </span>
                <span
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-container/10 text-primary-container text-[9px] font-black tracking-widest border border-primary-container/20"
                >
                  200 OK
                </span>
              </div>
              <div class="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <pre class="text-secondary"><code>{
  <span class="text-primary-dim">"object"</span>: <span class="text-tertiary">"list"</span>,
  <span class="text-primary-dim">"data"</span>: [
    {
      <span class="text-primary-dim">"id"</span>: <span class="text-tertiary">"Qwen/Qwen3-235B-A22B-Instruct-2507-FP8"</span>,
      <span class="text-primary-dim">"object"</span>: <span class="text-tertiary">"model"</span>
    },
    {
      <span class="text-primary-dim">"id"</span>: <span class="text-tertiary">"moonshotai/Kimi-K2.6"</span>,
      <span class="text-primary-dim">"object"</span>: <span class="text-tertiary">"model"</span>
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
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import {
  LucideWallet,
  LucideZap,
  LucideTerminal,
  LucideShield,
  LucideGlobe,
  LucideEye,
  LucideEyeOff,
  LucideCopy,
  LucideCheck,
  LucideAlertCircle
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { useLoginModal } from '~/composables/useLoginModal'

const config = useRuntimeConfig()
const auth = useAuthStore()
const toast = useToast()
const { open: openLogin } = useLoginModal()

const loading = ref(false)
const error = ref(null)

const apiKey = ref('')
const isKeyLoading = ref(false)
const keyError = ref(null)
const copied = ref(false)
const showKey = ref(false)

const metrics = ref({
  balance: 0,
  currency: 'USDT',
  monthly_cost: 0,
  monthly_requests: 0,
  monthly_token_used: 0
})

const metricsDisplay = computed(() => {
  const loggedIn = auth.isLoggedIn
  return [
    {
      key: 'balance',
      label: 'Balance',
      value: loggedIn ? formatNumber(metrics.value.balance) : '-',
      unit: metrics.value.currency,
      icon: LucideWallet,
      iconClass: 'text-primary-container'
    },
    {
      key: 'monthly_cost',
      label: 'Monthly Cost',
      value: loggedIn ? formatNumber(metrics.value.monthly_cost, 5) : '-',
      unit: metrics.value.currency,
      icon: LucideZap,
      iconClass: 'text-secondary'
    },
    {
      key: 'requests',
      label: 'Requests',
      value: loggedIn ? formatInt(metrics.value.monthly_requests) : '-',
      unit: 'Reqs',
      icon: LucideTerminal,
      iconClass: 'text-tertiary'
    },
    {
      key: 'tokens',
      label: 'Tokens',
      value: loggedIn ? formatInt(metrics.value.monthly_token_used) : '-',
      unit: 'Tokens',
      icon: LucideShield,
      iconClass: 'text-primary-dim'
    }
  ]
})

// Return '-' (not '0') when the value cannot be parsed so users can tell apart
// "real zero" from "data missing / load failed".
function formatNumber(val, decimals = 2) {
  if (val === null || val === undefined || val === '') return '-'
  const n = parseFloat(val)
  if (isNaN(n)) return '-'
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  })
}

function formatInt(val) {
  if (val === null || val === undefined || val === '') return '-'
  const n = parseInt(val, 10)
  if (isNaN(n)) return '-'
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

// Mirror the same masking the rendered cURL blocks use: never put the live
// key on the clipboard while the user has it hidden.
function maskedKey() {
  return apiKey.value && showKey.value ? apiKey.value : '$API_KEY'
}

async function copyCurl() {
  const body = `curl -X POST ${config.public.apiBase}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${maskedKey()}" \\
  -d '{"model":"moonshotai/Kimi-K2.6","messages":[{"role":"user","content":"Hello!"}]}'`
  try {
    await navigator.clipboard.writeText(body)
    toast.success('cURL command copied')
  } catch (err) {
    toast.error('Failed to copy')
  }
}

async function copyCurlModels() {
  const body = `curl -X GET ${config.public.apiBase}/v1/models \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${maskedKey()}"`
  try {
    await navigator.clipboard.writeText(body)
    toast.success('cURL command copied')
  } catch (err) {
    toast.error('Failed to copy')
  }
}

async function fetchApiKey() {
  if (!auth.token) return
  isKeyLoading.value = true
  keyError.value = null
  try {
    const data = await $fetch(`${config.public.apiBase}/api/keys`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    const key = data?.items?.[0]?.key
    apiKey.value = key || ''
    if (!key) {
      keyError.value = 'No API key found on this account.'
    }
  } catch (e) {
    apiKey.value = ''
    if (e?.response?.status === 401) {
      auth.logout()
    } else {
      keyError.value = 'Failed to load API key. Please refresh the page.'
      toast.error('Failed to load API key')
    }
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

    // Response shape: { balance: { USDT: "10" }, usage: { chat: { ... } } }
    // If the shape is unexpected, surface a clear error rather than silently
    // showing $0.00 and risking the user thinking their funds are gone.
    if (!data || typeof data !== 'object') {
      throw new Error('Unexpected response from /api/me')
    }
    if (!data.balance || typeof data.balance !== 'object') {
      error.value = 'Account data is unavailable. Please refresh the page.'
      console.warn('Unexpected /api/me payload (missing balance):', data)
      return
    }

    const balanceMap = data.balance
    // Prefer USDT; fall back to whichever currency key the server returns first.
    const currency = balanceMap.USDT !== undefined
      ? 'USDT'
      : Object.keys(balanceMap)[0] || 'USDT'
    const balance = balanceMap[currency] ?? 0

    const chat = data.usage?.chat || {}

    metrics.value = {
      balance,
      currency,
      monthly_cost: chat.monthly_cost ?? 0,
      monthly_requests: chat.monthly_requests ?? 0,
      monthly_token_used: chat.monthly_token_used ?? 0
    }
  } catch (e) {
    if (e?.response?.status === 401) {
      auth.logout()
    } else {
      // Show a friendly message in the UI; keep the original error in the
      // console for ops/debugging (no dev-only gate — silent prod is the bug).
      error.value = 'Failed to load account data. Please refresh the page.'
      toast.error('Failed to load account data')
    }
    console.error('Fetch balance error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (auth.isLoggedIn) {
    fetchBalance()
    fetchApiKey()
  }
})

// React to login/logout while staying on the page.
watch(
  () => auth.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      fetchBalance()
      fetchApiKey()
    } else {
      metrics.value = {
        balance: 0,
        currency: 'USDT',
        monthly_cost: 0,
        monthly_requests: 0,
        monthly_token_used: 0
      }
      apiKey.value = ''
      showKey.value = false
      error.value = null
      keyError.value = null
    }
  }
)
</script>
