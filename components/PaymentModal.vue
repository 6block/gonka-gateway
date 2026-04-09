<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[100] backdrop-blur-xl p-4 transition-opacity">
    <div class="bg-white/95 dark:bg-[#0c0c1d]/95 backdrop-blur-2xl p-8 rounded-3xl w-full max-w-[480px] shadow-2xl dark:shadow-glow-lg animate-scale-in relative border border-gray-200/50 dark:border-primary-500/20 overflow-hidden">
      <!-- Decorative top gradient -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-emerald pointer-events-none"></div>
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Close button -->
      <button @click="close" class="absolute top-4 right-4 p-3 rounded-xl text-gray-400 hover:text-primary-500 hover:bg-primary-500/10 transition-all z-20">
        <LucideX class="w-5 h-5" />
      </button>

      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-emerald to-accent-cyan flex items-center justify-center shadow-glow-cyan">
            <LucideCreditCard class="w-5 h-5 text-white" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Add Funds</h2>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <LucideLoader2 class="w-8 h-8 animate-spin text-primary-400 mb-4" />
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Generating secure address...</p>
        </div>

        <div v-else-if="depositAddress" class="animate-fade-in">
          <div class="border border-gray-200/60 dark:border-white/[0.06] rounded-2xl p-8 bg-gray-50 dark:bg-[#08081a]/60 mb-6 flex flex-col items-center">
            <div class="flex items-baseline space-x-1.5 mb-6">
              <span class="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-accent-emerald to-accent-cyan leading-none tracking-tight">100,000</span>
              <span class="text-sm font-semibold text-accent-emerald/70">Tokens / USDT</span>
            </div>

            <div class="p-3.5 border border-gray-200 dark:border-white/[0.06] rounded-2xl bg-white shadow-sm mb-6">
              <qrcode-vue :value="depositAddress" :size="160" level="H" foreground="#000000" background="#ffffff" />
            </div>

            <div class="flex flex-col items-center gap-2">
              <div class="flex items-center text-gray-800 dark:text-white font-bold text-sm">
                <LucideQrCode class="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                Scan to Pay
              </div>
              <div class="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
                Only send USDT
              </div>
            </div>
          </div>

          <div class="space-y-5">
            <div class="space-y-2">
              <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-1">Deposit Address</div>
              <div class="flex bg-gray-50 dark:bg-[#08081a]/60 border border-gray-200/60 dark:border-white/[0.06] rounded-xl p-1.5 items-center group transition-all hover:border-primary-500/30">
                <div class="flex-1 font-mono text-[13px] text-gray-700 dark:text-gray-300 truncate pl-3 pr-2 select-all">
                  {{ depositAddress }}
                </div>
                <button @click="copyAddress" class="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:opacity-90 text-white rounded-lg text-sm font-bold transition-all flex items-center flex-shrink-0 shadow-sm active:scale-95">
                  <LucideCheck v-if="copied" class="w-4 h-4 mr-1.5 text-accent-emerald" />
                  <LucideCopy v-else class="w-4 h-4 mr-1.5 opacity-70" />
                  <span>{{ copied ? 'Copied' : 'Copy' }}</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="border border-gray-200/60 dark:border-white/[0.06] rounded-xl p-4 bg-gray-50 dark:bg-[#08081a]/40">
                <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Network</div>
                <div class="font-bold text-gray-900 dark:text-white flex items-center text-sm">
                  <span class="w-2 h-2 rounded-full bg-accent-emerald mr-2"></span>
                  BEP-20 (BSC)
                </div>
              </div>
              <div class="border border-gray-200/60 dark:border-white/[0.06] rounded-xl p-4 bg-gray-50 dark:bg-[#08081a]/40">
                <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Arrival Time</div>
                <div class="font-bold text-gray-900 dark:text-white text-sm">1–5 mins</div>
                <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">after block confirmation</div>
              </div>
            </div>
          </div>

          <div class="mt-8 text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 flex items-center justify-center space-x-1.5">
            <LucideShieldCheck class="w-3.5 h-3.5" />
            <span>Secured by GonkaRouter</span>
          </div>
        </div>

        <div v-else class="text-center py-16">
          <LucideAlertCircle class="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p class="text-red-500 font-medium text-sm">Failed to fetch deposit address.</p>
          <button @click="fetchDepositAddress" class="mt-4 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-xl text-sm font-medium transition-all">
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  LucideX, LucideLoader2, LucideQrCode, LucideShieldCheck,
  LucideCreditCard, LucideCopy, LucideCheck, LucideAlertCircle
} from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { useNuxtApp } from '#app'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const auth = useAuthStore()
const config = useNuxtApp().$config
const toast = useToast()

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
    toast.success('Deposit address copied to clipboard')
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    toast.error('Failed to copy address')
  }
}
</script>
