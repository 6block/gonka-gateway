<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
    <div class="bg-gray-50 dark:bg-[#0a0a0a] p-8 rounded-3xl w-full max-w-lg shadow-2xl transition-colors duration-300 relative border border-gray-200 dark:border-gray-800">
      <!-- Close button -->
      <button @click="close" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
        <LucideX class="w-6 h-6" />
      </button>

      <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">Payment</h2>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <LucideLoader2 class="w-10 h-10 animate-spin text-[#22C55E] mb-4" />
        <p class="text-gray-500 font-medium">Generating deposit address...</p>
      </div>

      <div v-else-if="depositAddress">
        <div class="border border-gray-200 dark:border-gray-800 rounded-[24px] p-8 bg-white dark:bg-[#111] mb-8 shadow-sm flex flex-col items-center">
          <div class="flex items-baseline space-x-2 mb-4">
            <span class="text-[44px] font-extrabold text-[#22C55E] leading-none tracking-tight">100,000</span>
            <span class="text-xl font-bold text-[#22C55E] opacity-90 tracking-tight">Tokens/USDT</span>
          </div>
          
          <div class="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-bold flex items-center mb-8 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
            Only USDT accepted on this address
          </div>

          <div class="flex items-center gap-8 w-full justify-center">
            <div class="p-3 border-2 border-[#22C55E] rounded-xl bg-white shadow-sm">
              <qrcode-vue :value="depositAddress" :size="130" level="H" foreground="#111111" background="#ffffff" />
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center text-gray-900 dark:text-white font-bold text-[15px]">
                <LucideQrCode class="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
                Scan to Pay
              </div>
              <div class="flex items-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                <LucideShieldCheck class="w-4 h-4 mr-2" />
                Secured Transaction
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="space-y-2.5">
            <div class="text-xs font-bold text-gray-500 dark:text-gray-400">Deposit Address</div>
            <div class="flex bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 items-center shadow-sm">
              <LucideCreditCard class="w-5 h-5 text-gray-400 mx-3 flex-shrink-0" />
              <div class="flex-1 font-mono text-sm text-gray-700 dark:text-gray-300 break-all truncate mr-2">{{ depositAddress.slice(0, 14) + '...' + depositAddress.slice(-14) }}</div>
              <button @click="copyAddress" class="px-5 py-2 bg-[#22C55E] hover:bg-[#16a34a] text-white rounded-lg text-sm font-bold transition-colors flex items-center flex-shrink-0 shadow-sm">
                <LucideCheck v-if="copied" class="w-4 h-4 mr-1.5" />
                <LucideCopy v-else class="w-4 h-4 mr-1.5" />
                <span>{{ copied ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800/20 shadow-sm">
              <div class="text-xs font-medium text-gray-400 mb-2">Network</div>
              <div class="font-bold text-gray-900 dark:text-white flex items-center">
                <span class="w-2.5 h-2.5 rounded-full bg-[#22C55E] mr-2"></span>
                BEP-20
              </div>
            </div>
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800/20 shadow-sm">
              <div class="text-xs font-medium text-gray-400 mb-1">Deposit Received</div>
              <div class="font-bold text-gray-900 dark:text-white text-base">1–5 mins</div>
              <div class="text-xs font-medium text-gray-400 mt-0.5">after confirmation</div>
            </div>
          </div>
        </div>
        
        <div class="mt-8 text-center text-xs font-medium text-gray-400 flex items-center justify-center space-x-1.5">
          <LucideLock class="w-3.5 h-3.5 opacity-70" />
          <span>End-to-end encrypted · Powered by Gonka</span>
        </div>
      </div>
      
      <div v-else class="text-center py-12 text-red-500 font-medium">
        Failed to fetch deposit address. Please try again.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { LucideX, LucideLoader2, LucideQrCode, LucideShieldCheck, LucideCreditCard, LucideCopy, LucideCheck, LucideLock } from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'
import { useAuthStore } from '~/stores/auth'
import { useNuxtApp } from '#app'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const auth = useAuthStore()
const config = useNuxtApp().$config

const isLoading = ref(false)
const depositAddress = ref('')
const copied = ref(false)

const fetchDepositAddress = async () => {
  if (!auth.token) return
  
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/api/billing/deposit-address`, {
      query: { chain: 'bsc' },
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    
    if (res && res.address) {
      depositAddress.value = res.address
    }
  } catch (error) {
    console.error('Failed to fetch deposit address:', error)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal && !depositAddress.value) {
    fetchDepositAddress()
  }
})

const close = () => {
  emit('close')
}

const copyAddress = async () => {
  if (!depositAddress.value) return
  
  try {
    await navigator.clipboard.writeText(depositAddress.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>