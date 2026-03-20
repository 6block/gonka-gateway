<template>
  <div class="p-8 max-w-5xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold">Transaction History</h1>

    <div class="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
      <div class="p-8 text-center text-gray-500">
        <p>Transaction history is currently managed by the new gateway system.</p>
        <p class="text-sm mt-2">Check back later for updates on this feature.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
</script>