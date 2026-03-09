<template>
  <div class="p-8 max-w-5xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold">Transaction History</h1>

    <div class="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-900 border-b border-gray-800">
          <tr>
            <th class="px-6 py-4 font-medium text-gray-400">DATE</th>
            <th class="px-6 py-4 font-medium text-gray-400">TYPE</th>
            <th class="px-6 py-4 font-medium text-gray-400">MODEL</th>
            <th class="px-6 py-4 font-medium text-gray-400">TOKENS (P/C/T)</th>
            <th class="px-6 py-4 font-medium text-gray-400">AMOUNT</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-if="pending">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">Loading...</td>
          </tr>
          <tr v-else-if="!transactions || transactions.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">No transactions found.</td>
          </tr>
          <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-900 transition-colors">
            <td class="px-6 py-4 text-gray-400">
              {{ new Date(tx.createdAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4">
              <span :class="tx.type === 'consume' ? 'text-orange-400' : 'text-green-400'" class="capitalize text-xs font-semibold">
                {{ tx.type }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-300">
              {{ tx.model || '-' }}
            </td>
            <td class="px-6 py-4 text-gray-400 text-xs">
              <span v-if="tx.promptTokens !== null">{{ tx.promptTokens }} / {{ tx.completionTokens }} / {{ tx.promptTokens + tx.completionTokens }}</span>
              <span v-else>-</span>
            </td>
            <td class="px-6 py-4 font-medium" :class="tx.amount > 0 ? 'text-green-400' : 'text-orange-400'">
              {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount.toFixed(6) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const { data, pending } = useFetch('/api/user/transactions', {
  headers: { Authorization: `Bearer ${auth.token}` },
  server: false
})

const transactions = computed(() => data.value?.transactions || [])
</script>