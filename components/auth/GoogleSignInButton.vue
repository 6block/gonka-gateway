<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Emits the raw Google ID token (credential). The parent exchanges it for our
// platform JWT via the auth store and handles UI (close modal, toast).
const emit = defineEmits<{
  (e: 'credential', credential: string): void
  (e: 'error', err: unknown): void
}>()

const config = useRuntimeConfig()
const clientId = config.public.googleClientId as string

// No client ID configured → degrade gracefully (button is simply not shown).
const enabled = computed(() => !!clientId)

const isWechat = ref(false)
const buttonHost = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!enabled.value) return
  // Google login is blocked inside the WeChat in-app browser.
  isWechat.value = /MicroMessenger/i.test(navigator.userAgent)
  if (isWechat.value) return

  try {
    await loadGoogleScript()
    const google = (window as any).google
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (resp: any) => {
        if (resp?.credential) emit('credential', resp.credential)
      }
    })

    // The native Google button isn't styleable, so it is rendered into a
    // transparent overlay sitting on top of our custom-styled button — the
    // user sees ours, but their click lands on the real Google button. Width
    // is measured (clamped to Google's 400px max) so the overlay covers it.
    if (buttonHost.value) {
      const width = Math.min(buttonHost.value.clientWidth || 360, 400)
      google.accounts.id.renderButton(buttonHost.value, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        logo_alignment: 'center',
        width
      })
    }
  } catch (e) {
    emit('error', e)
  }
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

    <div v-else class="relative h-12 w-full">
      <!-- Custom visual button (what the user sees) -->
      <div
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-3 rounded-full border border-white/12 bg-white/[0.04] text-[15px] font-semibold text-text-main"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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
      </div>

      <!-- Real Google button: transparent, on top, captures the click -->
      <div
        ref="buttonHost"
        class="absolute inset-0 z-10 flex items-center justify-center overflow-hidden opacity-0"
      ></div>
    </div>
  </div>
</template>
