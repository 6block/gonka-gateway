<template>
  <div
    class="flex h-screen bg-surface text-text-main font-body selection:bg-primary-container selection:text-primary-on relative overflow-hidden"
  >
    <!-- Left edge accent line -->
    <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-[#5b56f1] z-30"></div>

    <!-- Sidebar -->
    <aside
      class="w-64 bg-surface-container-low border-r border-white/5 flex flex-col p-6 z-20 h-full shrink-0"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="mb-8 px-2 group cursor-pointer block">
        <span
          class="text-xl font-black text-primary-container font-headline tracking-tighter block group-hover:scale-105 transition-transform origin-left animate-pulse-soft"
        >
          GonkaRouter
        </span>
        <p class="text-[9px] font-black text-text-muted tracking-[0.2em] mt-1 uppercase">
          AI Inference Gateway
        </p>
      </NuxtLink>

      <div class="h-px bg-white/5 mb-8 mx-2"></div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-2">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-item w-full flex items-center gap-4 px-5 py-3.5 rounded-full font-bold text-[13px] tracking-tight transition-all relative group text-text-muted hover:text-text-main hover:bg-white/5 hover:translate-x-1"
          active-class="!bg-primary-container/10 !text-primary-container"
        >
          <component
            :is="link.icon"
            class="w-5 h-5 transition-colors"
          />
          <span>{{ link.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Bottom section -->
      <div class="mt-auto space-y-6">
        <template v-if="!auth.isLoggedIn">
          <div class="flex items-center gap-2">
            <button
              @click="toggleColorMode"
              class="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-container-high text-text-muted hover:text-primary-container hover:bg-white/10 transition-all border border-white/5 shrink-0"
              title="Toggle theme"
            >
              <LucideSun v-if="colorMode.value === 'light'" class="w-5 h-5" />
              <LucideMoon v-else class="w-5 h-5" />
            </button>
            <button
              @click="openLogin"
              class="flex-1 h-11 kinetic-gradient text-primary-on px-4 rounded-xl font-black text-[13px] tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-container/20 whitespace-nowrap hover:shadow-glow-emerald"
            >
              <LucideWallet class="w-4 h-4" />
              Connect Wallet
            </button>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center gap-2">
            <button
              @click="toggleColorMode"
              class="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-container-high text-text-muted hover:text-primary-container hover:bg-white/10 transition-all border border-white/5 shrink-0"
              title="Toggle theme"
            >
              <LucideSun v-if="colorMode.value === 'light'" class="w-5 h-5" />
              <LucideMoon v-else class="w-5 h-5" />
            </button>
            <button
              @click="showPaymentModal = true"
              class="flex-1 h-11 kinetic-gradient text-primary-on px-4 rounded-xl font-black text-[13px] tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-container/20 whitespace-nowrap hover:shadow-glow-emerald"
            >
              <LucideWallet class="w-4 h-4" />
              Deposit
            </button>
          </div>

          <div
            class="flex items-center justify-between bg-surface-container-high p-3 rounded-2xl border border-white/5"
          >
            <div class="flex items-center gap-2.5 mr-4 min-w-0">
              <div
                class="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center text-text-muted shrink-0"
              >
                <LucideUser class="w-4 h-4" />
              </div>
              <div class="min-w-0">
                <p
                  class="text-[12px] font-black font-headline text-text-main tracking-tight truncate"
                  :title="auth.user?.address"
                >
                  {{ formatAddress(auth.user?.address) }}
                </p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span
                    class="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse"
                  ></span>
                  <p
                    class="text-[9px] font-black text-primary-container tracking-[0.1em] uppercase leading-none"
                  >
                    Connected
                  </p>
                </div>
              </div>
            </div>
            <button
              @click="logout"
              class="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0"
              title="Disconnect"
            >
              <LucideLogOut class="w-4 h-4" />
            </button>
          </div>
        </template>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto bg-surface relative h-full">
      <slot />
    </main>

    <!-- Login modal (on-demand) -->
    <Transition name="modal-fade">
      <div
        v-if="isLoginOpen && !auth.isLoggedIn"
        class="fixed inset-0 z-[90] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        @keydown.esc="closeLoginModal()"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-xl"
          @click="closeLoginModal()"
        ></div>
        <div
          class="relative bg-surface-container-low border border-white/5 p-8 rounded-3xl w-full max-w-[420px] shadow-2xl animate-scale-in overflow-hidden"
        >
          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-dim via-primary-container to-secondary pointer-events-none"
          ></div>
          <div
            class="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"
          ></div>
          <div
            class="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none"
          ></div>

          <button
            @click="closeLoginModal()"
            class="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text-main hover:bg-white/5 transition-all z-20"
            aria-label="Close login dialog"
            title="Close"
          >
            <LucideX class="w-4 h-4" />
          </button>

          <div class="relative z-10">
            <div class="flex justify-center mb-6">
              <div
                class="w-16 h-16 bg-primary-container rounded-2xl shadow-glow-emerald flex items-center justify-center animate-float"
              >
                <LucideWallet class="w-8 h-8 text-primary-on" />
              </div>
            </div>
            <h2
              id="login-modal-title"
              class="text-2xl font-black font-headline text-center text-text-main mb-2 tracking-tight"
            >
              Connect your wallet
            </h2>
            <p class="text-text-muted text-[14px] text-center mb-8 font-body">
              Sign in with MetaMask to unlock your balance, API keys and transactions.
            </p>

            <button
              ref="loginPrimaryBtn"
              @click="connectMetaMask"
              :disabled="!!isConnecting"
              class="relative w-full overflow-hidden kinetic-gradient text-primary-on font-black py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2 shadow-glow-emerald"
            >
              <LucideLoader2 v-if="isConnecting" class="w-5 h-5 animate-spin" />
              <template v-else>
                <svg
                  class="w-5 h-5 flex-shrink-0"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28.016 4.30612L16.2731 23.3642C16.1415 23.5781 15.8584 23.5781 15.7268 23.3642L3.98393 4.30612C3.83401 4.0628 4.02677 3.75 4.31206 3.75H27.6879C27.9732 4.0628 28.1659 4.0628 28.016 4.30612Z"
                    fill="#F6851B"
                    stroke="#F6851B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>{{ hasMetaMask ? 'Connect MetaMask' : 'Install MetaMask' }}</span>
              </template>
            </button>

            <button
              @click="closeLoginModal()"
              class="block w-full text-center text-[11px] uppercase tracking-widest text-text-muted font-black mt-6 hover:text-primary-container transition-colors"
            >
              Continue as guest
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Payment modal -->
    <PaymentModal :is-open="showPaymentModal" @close="showPaymentModal = false" />

    <!-- Toasts -->
    <Toast />
  </div>
</template>

<script setup>
import {
  LucideLayoutDashboard,
  LucideMessageCircle,
  LucideHistory,
  LucideCpu,
  LucideLoader2,
  LucideSun,
  LucideMoon,
  LucideLogOut,
  LucideWallet,
  LucideUser,
  LucideX
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { ref, onMounted, nextTick, watch } from 'vue'
import PaymentModal from '~/components/PaymentModal.vue'
import Toast from '~/components/Toast.vue'
import { useToast } from '~/composables/useToast'
import { useLoginModal } from '~/composables/useLoginModal'

const colorMode = useColorMode()
const auth = useAuthStore()
const toast = useToast()
const { isOpen: isLoginOpen, open: openLoginModal, close: closeLoginModal } = useLoginModal()
const isConnecting = ref(false)
const hasMetaMask = ref(false)
const cachedMetaMaskProvider = ref(null)
const showPaymentModal = ref(false)
const loginPrimaryBtn = ref(null)

const openLogin = () => openLoginModal()

// Move keyboard focus into the dialog when it opens so screen-reader users
// land on the primary action and Esc/Tab work naturally.
watch(isLoginOpen, (open) => {
  if (open) {
    nextTick(() => {
      loginPrimaryBtn.value?.focus()
    })
  }
})

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LucideLayoutDashboard },
  { to: '/chat', label: 'Chat', icon: LucideMessageCircle },
  { to: '/models', label: 'Models', icon: LucideCpu },
  { to: '/transactions', label: 'Transactions', icon: LucideHistory }
]

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

function formatAddress(addr) {
  if (!addr) return '...'
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function discoverProviderByRdns(targetRdns, timeoutMs = 300) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null)
    let done = false
    const timer = setTimeout(() => {
      done = true
      resolve(null)
    }, timeoutMs)
    const handler = (event) => {
      const { info, provider } = event.detail || {}
      if (info?.rdns === targetRdns && !done) {
        done = true
        clearTimeout(timer)
        window.removeEventListener('eip6963:announceProvider', handler)
        resolve(provider)
      }
    }
    window.addEventListener('eip6963:announceProvider', handler)
    window.dispatchEvent(new Event('eip6963:requestProvider'))
  })
}

function isRealMetaMaskProvider(p) {
  if (!p || !p.isMetaMask) return false
  if (p.isOkxWallet || p.isFoxWallet) return false
  if (typeof window !== 'undefined' && window.foxwallet && window.foxwallet.ethereum === p)
    return false
  return true
}

function findMetaMaskProviderLegacy() {
  if (typeof window === 'undefined') return null
  const eth = window.ethereum
  if (!eth) return null
  if (eth.providers && Array.isArray(eth.providers)) {
    const mm = eth.providers.find(isRealMetaMaskProvider)
    if (mm) return mm
  }
  if (isRealMetaMaskProvider(eth)) return eth
  return null
}

onMounted(async () => {
  const mmProvider = await discoverProviderByRdns('io.metamask')
  cachedMetaMaskProvider.value = mmProvider || findMetaMaskProviderLegacy()
  hasMetaMask.value = !!cachedMetaMaskProvider.value
})

async function connectMetaMask() {
  if (typeof window === 'undefined') return

  const provider =
    cachedMetaMaskProvider.value ||
    (await discoverProviderByRdns('io.metamask')) ||
    findMetaMaskProviderLegacy()

  if (!provider) {
    toast.error('MetaMask not detected. Please install the MetaMask extension first.')
    setTimeout(() => {
      window.open('https://metamask.io/download/', '_blank')
    }, 2000)
    return
  }

  isConnecting.value = true
  try {
    let accounts
    try {
      accounts = await provider.request({ method: 'eth_requestAccounts' })
    } catch (e) {
      if (e && e.code === -32603) {
        if (import.meta.dev) console.warn('eth_requestAccounts failed with -32603, trying legacy enable()...', e)
        if (typeof provider.enable === 'function') {
          accounts = await provider.enable()
        } else {
          throw new Error(
            'MetaMask internal error and the legacy enable() method is not supported. Please refresh the page and try connecting again.'
          )
        }
      } else {
        throw e
      }
    }

    if (accounts && accounts.length > 0) {
      await auth.login(accounts[0], provider)
      toast.success('Successfully connected!')
      closeLoginModal()
    } else {
      throw new Error('No accounts returned from wallet.')
    }
  } catch (err) {
    if (import.meta.dev) console.error('MetaMask connection error:', err)
    if (err && err.code === 4001) {
      toast.info('Connection request cancelled.')
    } else {
      toast.error(`Failed to connect: ${err.message || 'Unknown error'}`)
    }
  } finally {
    isConnecting.value = false
  }
}

function logout() {
  auth.logout()
  toast.info('Logged out')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
