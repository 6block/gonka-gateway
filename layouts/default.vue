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
        <p class="text-gray-400 text-sm mb-6">Enter an address or string to login. New users get free quota.</p>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Login ID / Address</label>
            <input v-model="loginStr" type="text" required placeholder="e.g. user_123 or 0x..." class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <button type="submit" class="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors flex justify-center items-center">
            <LucideLoader2 v-if="isLoggingIn" class="w-5 h-5 animate-spin" />
            <span v-else>Login / Register</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideLayoutDashboard, LucideMessageSquare, LucideHistory, LucideLoader2 } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const loginStr = ref('')
const isLoggingIn = ref(false)

// 在服务端/客户端预取用户信息，如果 token 存在的话
await useAsyncData('user-auth', async () => {
  if (auth.token && !auth.user) {
    await auth.fetchUserInfo()
  }
  return true
})

async function handleLogin() {
  if (!loginStr.value) return
  isLoggingIn.value = true
  try {
    await auth.login(loginStr.value)
  } catch (err) {
    alert('Login failed')
  } finally {
    isLoggingIn.value = false
  }
}

function logout() {
  auth.logout()
}
</script>