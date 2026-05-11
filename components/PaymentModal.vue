<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      @keydown.esc="close"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="close"
      ></div>

      <div
        ref="dialogRef"
        tabindex="-1"
        class="relative w-full max-w-md bg-surface-container-low rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden border border-white/5 flex flex-col max-h-[95vh] animate-scale-in focus:outline-none"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-5 md:p-6 pb-2 shrink-0">
          <div class="flex items-center gap-3">
            <div
              class="p-2.5 bg-primary-container rounded-xl text-primary-on shadow-glow-emerald"
            >
              <LucideCreditCard class="w-5 h-5" />
            </div>
            <h2
              id="payment-modal-title"
              class="text-lg md:text-xl font-black font-headline tracking-tight"
            >
              Add Funds
            </h2>
          </div>
          <button
            @click="close"
            class="p-1.5 hover:bg-white/5 rounded-full transition-colors text-text-muted"
            aria-label="Close payment dialog"
            title="Close"
          >
            <LucideX class="w-5 h-5" />
          </button>
        </div>

        <div
          class="p-5 md:p-6 pt-0 space-y-4 md:space-y-5 overflow-y-auto custom-scrollbar"
        >
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <LucideLoader2 class="w-8 h-8 animate-spin text-primary-container mb-4" />
            <p class="text-sm text-text-muted font-medium">
              Generating secure address...
            </p>
          </div>

          <template v-else-if="depositAddress">
            <!-- Main QR section -->
            <div
              class="bg-surface-container-high rounded-[1.5rem] p-5 md:p-6 flex flex-col items-center text-center space-y-4 border border-white/5"
            >
              <div class="flex items-baseline gap-1.5">
                <span
                  class="text-3xl md:text-4xl font-black font-headline text-primary-container tracking-tighter"
                >
                  100,000
                </span>
                <span
                  class="text-[9px] md:text-[11px] font-bold text-primary-container/60 font-label tracking-widest uppercase"
                >
                  Tokens / USDT
                </span>
              </div>

              <div class="bg-white p-2.5 md:p-3 rounded-2xl shadow-lg">
                <qrcode-vue
                  :value="depositAddress"
                  :size="160"
                  level="H"
                  foreground="#000000"
                  background="#ffffff"
                />
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-center gap-1.5 text-text-main font-bold">
                  <LucideGlobe class="w-3.5 h-3.5 text-text-muted" />
                  <span class="text-xs tracking-tight">Scan to Pay</span>
                </div>
                <div
                  class="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border border-red-500/20"
                >
                  <span class="w-1 h-1 bg-red-400 rounded-full animate-pulse"></span>
                  Only Send USDT
                </div>
              </div>
            </div>

            <!-- Address -->
            <div class="space-y-2">
              <p
                class="text-[9px] font-black text-text-muted tracking-[0.2em] uppercase px-1"
              >
                Deposit Address
              </p>
              <div
                class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-surface-container-high p-2.5 md:p-3 rounded-xl border border-white/5"
              >
                <code
                  class="text-[10px] md:text-[11px] font-mono flex-1 overflow-hidden text-ellipsis text-text-main/80 py-1 sm:py-0 truncate"
                >
                  {{ depositAddress }}
                </code>
                <button
                  @click="copyAddress"
                  class="flex items-center justify-center gap-1.5 bg-primary-container text-primary-on px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-black text-[10px] tracking-tight hover:shadow-glow-emerald transition-all active:scale-95"
                >
                  <LucideCheck v-if="copied" class="w-3 h-3" />
                  <LucideCopy v-else class="w-3 h-3" />
                  {{ copied ? 'Copied' : 'Copy' }}
                </button>
              </div>
            </div>

            <!-- Info grid -->
            <div class="grid grid-cols-2 gap-3">
              <div
                class="bg-surface-container-high p-3.5 md:p-4 rounded-xl border border-white/5 space-y-2"
              >
                <p
                  class="text-[9px] font-black text-text-muted tracking-[0.2em] uppercase"
                >
                  Network
                </p>
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
                  <span class="text-xs font-black font-headline tracking-tight">
                    BEP-20 (BSC)
                  </span>
                </div>
              </div>
              <div
                class="bg-surface-container-high p-3.5 md:p-4 rounded-xl border border-white/5 space-y-0.5"
              >
                <p
                  class="text-[9px] font-black text-text-muted tracking-[0.2em] uppercase mb-1"
                >
                  Arrival Time
                </p>
                <p class="text-xs font-black font-headline tracking-tight">1-5 mins</p>
                <p class="text-[9px] text-text-muted font-medium">
                  after block confirmation
                </p>
              </div>
            </div>

            <div
              class="flex items-center justify-center gap-1.5 pt-1 pb-1 text-[9px] font-bold text-text-muted tracking-widest uppercase shrink-0"
            >
              <LucideShieldCheck class="w-3 h-3" />
              Secured by GonkaRouter
            </div>
          </template>

          <div v-else class="text-center py-16 space-y-3">
            <LucideAlertCircle class="w-10 h-10 text-red-400 mx-auto" />
            <p class="text-red-400 font-medium text-sm">
              Failed to fetch deposit address.
            </p>
            <button
              @click="fetchDepositAddress"
              class="mt-2 px-4 py-2 bg-primary-container/10 hover:bg-primary-container/20 text-primary-container rounded-xl text-sm font-bold transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import {
  LucideX,
  LucideLoader2,
  LucideGlobe,
  LucideShieldCheck,
  LucideCreditCard,
  LucideCopy,
  LucideCheck,
  LucideAlertCircle
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
const dialogRef = ref(null)
const depositAddress = ref('')
const copied = ref(false)

// Validate the API-supplied deposit address before showing it as a QR code.
// Without this, a compromised backend or MITM could redirect funds silently.
const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/

const fetchDepositAddress = async () => {
  if (!auth.token) return

  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/api/billing/deposit-address`, {
      query: { chain: 'bsc' },
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    const rawAddress = res?.address
    if (typeof rawAddress !== 'string' || !EVM_ADDRESS_PATTERN.test(rawAddress)) {
      depositAddress.value = ''
      toast.error('Received an invalid deposit address. Please contact support before sending funds.')
      if (import.meta.dev) {
        console.error('Invalid deposit address from API:', rawAddress)
      }
      return
    }

    // Use ethers checksum form so the displayed address matches EIP-55 expectations.
    try {
      const { getAddress } = await import('ethers')
      depositAddress.value = getAddress(rawAddress)
    } catch {
      depositAddress.value = rawAddress
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      auth.logout()
      toast.error('Session expired. Please reconnect your wallet.')
    } else {
      toast.error('Failed to load deposit address. Please try again.')
    }
    if (import.meta.dev) {
      console.error('Failed to fetch deposit address:', error)
    }
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      if (!depositAddress.value) fetchDepositAddress()
      // Move focus into the dialog so Esc / Tab work for keyboard users.
      nextTick(() => dialogRef.value?.focus())
    }
  }
)

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

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
