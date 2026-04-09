<template>
  <div class="flex h-screen bg-[#fafafa] dark:bg-[#050510] text-gray-900 dark:text-gray-200 transition-colors duration-500 font-sans">
    <!-- Sidebar -->
    <aside class="w-[260px] border-r border-gray-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-[#0a0a1a]/80 flex flex-col transition-all duration-500 backdrop-blur-2xl z-20 relative">
      <!-- Sidebar glow line -->
      <div class="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-primary-500/20 to-transparent dark:via-primary-500/30"></div>

      <!-- Logo -->
      <div class="p-6 pb-2">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center shadow-glow">
            <LucideZap class="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 class="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-cyan to-primary-500 dark:from-primary-300 dark:via-accent-cyan dark:to-primary-400">GonkaRouter</h1>
          </div>
        </div>
        <p class="text-[12px] text-gray-500 dark:text-gray-500 mt-2 font-medium pl-[42px]">AI Inference Gateway</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 mt-6 space-y-1">
        <NuxtLink
          to="/"
          class="nav-link flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-white/[0.04] relative group"
          active-class="!bg-primary-500/10 dark:!bg-primary-500/[0.08] !text-primary-600 dark:!text-primary-300"
          exact-active-class="!bg-primary-500/10 dark:!bg-primary-500/[0.08] !text-primary-600 dark:!text-primary-300"
        >
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-primary-400 to-accent-cyan rounded-full transition-all duration-300 opacity-0 group-[.router-link-exact-active]:h-5 group-[.router-link-exact-active]:opacity-100"></div>
          <LucideLayoutDashboard class="w-4 h-4" />
          <span>Dashboard</span>
        </NuxtLink>
        <NuxtLink
          to="/chat"
          class="nav-link flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-white/[0.04] relative group"
          active-class="!bg-primary-500/10 dark:!bg-primary-500/[0.08] !text-primary-600 dark:!text-primary-300"
          exact-active-class="!bg-primary-500/10 dark:!bg-primary-500/[0.08] !text-primary-600 dark:!text-primary-300"
        >
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-primary-400 to-accent-cyan rounded-full transition-all duration-300 opacity-0 group-[.router-link-exact-active]:h-5 group-[.router-link-exact-active]:opacity-100"></div>
          <LucideMessageSquare class="w-4 h-4" />
          <span>Chat</span>
        </NuxtLink>
        <NuxtLink
          to="/transactions"
          class="nav-link flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-white/[0.04] relative group"
          active-class="!bg-primary-500/10 dark:!bg-primary-500/[0.08] !text-primary-600 dark:!text-primary-300"
          exact-active-class="!bg-primary-500/10 dark:!bg-primary-500/[0.08] !text-primary-600 dark:!text-primary-300"
        >
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-primary-400 to-accent-cyan rounded-full transition-all duration-300 opacity-0 group-[.router-link-exact-active]:h-5 group-[.router-link-exact-active]:opacity-100"></div>
          <LucideHistory class="w-4 h-4" />
          <span>Transactions</span>
        </NuxtLink>
      </nav>

      <!-- Bottom Section -->
      <div class="p-4 space-y-4">
        <!-- Deposit Button -->
        <button
          v-if="auth.isLoggedIn"
          @click="showPaymentModal = true"
          class="group relative w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-[14px] font-semibold transition-all duration-300 overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-cyan opacity-90 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-cyan opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
          <LucideCreditCard class="w-4 h-4 text-white relative z-10" />
          <span class="text-white relative z-10">Deposit</span>
        </button>

        <div class="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.06] to-transparent"></div>

        <div class="flex items-center justify-between px-1">
          <!-- Theme Toggle -->
          <button
            @click="toggleColorMode"
            class="p-2.5 rounded-xl text-gray-500 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 dark:hover:bg-primary-500/10 transition-all duration-200"
            title="Toggle Theme"
          >
            <LucideSun v-if="colorMode.value === 'light'" class="w-4 h-4" />
            <LucideMoon v-else class="w-4 h-4" />
          </button>

          <template v-if="auth.isLoggedIn">
            <div class="flex items-center gap-2.5">
              <div class="text-right">
                <div class="text-[10px] text-primary-400 uppercase tracking-wider font-bold mb-0.5 flex items-center justify-end gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse"></span>
                  Connected
                </div>
                <div class="font-mono text-[11px] text-gray-700 dark:text-gray-300" :title="auth.user?.address">{{ auth.user?.address ? auth.user.address.slice(0, 6) + '...' + auth.user.address.slice(-4) : '...' }}</div>
              </div>
              <button @click="logout" class="p-2 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200" title="Disconnect">
                <LucideLogOut class="w-4 h-4" />
              </button>
            </div>
          </template>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto relative">
      <slot />
    </main>

    <!-- Login Modal -->
    <div v-if="!auth.isLoggedIn" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-xl transition-opacity">
      <div class="bg-white/95 dark:bg-[#0c0c1d]/95 backdrop-blur-2xl border border-gray-200/50 dark:border-primary-500/20 p-8 rounded-3xl w-full max-w-[420px] shadow-2xl dark:shadow-glow-lg animate-scale-in relative overflow-hidden">
        <!-- Decorative gradient -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-cyan to-primary-500"></div>
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl"></div>

        <div class="relative z-10">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-2xl shadow-glow flex items-center justify-center animate-float">
              <LucideWallet class="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Welcome back</h2>
          <p class="text-gray-500 dark:text-gray-400 text-[14px] text-center mb-8">Connect your MetaMask wallet to access the inference gateway.</p>

          <button
            @click="connectMetaMask"
            :disabled="!!isConnecting"
            class="relative w-full overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-500 dark:to-accent-cyan text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center space-x-2 shadow-glow"
          >
            <LucideLoader2 v-if="isConnecting" class="w-5 h-5 animate-spin relative z-10" />
            <template v-else>
              <svg class="w-5 h-5 flex-shrink-0 relative z-10 text-orange-300" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.88 1.05001C32.48 0.420006 31.73 0 30.93 0H3.97C3.17 0 2.42 0.420006 2.02 1.05001C1.61 1.68 1.66 2.5 2.15 3.08001L14.7 18.06V31.33C14.7 32.25 15.45 33 16.37 33C17.3 33 18.04 32.25 18.04 31.33V18.06L30.6 3.08001C31.09 2.5 31.28 1.68 32.88 1.05001Z" fill="currentColor"/>
              </svg>
              <span class="relative z-10">{{ hasMetaMask ? 'Connect MetaMask' : 'Install MetaMask' }}</span>
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal :is-open="showPaymentModal" @close="showPaymentModal = false" />

    <!-- Global Toasts -->
    <Toast />
  </div>
</template>

<script setup>
import {
  LucideLayoutDashboard, LucideMessageSquare, LucideCreditCard,
  LucideHistory, LucideLoader2, LucideSun, LucideMoon,
  LucideLogOut, LucideWallet, LucideZap
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { ref, onMounted } from 'vue'
import PaymentModal from '~/components/PaymentModal.vue'
import Toast from '~/components/Toast.vue'
import { useToast } from '~/composables/useToast'

const colorMode = useColorMode()
const auth = useAuthStore()
const toast = useToast()
const isConnecting = ref(false)
const hasMetaMask = ref(false)
const cachedMetaMaskProvider = ref(null)
const showPaymentModal = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

function discoverProviderByRdns(targetRdns, timeoutMs = 300) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null)
    let done = false
    const timer = setTimeout(() => { done = true; resolve(null) }, timeoutMs)
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
  if (typeof window !== 'undefined' && window.foxwallet && window.foxwallet.ethereum === p) return false
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

  const provider = cachedMetaMaskProvider.value
    || (await discoverProviderByRdns('io.metamask'))
    || findMetaMaskProviderLegacy()

  if (!provider) {
    toast.error('未检测到 MetaMask，请先安装 MetaMask 扩展。')
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
        console.warn('eth_requestAccounts failed with -32603, trying legacy enable()...', e)
        if (typeof provider.enable === 'function') {
          accounts = await provider.enable()
        } else {
          throw new Error('MetaMask 内部错误且不支持旧版 enable() 方法，请尝试刷新页面后重新连接。')
        }
      } else {
        throw e
      }
    }

    if (accounts && accounts.length > 0) {
      await auth.login(accounts[0], provider)
      toast.success('Successfully connected!')
    } else {
      throw new Error('No accounts returned from wallet.')
    }
  } catch (err) {
    console.error('MetaMask connection error:', err)
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
