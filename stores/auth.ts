import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
  
  const user = ref<any>(null)
  const apiKeys = ref<any[]>([])
  
  const isLoggedIn = computed(() => !!token.value)
  
  async function login(username: string) {
    try {
      const data = await $fetch<any>('/api/auth/login', {
        method: 'POST',
        body: { username }
      })
      
      if (!data) throw new Error('No data returned')
      
      token.value = data.token
      user.value = data.user
    } catch (error) {
      console.error('Login error', error)
      throw error
    }
  }
  
  async function fetchUserInfo() {
    if (!token.value) return
    
    try {
      // 在 SSR 环境和客户端环境都使用 $fetch
      // 为了让 SSR 能正确带上 cookie 和 header，Nuxt 会在上下文中处理，但我们显式传递 Token 最稳妥
      const data = await $fetch<any>('/api/user/info', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      
      if (!data) {
        throw new Error('Fetch failed')
      }
      
      user.value = data.user
      apiKeys.value = data.apiKeys
    } catch (err: any) {
      console.error('Failed to fetch user info', err)
      if (err.status === 401 || (err.response && err.response.status === 401)) {
        logout()
      }
    }
  }
  
  function logout() {
    token.value = null
    user.value = null
    apiKeys.value = []
  }
  
  return {
    user,
    apiKeys,
    token,
    isLoggedIn,
    login,
    fetchUserInfo,
    logout
  }
})