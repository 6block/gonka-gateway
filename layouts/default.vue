<template>
  <div class="flex h-screen bg-[#fafafa] dark:bg-[#000000] text-gray-900 dark:text-gray-200 transition-colors duration-300 font-sans">
    <!-- Sidebar -->
    <aside class="w-[260px] border-r border-gray-200/60 dark:border-white/[0.05] bg-white/50 dark:bg-black flex flex-col transition-colors duration-300 backdrop-blur-md z-20">
      <div class="p-6 pb-2">
        <h1 class="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">GonkaRouter</h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1 font-medium">OpenAI-compatible inference</p>
      </div>

      <nav class="flex-1 px-3 mt-6 space-y-1">
        <NuxtLink to="/" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04]" active-class="bg-gray-100/80 dark:bg-white/[0.06] text-gray-900 dark:text-white" exact-active-class="bg-gray-100/80 dark:bg-white/[0.06] text-gray-900 dark:text-white shadow-sm dark:shadow-none">
          <LucideLayoutDashboard class="w-4 h-4" />
          <span>Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/chat" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04]" active-class="bg-gray-100/80 dark:bg-white/[0.06] text-gray-900 dark:text-white" exact-active-class="bg-gray-100/80 dark:bg-white/[0.06] text-gray-900 dark:text-white shadow-sm dark:shadow-none">
          <LucideMessageSquare class="w-4 h-4" />
          <span>Chat</span>
        </NuxtLink>
        <NuxtLink to="/transactions" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04]" active-class="bg-gray-100/80 dark:bg-white/[0.06] text-gray-900 dark:text-white" exact-active-class="bg-gray-100/80 dark:bg-white/[0.06] text-gray-900 dark:text-white shadow-sm dark:shadow-none">
          <LucideHistory class="w-4 h-4" />
          <span>Transactions</span>
        </NuxtLink>
      </nav>

      <!-- User Info & Action -->
      <div class="p-4 space-y-4">
        <!-- Payment Button -->
        <button v-if="auth.isLoggedIn" @click="showPaymentModal = true" class="group relative w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-[14px] font-semibold transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-xl dark:shadow-white/10">
          <LucideCreditCard class="w-4 h-4" />
          <span>Deposit</span>
        </button>

        <div class="h-px w-full bg-gray-200/60 dark:bg-white/[0.05]"></div>

        <div class="flex items-center justify-between px-2">
          <!-- Theme Toggle -->
          <button @click="toggleColorMode" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" title="Toggle Theme">
            <LucideSun v-if="colorMode.value === 'light'" class="w-4 h-4" />
            <LucideMoon v-else class="w-4 h-4" />
          </button>

          <template v-if="auth.isLoggedIn">
            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Connected</div>
                <div class="font-mono text-[12px] text-gray-900 dark:text-white" :title="auth.user?.address">{{ auth.user?.address ? auth.user.address.slice(0, 6) + '...' + auth.user.address.slice(-4) : '...' }}</div>
              </div>
              <button @click="logout" class="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors" title="Disconnect">
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
    <div v-if="!auth.isLoggedIn" class="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 backdrop-blur-md transition-opacity">
      <div class="bg-white/90 dark:bg-[#111111]/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 p-8 rounded-2xl w-full max-w-[400px] shadow-2xl animate-scale-in">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-tr from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 rounded-2xl shadow-lg flex items-center justify-center">
            <LucideWallet class="w-8 h-8 text-white dark:text-black" />
          </div>
        </div>
        <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Welcome back</h2>
        <p class="text-gray-500 dark:text-gray-400 text-[14px] text-center mb-8">Connect your MetaMask wallet to continue to your dashboard.</p>

        <button @click="connectMetaMask" :disabled="!!isConnecting" class="relative w-full overflow-hidden bg-gray-900 dark:bg-white text-white dark:text-black font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center space-x-2 shadow-lg">
          <div class="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <LucideLoader2 v-if="isConnecting" class="w-5 h-5 animate-spin relative z-10" />
          <template v-else>
            <svg class="w-5 h-5 flex-shrink-0 relative z-10 text-[#F6851B]" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32.88 1.05001C32.48 0.420006 31.73 0 30.93 0H3.97C3.17 0 2.42 0.420006 2.02 1.05001C1.61 1.68 1.66 2.5 2.15 3.08001L14.7 18.06V31.33C14.7 32.25 15.45 33 16.37 33C17.3 33 18.04 32.25 18.04 31.33V18.06L30.6 3.08001C31.09 2.5 31.28 1.68 32.88 1.05001Z" fill="currentColor"/>
            </svg>
            <span class="relative z-10">{{ hasMetaMask ? 'Connect MetaMask' : 'Install MetaMask' }}</span>
          </template>
        </button>
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
  LucideLogOut, LucideWallet
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