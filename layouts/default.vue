<template>
  <div class="flex h-screen bg-[#0a0a0a] text-white">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-gray-800 flex flex-col">
      <div class="p-6">
        <h1 class="text-xl font-bold">Gonka AI Gateway</h1>
        <p class="text-xs text-gray-500 mt-1">OpenAI-compatible LLM inference</p>
      </div>

      <nav class="flex-1 px-4 space-y-2">
        <NuxtLink to="/" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-800" active-class="bg-gray-800 text-white" exact-active-class="bg-gray-800 text-white">
          <LucideLayoutDashboard class="w-5 h-5" />
          <span>Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/chat" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-800" active-class="bg-gray-800 text-white">
          <LucideMessageSquare class="w-5 h-5" />
          <span>Chat</span>
        </NuxtLink>
        <NuxtLink to="/transactions" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-800" active-class="bg-gray-800 text-white">
          <LucideHistory class="w-5 h-5" />
          <span>Transactions</span>
        </NuxtLink>
      </nav>

      <!-- User Info & Logout -->
      <div class="p-4 border-t border-gray-800" v-if="auth.isLoggedIn">
        <div class="mb-4">
          <div class="text-xs text-gray-500 mb-1">Address</div>
          <div class="font-medium text-green-400 break-all text-sm" :title="auth.user?.address">{{ auth.user?.address ? auth.user.address.slice(0, 6) + '...' + auth.user.address.slice(-4) : 'Connected' }}</div>
        </div>
        <button @click="logout" class="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

    <!-- Login Modal -->
    <div v-if="!auth.isLoggedIn" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-[#111] border border-gray-800 p-8 rounded-2xl w-full max-w-md">
        <h2 class="text-2xl font-bold mb-2">Welcome to Gonka</h2>
        <p class="text-gray-400 text-sm mb-6">Connect your MetaMask wallet to login. New users get free quota.</p>

        <button @click="connectMetaMask" :disabled="!!isConnecting" class="w-full bg-[#F6851B] hover:bg-[#e27618] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center space-x-2">
          <LucideLoader2 v-if="isConnecting" class="w-5 h-5 animate-spin" />
          <template v-else>
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32.88 1.05001C32.48 0.420006 31.73 0 30.93 0H3.97C3.17 0 2.42 0.420006 2.02 1.05001C1.61 1.68 1.66 2.5 2.15 3.08001L14.7 18.06V31.33C14.7 32.25 15.45 33 16.37 33C17.3 33 18.04 32.25 18.04 31.33V18.06L30.6 3.08001C31.09 2.5 31.28 1.68 32.88 1.05001Z" fill="white"/>
            </svg>
            <span>{{ hasMetaMask ? 'Connect MetaMask' : 'Install MetaMask' }}</span>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideLayoutDashboard, LucideMessageSquare, LucideHistory, LucideLoader2 } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { ref, onMounted } from 'vue'

const auth = useAuthStore()
const isConnecting = ref(false)
const hasMetaMask = ref(false)
const cachedMetaMaskProvider = ref(null)

/**
 * EIP-6963：通过唯一 RDNS 标识发现指定钱包的 provider。
 * 各钱包在响应 eip6963:requestProvider 时会广播自己的信息，
 * 其中 info.rdns 是全局唯一标识，不会被其他钱包伪造。
 * MetaMask 的 RDNS：'io.metamask'
 */
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

/**
 * 旧版 window.ethereum 方式检测 MetaMask（EIP-6963 不支持时的 fallback）。
 * 通过属性标志排除 OKX Wallet、FoxWallet 等伪装成 MetaMask 的钱包。
 */
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
  // 优先用 EIP-6963 精准发现（不受 window.ethereum 被其他钱包覆盖的影响）
  const mmProvider = await discoverProviderByRdns('io.metamask')
  cachedMetaMaskProvider.value = mmProvider || findMetaMaskProviderLegacy()
  hasMetaMask.value = !!cachedMetaMaskProvider.value

  if (import.meta.dev) {
    console.log('[wallet] MetaMask provider:', cachedMetaMaskProvider.value)
  }
})

// 在服务端/客户端预取用户信息，如果 token 存在的话
await useAsyncData('user-auth', async () => {
  if (auth.token && !auth.user) {
    await auth.fetchUserInfo()
  }
  return true
})

async function connectMetaMask() {
  if (typeof window === 'undefined') return

  // 优先用缓存的 provider，若未缓存则实时重新发现
  const provider = cachedMetaMaskProvider.value
    || (await discoverProviderByRdns('io.metamask'))
    || findMetaMaskProviderLegacy()

  if (!provider) {
    alert('未检测到 MetaMask，请先安装 MetaMask 扩展。')
    window.open('https://metamask.io/download/', '_blank')
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
          throw new Error('MetaMask 内部错误且不支持旧版 enable() 方法，请尝试刷新页面后重新连接，或重新安装 MetaMask 扩展。')
        }
      } else {
        throw e
      }
    }

    if (accounts && accounts.length > 0) {
      await auth.login(accounts[0], provider)
    } else {
      throw new Error('No accounts returned from wallet.')
    }
  } catch (err) {
    console.error('MetaMask connection error:', err)
    if (err && err.code === 4001) {
      alert('用户取消了连接请求。')
    } else {
      alert(`连接 MetaMask 失败：${err.message || '未知错误'}`)
    }
  } finally {
    isConnecting.value = false
  }
}

function logout() {
  auth.logout()
}
</script>
