<template>
  <div class="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-black font-headline tracking-tight leading-none">
          Transactions
        </h1>
        <p class="text-text-muted mt-2 font-body text-sm">
          Immutable ledger of your gateway credits.
        </p>
      </div>
      <div
        v-if="!auth.isLoggedIn"
        class="self-start inline-flex items-center gap-3 bg-surface-container-high border border-white/5 rounded-full px-4 py-2"
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

    <div
      class="bg-surface-container-high rounded-2xl overflow-hidden border border-white/5"
    >
      <!-- Shared state placeholders (logged-out / loading / error / empty) -->
      <div v-if="!auth.isLoggedIn" class="px-6 py-16 sm:py-24 text-center">
        <div class="flex flex-col items-center justify-center gap-4 text-text-muted">
          <div
            class="w-14 h-14 rounded-2xl bg-surface-container-highest border border-white/5 flex items-center justify-center"
          >
            <LucideWallet class="w-6 h-6 text-primary-container" />
          </div>
          <div class="space-y-1 max-w-sm">
            <p class="font-headline font-bold text-base tracking-tight text-text-main">
              Connect to view transactions
            </p>
            <p class="text-sm">
              Your deposit history is private. Connect your wallet to load it.
            </p>
          </div>
          <button
            @click="openLogin"
            class="inline-flex items-center gap-2 kinetic-gradient text-primary-on px-5 py-2 rounded-full font-black text-[11px] tracking-widest uppercase hover:shadow-glow-emerald transition-all active:scale-95"
          >
            <LucideWallet class="w-3.5 h-3.5" />
            Connect Wallet
          </button>
        </div>
      </div>

      <div
        v-else-if="loading"
        class="px-6 py-16 sm:py-20 text-center text-text-muted"
      >
        <div class="flex flex-col items-center justify-center gap-3">
          <LucideLoader2 class="w-6 h-6 animate-spin text-primary-container" />
          <span class="font-medium text-sm">Loading transactions...</span>
        </div>
      </div>

      <div v-else-if="error" class="px-6 py-16 sm:py-20 text-center">
        <div
          class="inline-flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-medium"
        >
          <LucideAlertCircle class="w-4 h-4" />
          {{ error }}
        </div>
      </div>

      <div
        v-else-if="filteredItems.length === 0"
        class="px-6 py-16 sm:py-24 text-center"
      >
        <div
          class="flex flex-col items-center justify-center text-text-muted gap-4 opacity-60"
        >
          <LucideHistory class="w-10 h-10" />
          <p class="font-headline font-bold text-lg tracking-tight text-text-main">
            No transactions found
          </p>
          <p class="text-sm text-text-muted">
            There are no deposits matching your criteria.
          </p>
        </div>
      </div>

      <template v-else>
        <!-- Desktop table -->
        <div class="hidden md:block w-full overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="text-[9px] font-black text-text-muted tracking-[0.2em] uppercase border-b border-white/5"
              >
                <th class="px-8 py-5 whitespace-nowrap">Transaction Hash</th>
                <th class="px-8 py-5 whitespace-nowrap">Date &amp; Time</th>
                <th class="px-8 py-5 whitespace-nowrap">Network</th>
                <th class="px-8 py-5 whitespace-nowrap">Amount</th>
                <th class="px-8 py-5 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="item in filteredItems"
                :key="item.tx_hash"
                class="hover:bg-white/5 transition-colors group"
              >
                <td class="px-8 py-5 font-mono text-xs text-primary-dim">
                  <span :title="item.tx_hash">
                    {{ formatHash(item.tx_hash) }}
                  </span>
                </td>
                <td class="px-8 py-5 text-xs text-text-muted">
                  <div class="flex flex-col">
                    <span class="font-medium text-text-main text-[13px]">
                      {{ formatDate(item.created_at) }}
                    </span>
                    <span class="text-[11px] text-text-muted">
                      {{ formatTimeOnly(item.created_at) }}
                    </span>
                  </div>
                </td>
                <td class="px-8 py-5 text-xs font-bold">
                  <div
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-highest text-text-muted border border-white/5"
                  >
                    {{ formatChain(item.chain) }}
                  </div>
                </td>
                <td class="px-8 py-5 text-xs font-black text-text-main">
                  ${{ formatAmount(item.amount) }}
                </td>
                <td class="px-8 py-5">
                  <span
                    class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-black tracking-widest border"
                    :class="statusClasses(item.status)"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="statusDotClasses(item.status)"
                    ></span>
                    {{ statusLabel(item.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile card list -->
        <ul class="md:hidden divide-y divide-white/5">
          <li
            v-for="item in filteredItems"
            :key="item.tx_hash"
            class="px-4 sm:px-5 py-4 space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <p
                  class="font-mono text-[11px] text-primary-dim truncate"
                  :title="item.tx_hash"
                >
                  {{ formatHash(item.tx_hash) }}
                </p>
                <p class="mt-1 text-[11px] text-text-muted">
                  <span class="font-medium text-text-main">
                    {{ formatDate(item.created_at) }}
                  </span>
                  <span class="mx-1.5 opacity-50">·</span>
                  <span>{{ formatTimeOnly(item.created_at) }}</span>
                </p>
              </div>
              <span
                class="shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-black tracking-widest border"
                :class="statusClasses(item.status)"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="statusDotClasses(item.status)"
                ></span>
                {{ statusLabel(item.status) }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-3">
              <div
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-highest text-text-muted border border-white/5 text-[11px] font-bold"
              >
                {{ formatChain(item.chain) }}
              </div>
              <span class="text-sm font-black text-text-main">
                ${{ formatAmount(item.amount) }}
              </span>
            </div>
          </li>
        </ul>
      </template>

      <!-- Pagination -->
      <div
        v-if="auth.isLoggedIn && !loading && !error && total > 0"
        class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 border-t border-white/5"
      >
        <span class="text-xs text-text-muted">
          Page
          <span class="font-bold text-text-main">{{ currentPage }}</span>
          of
          <span class="font-bold text-text-main">{{ totalPages }}</span>
        </span>
        <div class="flex items-center gap-1">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="p-2 rounded-xl text-text-muted hover:bg-primary-container/10 hover:text-primary-container disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            aria-label="Previous page"
          >
            <LucideChevronLeft class="w-5 h-5" />
          </button>

          <button
            v-for="p in pageNumbers"
            :key="p"
            @click="p !== '…' && goToPage(p)"
            class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all"
            :class="[
              p === currentPage
                ? 'bg-primary-container text-primary-on shadow-lg shadow-primary-container/20'
                : p === '…'
                ? 'text-text-muted cursor-default'
                : 'text-text-muted hover:bg-primary-container/10 hover:text-primary-container'
            ]"
          >
            {{ p }}
          </button>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="p-2 rounded-xl text-text-muted hover:bg-primary-container/10 hover:text-primary-container disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            aria-label="Next page"
          >
            <LucideChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  LucideCalendar,
  LucideLoader2,
  LucideChevronLeft,
  LucideChevronRight,
  LucideAlertCircle,
  LucideHistory,
  LucideWallet
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useLoginModal } from '~/composables/useLoginModal'

const auth = useAuthStore()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
const { open: openLogin } = useLoginModal()

const PAGE_SIZE = 20

const items = ref([])
const total = ref(0)
const currentPage = ref(1)
const loading = ref(false)
const error = ref(null)
const startDate = ref('')
const endDate = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

const filteredItems = computed(() => {
  if (!startDate.value && !endDate.value) return items.value
  return items.value.filter((item) => {
    const d = new Date(item.created_at)
    if (startDate.value && d < new Date(startDate.value)) return false
    if (endDate.value && d > new Date(endDate.value + 'T23:59:59')) return false
    return true
  })
})

const pageNumbers = computed(() => {
  const tp = totalPages.value
  const cp = currentPage.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const pages = new Set([1, tp, cp, cp - 1, cp + 1].filter((p) => p >= 1 && p <= tp))
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) result.push('…')
    result.push(p)
    prev = p
  }
  return result
})

async function fetchDeposits(page = 1) {
  if (!auth.token) return
  loading.value = true
  error.value = null
  try {
    // Push the date filter to the server so cross-page filtering works.
    // The local computed `filteredItems` still applies as a defensive
    // second pass in case the backend ignores the params.
    const params = { page, page_size: PAGE_SIZE }
    if (startDate.value) params.start_date = startDate.value
    if (endDate.value) params.end_date = endDate.value

    const data = await $fetch(`${apiBase}/api/billing/deposits`, {
      params,
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    // const models = await $fetch(`${apiBase}/v1/models`, {
    //   headers: { Authorization: `Bearer ${auth.token}` }
    // })

    items.value = data.items || []
    total.value = data.total || 0
    currentPage.value = data.page || page
  } catch (e) {
    if (e?.response?.status === 401) auth.logout()
    error.value = e?.data?.message || e?.message || 'Failed to fetch transactions. Please try again.'
  } finally {
    loading.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  fetchDeposits(page)
}

function clearDateFilter() {
  startDate.value = ''
  endDate.value = ''
}

// Whenever either date input changes, reset to page 1 and refetch with
// the new filters so the user always lands on the right slice.
watch([startDate, endDate], () => {
  if (auth.isLoggedIn) fetchDeposits(1)
})

function formatHash(hash) {
  if (!hash) return '-'
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`
}

function formatDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTimeOnly(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatChain(chain) {
  const map = {
    bsc: 'BSC',
    eth: 'Ethereum',
    base: 'Base',
    polygon: 'Polygon',
    arbitrum: 'Arbitrum',
    optimism: 'Optimism'
  }
  return map[chain?.toLowerCase()] || (chain ? chain.toUpperCase() : '-')
}

function formatAmount(amount) {
  const n = parseFloat(amount)
  return isNaN(n)
    ? amount
    : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

function statusLabel(status) {
  const map = {
    credited: 'Success',
    pending: 'Pending',
    failed: 'Failed',
    confirming: 'Confirming'
  }
  return map[status?.toLowerCase()] || status || 'Unknown'
}

function statusClasses(status) {
  const s = status?.toLowerCase()
  if (s === 'credited')
    return 'bg-primary-container/10 text-primary-container border-primary-container/20'
  if (s === 'pending' || s === 'confirming')
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  if (s === 'failed') return 'bg-red-500/10 text-red-400 border-red-500/20'
  return 'bg-white/5 text-text-muted border-white/5'
}

function statusDotClasses(status) {
  const s = status?.toLowerCase()
  if (s === 'credited') return 'bg-primary-container'
  if (s === 'pending' || s === 'confirming') return 'bg-yellow-400 animate-pulse'
  if (s === 'failed') return 'bg-red-400'
  return 'bg-text-muted'
}

onMounted(() => {
  if (auth.isLoggedIn) fetchDeposits(1)
})

watch(
  () => auth.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      fetchDeposits(1)
    } else {
      items.value = []
      total.value = 0
      currentPage.value = 1
      error.value = null
    }
  }
)
</script>

<style scoped>
.date-field::-webkit-calendar-picker-indicator {
  filter: invert(0.7);
  cursor: pointer;
}
</style>
