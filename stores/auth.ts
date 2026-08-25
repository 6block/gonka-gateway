import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCookie, useNuxtApp } from '#app'

type AuthMethod = 'wallet' | 'google' | 'email'

interface AuthUser {
  id?: number | string
  email?: string
  address?: string
  name?: string
  avatarUrl?: string
  authMethod?: AuthMethod
}

// This frontend always authenticates against the gonka channel.
const CHANNEL = 'gonka'

// Reports the auth outcome to analytics.
//
// isNewUser comes from the backend, which already computes it to decide on the
// signup bonus but does not yet return it. Until it does, the flag is undefined
// and everything is reported as `login` — accurate, just not split by
// registration. Once the field ships, sign-ups start being counted here with no
// further frontend change.
//
// signupSource is our own campaign tag (see useSignupSource). Attaching it to
// the conversion is what lets a landing page be tied to the accounts it
// actually produced, which page-view data alone cannot answer.
function reportAuthEvent(method: string, isNewUser: unknown, signupSource: string): void {
  const { trackSignUp, trackLogin } = useAnalytics()
  if (isNewUser === true) {
    trackSignUp(method, signupSource)
    return
  }
  trackLogin(method)
}

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  const user = useCookie<AuthUser | null>('auth_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  const isLoggedIn = computed(() => !!token.value)

  // Preferred display label: email > name > shortened wallet address.
  const displayName = computed(() => {
    const u = user.value
    if (!u) return ''
    if (u.email) return u.email
    if (u.name) return u.name
    if (u.address) return `${u.address.slice(0, 6)}…${u.address.slice(-4)}`
    return ''
  })

  function apiBase(): string {
    return useNuxtApp().$config.public.apiBase as string
  }

  // ---- Wallet (SIWE) login — unchanged, kept as a legacy/migration path ----
  async function login(address: string, provider: any) {
    if (!import.meta.client) {
      throw new Error('login() must be called from the browser')
    }

    try {
      // Dynamically import heavy Web3 deps only on the auth path,
      // keeping ethers (~700KB) and siwe (~50KB) out of the initial bundle.
      const [{ SiweMessage }, { getAddress }] = await Promise.all([
        import('siwe'),
        import('ethers')
      ])

      const checksumAddress = getAddress(address)

      const { nonce } = await $fetch<any>(`${apiBase()}/auth/nonce`, {
        params: { address: checksumAddress }
      })

      let chainId = 1
      try {
        const chainIdHex = await provider.request({ method: 'eth_chainId' })
        chainId = parseInt(chainIdHex, 16)
      } catch (e) {
        if (import.meta.dev) console.warn('Failed to get chainId, defaulting to 1', e)
      }

      const message = new SiweMessage({
        domain: window.location.host,
        address: checksumAddress,
        statement: 'Sign in to GonkaRouter.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce
      })

      const preparedMessage = message.prepareMessage()

      const signature = await provider.request({
        method: 'personal_sign',
        // wallets accept the lowercase address here, not the checksum form
        params: [preparedMessage, address]
      })

      const data = await $fetch<any>(`${apiBase()}/auth/login`, {
        method: 'POST',
        body: {
          address: checksumAddress,
          channel: CHANNEL,
          message: preparedMessage,
          signature
        }
      })

      if (!data || !data.token) throw new Error('No token returned')

      token.value = data.token
      user.value = {
        address: data.user?.address ?? checksumAddress,
        id: data.user?.id,
        name: data.user?.name ?? '',
        authMethod: 'wallet'
      }
    } catch (error) {
      if (import.meta.dev) console.error('Login error', error)
      throw error
    }
  }

  // ---- Google login — front end only obtains the Google ID token; the
  // backend verifies it and issues our platform JWT. The Google profile is
  // decoded locally purely for display, mirroring the qtum implementation. ----
  async function loginWithGoogle(accessToken: string) {
    if (!import.meta.client) {
      throw new Error('loginWithGoogle() must be called from the browser')
    }

    const signupSource = useSignupSource()
    const source = signupSource.get()
    const data = await $fetch<any>(`${apiBase()}/auth/google-login`, {
      method: 'POST',
      body: { access_token: accessToken, channel: CHANNEL, source }
    })
    if (!data || !data.token) throw new Error('No token returned')

    reportAuthEvent('google', data.is_new_user, source)

    // Attribution is consumed once the account exists; clear it either way.
    signupSource.clear()

    token.value = data.token
    user.value = {
      id: data.user?.id,
      email: data.user?.email ?? '',
      name: data.user?.name ?? '',
      avatarUrl: data.user?.avatar_url ?? '',
      authMethod: 'google'
    }
  }

  // ---- Email OTP login ----
  // Requests a one-time code. Returns the raw server payload so the caller can
  // read resend_after / handle 429 cooldown.
  async function sendEmailCode(email: string, turnstileToken: string) {
    return await $fetch<any>(`${apiBase()}/auth/email/send`, {
      method: 'POST',
      body: { email, channel: CHANNEL, turnstile_token: turnstileToken }
    })
  }

  async function verifyEmailCode(email: string, code: string) {
    const signupSource = useSignupSource()
    const source = signupSource.get()
    const data = await $fetch<any>(`${apiBase()}/auth/email/verify`, {
      method: 'POST',
      body: { email, channel: CHANNEL, code, source }
    })
    if (!data || !data.token) throw new Error('No token returned')

    reportAuthEvent('email', data.is_new_user, source)

    // Attribution is consumed once the account exists; clear it either way.
    signupSource.clear()

    token.value = data.token
    user.value = {
      id: data.user?.id,
      email: data.user?.email ?? email,
      authMethod: 'email'
    }
  }

  // Bind a verified email to the current (wallet) account — the forced upgrade.
  // The backend attaches the email, or merges a colliding account into this one,
  // and returns a fresh JWT carrying the email.
  async function bindEmail(email: string, code: string) {
    if (!token.value) throw new Error('not authenticated')
    const data = await $fetch<any>(`${apiBase()}/api/email/bind`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { email, code }
    })
    if (!data || !data.token) throw new Error('No token returned')
    token.value = data.token
    user.value = {
      ...(user.value || {}),
      id: data.user?.id,
      email: data.user?.email ?? email,
      address: data.user?.address ?? user.value?.address
    }
  }

  // Refresh user info (email, name, avatar, address) from the backend after
  // login or on a page reload where only the cookie token survived.
  async function fetchUserInfo() {
    if (!import.meta.client || !token.value) return
    try {
      const data = await $fetch<any>(`${apiBase()}/api/me`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      if (data?.user) {
        user.value = {
          ...(user.value || {}),
          id: data.user.id,
          email: data.user.email ?? user.value?.email,
          name: data.user.name ?? user.value?.name,
          avatarUrl: data.user.avatar_url ?? user.value?.avatarUrl,
          address: data.user.address ?? user.value?.address
        }
      }
    } catch (error) {
      if (import.meta.dev) console.error('fetchUserInfo failed', error)
    }
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return {
    user,
    token,
    isLoggedIn,
    displayName,
    login,
    loginWithGoogle,
    sendEmailCode,
    verifyEmailCode,
    bindEmail,
    fetchUserInfo,
    logout
  }
})
