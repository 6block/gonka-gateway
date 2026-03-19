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
          <div class="text-xs text-gray-500 mb-1">Balance</div>
          <div class="font-medium text-green-400">{{ auth.user?.balance?.toFixed(4) }} GNK</div>
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
        
        <div class="space-y-4">
          <button @click="connectMetaMask" class="w-full bg-[#F6851B] hover:bg-[#e27618] text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center space-x-2">
            <LucideLoader2 v-if="isConnecting" class="w-5 h-5 animate-spin" />
            <div v-else class="flex items-center space-x-2">
              <svg class="w-6 h-6" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.88 1.05001C32.48 0.420006 31.73 0 30.93 0H3.97C3.17 0 2.42 0.420006 2.02 1.05001C1.61 1.68 1.66 2.5 2.15 3.08001L14.7 18.06V31.33C14.7 32.25 15.45 33 16.37 33C17.3 33 18.04 32.25 18.04 31.33V18.06L30.6 3.08001C31.09 2.5 31.28 1.68 32.88 1.05001Z" fill="white"/>
              </svg>
              <span>{{ hasEthereum ? 'Connect MetaMask' : 'Install MetaMask' }}</span>
            </div>
          </button>
        </div>
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
const hasEthereum = ref(false)

// 检查是否安装了以太坊钱包
onMounted(() => {
  if (typeof window !== 'undefined' && window.ethereum) {
    // 检查是否是真正的 MetaMask (或兼容的 provider)
    // 尽量排除已知会冲突且存在 Bug 的其他钱包插件（如 OKX Wallet 会设置 isOkxWallet）
    if (window.ethereum.isMetaMask && !window.ethereum.isOkxWallet) {
      hasEthereum.value = true
    } else if (window.ethereum.providers) {
      // 兼容安装了多个钱包的情况
      const mmProvider = window.ethereum.providers.find(p => p.isMetaMask && !p.isOkxWallet)
      if (mmProvider) hasEthereum.value = true
    }
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
  
  // 查找 MetaMask provider
  let provider = window.ethereum;
  if (window.ethereum && window.ethereum.providers) {
    provider = window.ethereum.providers.find(p => p.isMetaMask && !p.isOkxWallet) || provider;
  }
  
  const isMetaMaskInstalled = provider && provider.isMetaMask && !provider.isOkxWallet;

  if (!isMetaMaskInstalled) {
    alert('MetaMask is not installed. Please install the browser extension to continue.')
    window.open('https://metamask.io/download/', '_blank')
    return
  }

  isConnecting.value = true
  try {
    let accounts;
    
    try {
      accounts = await provider.request({ method: 'eth_requestAccounts' })
    } catch (e) {
      // Fallback for buggy injected wallets that throw internal errors
      if (e && e.code === -32603) {
        console.warn('Standard request failed, trying legacy enable()...', e)
        if (typeof provider.enable === 'function') {
          accounts = await provider.enable()
        } else {
          alert('连接失败：检测到当前浏览器的钱包插件（可能是非官方 MetaMask）发生内部错误。\n\n如果您卸载了 MetaMask 但依然看到此提示，是因为其它钱包插件（如 OKX 钱包）伪装成了 MetaMask 并且发生了崩溃。\n\n请尝试在浏览器扩展管理中禁用其它钱包插件。')
          throw new Error('Broken injected wallet provider detected (missing enable function).')
        }
      } else {
        throw e
      }
    }
    
    if (accounts && accounts.length > 0) {
      const account = accounts[0]
      await auth.login(account)
    } else {
      throw new Error('No accounts returned from wallet.')
    }
  } catch (err) {
    console.error('MetaMask connection error:', err)
    if (err && err.code === 4001) {
      alert('User rejected the connection request.')
    } else {
      alert('Failed to connect to MetaMask. ' + (err.message || ''))
    }
  } finally {
    isConnecting.value = false
  }
}

function logout() {
  auth.logout()
}
</script>