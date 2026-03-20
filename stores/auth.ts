import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCookie, useRuntimeConfig } from '#app'
import { SiweMessage } from 'siwe'
import { getAddress } from 'ethers'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
  
  const user = useCookie<any>('auth_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })
  
  const isLoggedIn = computed(() => !!token.value)
  
  async function login(address: string, provider: any) {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase

    try {
      const checksumAddress = getAddress(address)

      // 1. Get nonce
      const { nonce } = await $fetch<any>(`${apiBase}/auth/nonce`, {
        params: { address: checksumAddress }
      })

      // 2. Prepare SIWE message
      let chainId = 1
      try {
        const chainIdHex = await provider.request({ method: 'eth_chainId' })
        chainId = parseInt(chainIdHex, 16)
      } catch (e) {
        console.warn('Failed to get chainId, defaulting to 1', e)
      }

      const message = new SiweMessage({
        domain: window.location.host,
        address: checksumAddress,
        statement: 'Sign in to Gonka AI Gateway.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce
      })
      
      const preparedMessage = message.prepareMessage()

      // 3. Sign message
      const signature = await provider.request({
        method: 'personal_sign',
        params: [preparedMessage, address] // 钱包签名时通常接收原始的小写地址
      })

      // 4. Login
      const data = await $fetch<any>(`${apiBase}/auth/login`, {
        method: 'POST',
        body: {
          address: checksumAddress,
          channel: 'gonka',
          message: preparedMessage,
          signature
        }
      })
      
      if (!data || !data.token) throw new Error('No token returned')
      
      token.value = data.token
      user.value = data.user || { address: checksumAddress }
    } catch (error) {
      console.error('Login error', error)
      throw error
    }
  }
  
  async function fetchUserInfo() {
    // 暂无获取用户信息的接口，直接依赖 cookie 中的 token 和 user
  }
  
  function logout() {
    token.value = null
    user.value = null
  }
  
  return {
    user,
    token,
    isLoggedIn,
    login,
    fetchUserInfo,
    logout
  }
})