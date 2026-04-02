<template>
  <div class="p-8 max-w-6xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Transaction History</h1>

    <div class="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
      <!-- Toolbar -->
      <div class="flex items-center justify-end gap-4 px-6 py-4">
        <div class="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-transparent rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
          <input
            v-model="startDate"
            type="date"
            class="bg-transparent outline-none w-auto text-gray-800 dark:text-gray-300 cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <span class="text-gray-400 dark:text-gray-600">—</span>
          <input
            v-model="endDate"
            type="date"
            class="bg-transparent outline-none w-auto text-gray-800 dark:text-gray-300 cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <LucideCalendar class="w-4 h-4 ml-2 text-gray-500" />
        </div>
        <button
          v-if="startDate || endDate"
          @click="clearDateFilter"
          class="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 px-2 py-1 rounded transition-colors"
        >
          Clear
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-[#1a1a1a] border-y border-gray-200 dark:border-transparent text-gray-600 dark:text-gray-400 text-left transition-colors">
              <th class="px-6 py-4 font-medium font-sans">Hash</th>
              <th class="px-6 py-4 font-medium font-sans">Time</th>
              <th class="px-6 py-4 font-medium font-sans">Network</th>
              <th class="px-6 py-4 font-medium font-sans">Amount</th>
              <th class="px-6 py-4 font-medium font-sans">Status</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-16 text-center text-gray-500">
                <div class="flex items-center justify-center gap-2">
                  <LucideLoader2 class="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              </td>
            </tr>

            <!-- Error -->
            <tr v-else-if="error">
              <td colspan="5" class="px-6 py-16 text-center text-red-500 dark:text-red-400">
                {{ error }}
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="filteredItems.length === 0">
              <td colspan="5" class="px-6 py-16 text-center text-gray-500">
                No transactions found
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-else
              v-for="item in filteredItems"
              :key="item.tx_hash"
              class="border-b border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <!-- Hash -->
              <td class="px-6 py-5 text-gray-800 dark:text-gray-300">
                <span :title="item.tx_hash" class="cursor-default block max-w-[200px] truncate">
                  {{ item.tx_hash ? item.tx_hash.slice(0, 8).toUpperCase() + '...' + item.tx_hash.slice(-8).toUpperCase() : '-' }}
                </span>
              </td>
              <!-- Time -->
              <td class="px-6 py-5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {{ formatTime(item.created_at) }}
              </td>
              <!-- Network -->
              <td class="px-6 py-5">
                <span class="text-gray-800 dark:text-gray-300">{{ formatChain(item.chain) }}</span>
              </td>
              <!-- Amount -->
              <td class="px-6 py-5 text-gray-900 dark:text-gray-200 whitespace-nowrap">
                $ {{ formatAmount(item.amount) }}
              </td>
              <!-- Status -->
              <td class="px-6 py-5">
                <span :class="statusClass(item.status)">
                  {{ statusLabel(item.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error && total > 0" class="flex items-center justify-end gap-1 px-6 py-6 border-t border-gray-100 dark:border-transparent transition-colors">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 dark:disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <LucideChevronLeft class="w-4 h-4" />
        </button>

        <button
          v-for="p in pageNumbers"
          :key="p"
          @click="p !== '…' && goToPage(p)"
          :class="[
            'w-8 h-8 flex items-center justify-center rounded text-sm transition-colors',
            p === currentPage
              ? 'text-blue-600 dark:text-blue-500 font-medium'
              : p === '…'
                ? 'text-gray-400 dark:text-gray-600 cursor-default'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          ]"
        >
          {{ p }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 dark:disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <LucideChevronRight class="w-4 h-4" />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { LucideCalendar, LucideLoader2, LucideChevronLeft, LucideChevronRight } from 'lucide-vue-next'
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

// 日期过滤（客户端对当前页结果过滤）
const filteredItems = computed(() => {
  if (!startDate.value && !endDate.value) return items.value
  return items.value.filter(item => {
    const d = new Date(item.created_at)
    if (startDate.value && d < new Date(startDate.value)) return false
    if (endDate.value && d > new Date(endDate.value + 'T23:59:59')) return false
    return true
  })
})

// 分页按钮列表（最多显示 7 个，超出用省略号）
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
    error.value = e?.data?.message || e?.message || 'Failed to fetch transactions, please try again later.'
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

// 格式化工具
function formatTime(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function formatChain(chain) {
  const map = { bsc: 'BSC', eth: 'Ethereum', base: 'Base', polygon: 'Polygon', arbitrum: 'Arbitrum', optimism: 'Optimism' }
  return map[chain?.toLowerCase()] || (chain ? chain.toUpperCase() : '-')
}

function formatAmount(amount) {
  const n = parseFloat(amount)
  return isNaN(n) ? amount : n.toFixed(2)
}

function statusLabel(status) {
  const map = { credited: 'Success', pending: 'Pending', failed: 'Failed', confirming: 'Confirming' }
  return map[status?.toLowerCase()] || status || '-'
}

function statusClass(status) {
  const s = status?.toLowerCase()
  if (s === 'credited') return 'text-gray-900 dark:text-gray-300'
  if (s === 'pending' || s === 'confirming') return 'text-yellow-600 dark:text-yellow-400'
  if (s === 'failed') return 'text-red-600 dark:text-red-400'
  return 'text-gray-500'
}

onMounted(() => {
  fetchDeposits(1)
})
</script>
