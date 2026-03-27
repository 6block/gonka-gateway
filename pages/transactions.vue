<template>
  <div class="p-8 max-w-5xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Transaction History</h1>

    <div class="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm transition-colors">
      <div class="p-8 text-center text-gray-500 dark:text-gray-400">
        <p>Coming soon...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
</script>