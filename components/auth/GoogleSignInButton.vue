<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LucideLoader2 } from 'lucide-vue-next'

// Emits the Google OAuth access token. The parent exchanges it for our platform
// JWT via the auth store. Uses the OAuth 2.0 popup token flow (initTokenClient),
// which reliably opens a real Google popup on click — unlike the FedCM id_token
// button, which can silently do nothing when the GSI iframe isn't ready yet or
// the browser has no Google session.
const emit = defineEmits<{
  (e: 'token', accessToken: string): void
  (e: 'error', err: unknown): void
}>()

const config = useRuntimeConfig()
const clientId = config.public.googleClientId as string
const enabled = computed(() => !!clientId)

const isWechat = ref(false)
const loading = ref(false)
let tokenClient: any = null

async function ensureClient() {
  if (tokenClient) return tokenClient
  await loadGoogleScript()
  const google = (window as any).google
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'openid email profile',
    callback: (resp: any) => {
      loading.value = false
      if (resp?.access_token) emit('token', resp.access_token)
      else emit('error', resp)
    },
    error_callback: (err: any) => {
      loading.value = false
      // popup_closed / popup_failed_to_open etc. — not surfaced as a hard error.
      if (import.meta.dev) console.warn('google oauth error', err)
    }
  })
  return tokenClient
}

function onClick() {
  if (loading.value || isWechat.value) return
  loading.value = true
  // The popup must open in the click's user-gesture context. tokenClient is
  // pre-warmed on mount, so the common path calls requestAccessToken()
  // synchronously (no await) — avoiding popup blockers.
  if (tokenClient) {
    tokenClient.requestAccessToken()
    return
  }
  // First click before the script finished loading: init then request.
  ensureClient()
    .then((client) => client.requestAccessToken())
    .catch((e) => {
      loading.value = false
      emit('error', e)
    })
}

onMounted(() => {
  if (!enabled.value) return
  isWechat.value = /MicroMessenger/i.test(navigator.userAgent)
  // Pre-warm the GSI script + client so the first click is instant.
  if (!isWechat.value) ensureClient().catch(() => {})
})
</script>

<template>
  <div v-if="enabled" class="w-full">
    <div
      v-if="isWechat"
      class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-text-muted"
    >
      Open this page in your browser to sign in with Google.
    </div>

    <button
      v-else
      type="button"
      :disabled="loading"
      class="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white/12 bg-white/[0.04] text-[15px] font-semibold text-text-main transition-colors hover:bg-white/[0.07] disabled:opacity-70"
      @click="onClick"
    >
      <LucideLoader2 v-if="loading" class="h-5 w-5 animate-spin" />
      <svg v-else class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  </div>
</template>
