<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  LucideCreditCard,
  LucideWallet,
  LucideLogIn,
  LucideLoader2,
  LucideGlobe,
  LucideCopy,
  LucideCheck,
  LucideShieldCheck,
  LucideAlertCircle,
  LucideSend
} from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { useLoginModal } from '~/composables/useLoginModal'

definePageMeta({ layout: 'default' })
useHead({ title: 'Deposit' })

const auth = useAuthStore()
const toast = useToast()
const { open: openLogin } = useLoginModal()
const apiBase = useRuntimeConfig().public.apiBase as string

// BEP-20 (BSC) USDT — 18 decimals on BSC.
const USDT_BSC = '0x55d398326f99059fF775485246999027B3197955'
const BSC_CHAIN_ID = '0x38'
const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/

const connecting = ref(false)
const walletAddress = ref('')
const loadingAddress = ref(false)
const depositAddress = ref('')
const copied = ref(false)
const amount = ref('')
const sending = ref(false)

const shortWallet = computed(() =>
  walletAddress.value ? `${walletAddress.value.slice(0, 6)}…${walletAddress.value.slice(-4)}` : ''
)

function evmProvider(): any {
  return typeof window !== 'undefined' ? (window as any).ethereum : undefined
}

async function connectWallet() {
  const eth = evmProvider()
  if (!eth) {
    toast.error('No EVM wallet detected. Please install MetaMask.')
    return
  }
  connecting.value = true
  try {
    const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
    if (!accounts?.length) throw new Error('No account authorized')
    walletAddress.value = accounts[0]
    await ensureBscChain(eth)
    await fetchDepositAddress()
  } catch (e: unknown) {
    toast.error(errText(e) || 'Failed to connect wallet')
    walletAddress.value = ''
  } finally {
    connecting.value = false
  }
}

async function ensureBscChain(eth: any) {
  try {
    await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BSC_CHAIN_ID }] })
  } catch (e: any) {
    // 4902 = chain not added to the wallet yet.
    if (e?.code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: BSC_CHAIN_ID,
            chainName: 'BNB Smart Chain',
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            blockExplorerUrls: ['https://bscscan.com']
          }
        ]
      })
    }
  }
}

async function fetchDepositAddress() {
  if (!auth.token) return
  loadingAddress.value = true
  try {
    const res = await $fetch<any>(`${apiBase}/api/billing/deposit-address`, {
      query: { chain: 'bsc' },
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    const raw = res?.address
    if (typeof raw !== 'string' || !EVM_ADDRESS_PATTERN.test(raw)) {
      depositAddress.value = ''
      toast.error('Received an invalid deposit address. Contact support before sending funds.')
      return
    }
    try {
      const { getAddress } = await import('ethers')
      depositAddress.value = getAddress(raw)
    } catch {
      depositAddress.value = raw
    }
  } catch (e: unknown) {
    if ((e as any)?.response?.status === 401) {
      auth.logout()
      toast.error('Session expired. Please sign in again.')
    } else {
      toast.error('Failed to load deposit address. Please try again.')
    }
  } finally {
    loadingAddress.value = false
  }
}

async function copyAddress() {
  if (!depositAddress.value) return
  try {
    await navigator.clipboard.writeText(depositAddress.value)
    copied.value = true
    toast.success('Deposit address copied')
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    toast.error('Failed to copy address')
  }
}

async function sendUsdt() {
  const eth = evmProvider()
  if (!eth || !walletAddress.value || !depositAddress.value) return
  const value = Number(amount.value)
  if (!Number.isFinite(value) || value <= 0) {
    toast.error('Enter a valid amount')
    return
  }
  sending.value = true
  try {
    await ensureBscChain(eth)
    const { ethers } = await import('ethers')
    const data = new ethers.Interface(['function transfer(address,uint256)']).encodeFunctionData(
      'transfer',
      [depositAddress.value, ethers.parseUnits(amount.value, 18)]
    )
    const hash = await eth.request({
      method: 'eth_sendTransaction',
      params: [{ from: walletAddress.value, to: USDT_BSC, data }]
    })
    toast.success('Transaction submitted. Funds arrive after confirmation.')
    if (import.meta.dev) console.log('tx hash', hash)
    amount.value = ''
  } catch (e: unknown) {
    toast.error(errText(e) || 'Transaction failed or was rejected')
  } finally {
    sending.value = false
  }
}

function errText(e: unknown): string {
  return (e as any)?.data?.error?.message || (e as any)?.message || ''
}
</script>

<template>
  <div class="min-h-full px-4 py-8 sm:px-8 sm:py-12">
    <div class="mx-auto max-w-xl">
      <!-- Page header -->
      <div class="mb-8 flex items-center gap-3">
        <div class="rounded-xl bg-primary-container p-2.5 text-primary-on shadow-glow-emerald">
          <LucideCreditCard class="h-5 w-5" />
        </div>
        <div>
          <h1 class="font-headline text-2xl font-black tracking-tight text-text-main">Deposit</h1>
          <p class="text-sm text-text-muted">Add USDT funds to your GonkaRouter balance.</p>
        </div>
      </div>

      <!-- Not signed in -->
      <div
        v-if="!auth.isLoggedIn"
        class="rounded-3xl border border-white/5 bg-surface-container-low p-8 text-center"
      >
        <div
          class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high text-text-muted"
        >
          <LucideLogIn class="h-6 w-6" />
        </div>
        <h2 class="font-headline text-xl font-black text-text-main">Sign in to add funds</h2>
        <p class="mx-auto mt-2 max-w-sm text-sm text-text-muted">
          Create an account or sign in to generate your personal deposit address.
        </p>
        <button
          class="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-black text-primary-on kinetic-gradient hover:shadow-glow-emerald"
          @click="openLogin()"
        >
          <LucideLogIn class="h-4 w-4" /> Sign In
        </button>
      </div>

      <!-- Signed in, wallet not connected → connect gate (图4) -->
      <div
        v-else-if="!walletAddress"
        class="rounded-3xl border border-white/5 bg-surface-container-low p-8 text-center"
      >
        <div
          class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/10 text-primary-container"
        >
          <LucideWallet class="h-7 w-7" />
        </div>
        <h2 class="font-headline text-2xl font-black text-text-main">Connect wallet</h2>
        <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
          Link a BEP-20 wallet to unlock the Add Funds deposit address for
          <span class="font-bold text-text-main">{{ auth.displayName }}</span>.
        </p>

        <div
          class="mx-auto mt-6 max-w-sm space-y-3 rounded-2xl border border-white/5 bg-surface-container-high p-4 text-left"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="text-text-muted">Account</span>
            <span class="font-bold text-text-main">{{ auth.displayName }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-text-muted">Network</span>
            <span class="font-bold text-text-main">BEP-20 (BSC)</span>
          </div>
        </div>

        <button
          :disabled="connecting"
          class="mt-6 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-black text-primary-on kinetic-gradient hover:shadow-glow-emerald disabled:opacity-70"
          @click="connectWallet()"
        >
          <LucideLoader2 v-if="connecting" class="h-5 w-5 animate-spin" />
          <LucideWallet v-else class="h-5 w-5" />
          Connect Wallet
        </button>
      </div>

      <!-- Wallet connected → deposit address -->
      <div v-else class="space-y-4">
        <!-- Connected wallet chip -->
        <div
          class="flex items-center justify-between rounded-2xl border border-white/5 bg-surface-container-high px-4 py-3"
        >
          <div class="flex items-center gap-2.5">
            <span class="h-2 w-2 rounded-full bg-primary-container"></span>
            <span class="text-sm font-bold text-text-main">Wallet connected</span>
          </div>
          <code class="font-mono text-xs text-text-muted">{{ shortWallet }}</code>
        </div>

        <div v-if="loadingAddress" class="flex flex-col items-center justify-center py-20">
          <LucideLoader2 class="mb-4 h-8 w-8 animate-spin text-primary-container" />
          <p class="text-sm text-text-muted">Generating secure address…</p>
        </div>

        <template v-else-if="depositAddress">
          <!-- QR -->
          <div
            class="flex flex-col items-center space-y-4 rounded-[1.5rem] border border-white/5 bg-surface-container-high p-6 text-center"
          >
            <div class="rounded-2xl bg-white p-3 shadow-lg">
              <qrcode-vue :value="depositAddress" :size="168" level="H" />
            </div>
            <div class="flex items-center justify-center gap-1.5 font-bold text-text-main">
              <LucideGlobe class="h-3.5 w-3.5 text-text-muted" />
              <span class="text-xs">Scan to Pay</span>
            </div>
            <div
              class="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-red-400"
            >
              <span class="h-1 w-1 animate-pulse rounded-full bg-red-400"></span> Only Send USDT
            </div>
          </div>

          <!-- Address + copy -->
          <div class="space-y-2">
            <p class="px-1 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">
              Deposit Address
            </p>
            <div
              class="flex flex-col items-stretch gap-2 rounded-xl border border-white/5 bg-surface-container-high p-3 sm:flex-row sm:items-center"
            >
              <code class="flex-1 truncate font-mono text-[11px] text-text-main/80">{{ depositAddress }}</code>
              <button
                class="flex items-center justify-center gap-1.5 rounded-lg bg-primary-container px-4 py-2 text-[10px] font-black text-primary-on transition-all hover:shadow-glow-emerald active:scale-95"
                @click="copyAddress()"
              >
                <LucideCheck v-if="copied" class="h-3 w-3" />
                <LucideCopy v-else class="h-3 w-3" />
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </div>

          <!-- Info grid -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-2 rounded-xl border border-white/5 bg-surface-container-high p-4">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Network</p>
              <div class="flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-primary-container"></span>
                <span class="font-headline text-xs font-black text-text-main">BEP-20 (BSC)</span>
              </div>
            </div>
            <div class="space-y-0.5 rounded-xl border border-white/5 bg-surface-container-high p-4">
              <p class="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Arrival</p>
              <p class="font-headline text-xs font-black text-text-main">1-5 mins</p>
              <p class="text-[9px] text-text-muted">after block confirmation</p>
            </div>
          </div>

          <!-- Pay directly from the connected wallet -->
          <!-- <div class="space-y-2 rounded-xl border border-white/5 bg-surface-container-high p-4">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">
              Or pay from your wallet
            </p>
            <div class="flex items-stretch gap-2">
              <input
                v-model="amount"
                type="number"
                min="0"
                step="any"
                placeholder="USDT amount"
                class="w-full rounded-lg border border-white/10 bg-surface-container-low px-3 py-2.5 text-sm text-text-main outline-none focus:border-primary-container"
              />
              <button
                :disabled="sending"
                class="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-container px-4 py-2.5 text-xs font-black text-primary-on transition-all hover:shadow-glow-emerald active:scale-95 disabled:opacity-70"
                @click="sendUsdt()"
              >
                <LucideLoader2 v-if="sending" class="h-4 w-4 animate-spin" />
                <LucideSend v-else class="h-4 w-4" />
                Send
              </button>
            </div>
          </div> -->

          <div
            class="flex items-center justify-center gap-1.5 pt-1 text-[9px] font-bold uppercase tracking-widest text-text-muted"
          >
            <LucideShieldCheck class="h-3 w-3" /> Secured by GonkaRouter
          </div>
        </template>

        <!-- Address fetch failed -->
        <div v-else class="space-y-3 py-12 text-center">
          <LucideAlertCircle class="mx-auto h-10 w-10 text-red-400" />
          <p class="text-sm font-medium text-red-400">Failed to fetch deposit address.</p>
          <button
            class="rounded-xl bg-primary-container/10 px-4 py-2 text-sm font-bold text-primary-container hover:bg-primary-container/20"
            @click="fetchDepositAddress()"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
