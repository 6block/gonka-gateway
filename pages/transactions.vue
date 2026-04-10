<template>
  <div class="p-8 lg:p-12 max-w-7xl mx-auto space-y-8 animate-fade-in">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight mb-2">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Transactions</span>
        </h1>
        <p class="text-gray-500 dark:text-gray-500 text-sm">View your deposit history and status.</p>
      </div>
    </div>

    <div class="bg-white/70 dark:bg-[#0c0c1d]/60 backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-gray-100 dark:border-white/[0.04]">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-white dark:bg-[#0a0a18] border border-gray-200 dark:border-white/[0.06] rounded-xl px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500/30">
            <LucideCalendar class="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              v-model="startDate"
              type="date"
              class="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer w-32 appearance-none"
            />
            <span class="text-gray-300 dark:text-gray-600">—</span>
            <input
              v-model="endDate"
              type="date"
              class="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer w-32 appearance-none"
            />
          </div>
          <button
            v-if="startDate || endDate"
            @click="clearDateFilter"
            class="text-xs font-medium text-gray-500 hover:text-primary-500 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/[0.04] hover:bg-primary-500/10 dark:hover:bg-primary-500/10 transition-all"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left whitespace-nowrap">
          <thead class="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-white/[0.04]">
            <tr>
              <th scope="col" class="px-6 py-4 font-bold">Transaction Hash</th>
              <th scope="col" class="px-6 py-4 font-bold">Date & Time</th>
              <th scope="col" class="px-6 py-4 font-bold">Network</th>
              <th scope="col" class="px-6 py-4 font-bold">Amount</th>
              <th scope="col" class="px-6 py-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/[0.03]">
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-20 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center gap-3">
                  <LucideLoader2 class="w-6 h-6 animate-spin text-primary-400" />
                  <span class="font-medium text-sm text-gray-400">Loading transactions...</span>
                </div>
              </td>
            </tr>

            <!-- Error -->
            <tr v-else-if="error">
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="inline-flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-xl text-sm font-medium">
                  <LucideAlertCircle class="w-4 h-4" />
                  {{ error }}
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="filteredItems.length === 0">
              <td colspan="5" class="px-6 py-24 text-center">
                <div class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <div class="w-16 h-16 bg-gray-100 dark:bg-white/[0.04] rounded-2xl flex items-center justify-center mb-4">
                    <LucideInbox class="w-8 h-8 opacity-40" />
                  </div>
                  <p class="font-semibold text-base text-gray-500 dark:text-gray-400">No transactions found</p>
                  <p class="text-sm mt-1 text-gray-400 dark:text-gray-500">There are no deposits matching your criteria.</p>
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-else
              v-for="item in filteredItems"
              :key="item.tx_hash"
              class="hover:bg-primary-500/[0.02] dark:hover:bg-primary-500/[0.03] transition-colors duration-200 group"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center text-gray-400 dark:text-gray-500 shrink-0 group-hover:bg-primary-500/10 group-hover:text-primary-400 transition-all">
                    <LucideHash class="w-4 h-4" />
                  </div>
                  <span :title="item.tx_hash" class="font-mono text-gray-800 dark:text-gray-300 text-[13px]">
                    {{ item.tx_hash ? item.tx_hash.slice(0, 6) + '...' + item.tx_hash.slice(-6) : '-' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                <div class="flex flex-col">
                  <span class="font-medium text-gray-800 dark:text-gray-300 text-[13px]">{{ formatDate(item.created_at) }}</span>
                  <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ formatTimeOnly(item.created_at) }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 text-[12px] font-semibold border border-gray-200/50 dark:border-white/[0.04]">
                  {{ formatChain(item.chain) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="font-bold text-gray-900 dark:text-white">${{ formatAmount(item.amount) }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
                  :class="statusClasses(item.status)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClasses(item.status)"></span>
                  {{ statusLabel(item.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error && total > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-gray-100 dark:border-white/[0.04] bg-gray-50/30 dark:bg-black/10">
        <span class="text-sm text-gray-400 dark:text-gray-500">
          Page <span class="font-semibold text-gray-700 dark:text-gray-300">{{ currentPage }}</span> of <span class="font-semibold text-gray-700 dark:text-gray-300">{{ totalPages }}</span>
        </span>
        <div class="flex items-center gap-1">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="p-2 rounded-xl text-gray-400 hover:bg-primary-500/10 hover:text-primary-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <LucideChevronLeft class="w-5 h-5" />
          </button>

          <button
            v-for="p in pageNumbers"
            :key="p"
            @click="p !== '…' && goToPage(p)"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all',
              p === currentPage
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow'
                : p === '…'
                  ? 'text-gray-400 cursor-default'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-primary-500/10 hover:text-primary-500'
            ]"
          >
            {{ p }}
          </button>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="p-2 rounded-xl text-gray-400 hover:bg-primary-500/10 hover:text-primary-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <LucideChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  LucideCalendar, LucideLoader2, LucideChevronLeft,
  LucideChevronRight, LucideAlertCircle, LucideInbox,
  LucideHash
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

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
  return items.value.filter(item => {
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
  const pages = new Set([1, tp, cp, cp - 1, cp + 1].filter(p => p >= 1 && p <= tp))
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
    const data = await $fetch(`${apiBase}/api/billing/deposits`, {
      params: { page, page_size: PAGE_SIZE },
      headers: { Authorization: `Bearer ${auth.token}` }
    })
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
  const map = { bsc: 'BSC', eth: 'Ethereum', base: 'Base', polygon: 'Polygon', arbitrum: 'Arbitrum', optimism: 'Optimism' }
  return map[chain?.toLowerCase()] || (chain ? chain.toUpperCase() : '-')
}

function formatAmount(amount) {
  const n = parseFloat(amount)
  return isNaN(n) ? amount : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

function statusLabel(status) {
  const map = { credited: 'Success', pending: 'Pending', failed: 'Failed', confirming: 'Confirming' }
  return map[status?.toLowerCase()] || status || 'Unknown'
}

function statusClasses(status) {
  const s = status?.toLowerCase()
  if (s === 'credited') return 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20'
  if (s === 'pending' || s === 'confirming') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
  if (s === 'failed') return 'bg-red-500/10 text-red-500 border-red-500/20'
  return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
}

function statusDotClasses(status) {
  const s = status?.toLowerCase()
  if (s === 'credited') return 'bg-accent-emerald'
  if (s === 'pending' || s === 'confirming') return 'bg-yellow-500 animate-pulse'
  if (s === 'failed') return 'bg-red-500'
  return 'bg-gray-500'
}

onMounted(() => {
  fetchDeposits(1)
})
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}
.dark input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
