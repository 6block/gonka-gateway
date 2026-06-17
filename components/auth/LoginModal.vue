<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { LucideX, LucideArrowLeft, LucideLoader2, LucideWallet } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useLoginModal } from '~/composables/useLoginModal'
import { useToast } from '~/composables/useToast'

const auth = useAuthStore()
const toast = useToast()
const { isOpen, close } = useLoginModal()
const hasGoogle = computed(() => !!(useRuntimeConfig().public.googleClientId as string))

type Step = 'account' | 'code'
const step = ref<Step>('account')
const email = ref('')
const sending = ref(false)
const verifying = ref(false)
const errorMsg = ref('')

const CODE_LENGTH = 6
const digits = ref<string[]>(Array(CODE_LENGTH).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])
const code = computed(() => digits.value.join(''))

// Turnstile is intentionally skipped for now; the backend treats an empty
// token as "no challenge configured" and falls back to its rate limiting.
const turnstileToken = ref('')

const resendIn = ref(0)
let resendTimer: ReturnType<typeof setInterval> | null = null

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))

watch(isOpen, (open: boolean) => {
  if (open) {
    reset()
    nextTick(() => emailInput.value?.focus())
  } else {
    reset()
  }
})

const emailInput = ref<HTMLInputElement | null>(null)

function reset() {
  step.value = 'account'
  sending.value = false
  verifying.value = false
  errorMsg.value = ''
  digits.value = Array(CODE_LENGTH).fill('')
  stopTimer()
  resendIn.value = 0
}

function errText(e: unknown): string {
  const data = (e as any)?.data
  return data?.error?.message || data?.message || (e as any)?.message || ''
}

// ---- Email step ----
async function sendCode() {
  if (!emailValid.value) {
    errorMsg.value = 'Please enter a valid email address.'
    return
  }
  sending.value = true
  errorMsg.value = ''
  try {
    const res = await auth.sendEmailCode(email.value.trim(), turnstileToken.value)
    step.value = 'code'
    startResend(res?.resend_after ?? 60)
    await nextTick()
    inputRefs.value[0]?.focus()
  } catch (e: unknown) {
    const retryAfter = (e as any)?.data?.retry_after
    if (retryAfter) {
      step.value = 'code'
      startResend(retryAfter)
    }
    errorMsg.value = errText(e) || 'Failed to send the code. Please try again.'
  } finally {
    sending.value = false
  }
}

async function resend() {
  if (resendIn.value > 0) return
  await sendCode()
}

// ---- Code step ----
async function submitCode() {
  if (code.value.length !== CODE_LENGTH || verifying.value) return
  verifying.value = true
  errorMsg.value = ''
  try {
    await auth.verifyEmailCode(email.value.trim(), code.value)
    toast.success('Signed in')
    close()
  } catch (e: unknown) {
    errorMsg.value = errText(e) || 'The code is incorrect or expired.'
    digits.value = Array(CODE_LENGTH).fill('')
    await nextTick()
    inputRefs.value[0]?.focus()
  } finally {
    verifying.value = false
  }
}

function onDigitInput(i: number, ev: Event) {
  const raw = (ev.target as HTMLInputElement).value.replace(/\D/g, '')
  const next = [...digits.value]
  next[i] = raw ? raw[raw.length - 1] : ''
  digits.value = next
  if (raw && i < CODE_LENGTH - 1) inputRefs.value[i + 1]?.focus()
  if (code.value.length === CODE_LENGTH) submitCode()
}

function onDigitKeydown(i: number, ev: KeyboardEvent) {
  if (ev.key === 'Backspace' && !digits.value[i] && i > 0) {
    inputRefs.value[i - 1]?.focus()
  }
}

function onPaste(ev: ClipboardEvent) {
  const text = (ev.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, CODE_LENGTH)
  if (!text) return
  ev.preventDefault()
  const next = Array(CODE_LENGTH).fill('')
  for (let k = 0; k < text.length; k++) next[k] = text[k]
  digits.value = next
  nextTick(() => inputRefs.value[Math.min(text.length, CODE_LENGTH - 1)]?.focus())
  if (text.length === CODE_LENGTH) submitCode()
}

// ---- Wallet (SIWE) — legacy/migration path for existing wallet accounts ----
const walletConnecting = ref(false)
async function signInWithWallet() {
  const eth = typeof window !== 'undefined' ? (window as any).ethereum : undefined
  if (!eth) {
    // No wallet installed → send the user to the MetaMask install page,
    // matching the legacy behavior. Opened synchronously to avoid popup blocking.
    toast.error('MetaMask not detected. Please install the MetaMask extension first.')
    if (typeof window !== 'undefined') window.open('https://metamask.io/download/', '_blank')
    return
  }
  walletConnecting.value = true
  errorMsg.value = ''
  try {
    const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
    if (!accounts?.length) throw new Error('No account authorized')
    await auth.login(accounts[0], eth)
    toast.success('Signed in')
    close()
  } catch (e: unknown) {
    errorMsg.value = errText(e) || 'Wallet sign-in failed.'
  } finally {
    walletConnecting.value = false
  }
}

// ---- Google ----
async function onGoogleToken(accessToken: string) {
  try {
    await auth.loginWithGoogle(accessToken)
    toast.success('Signed in')
    close()
  } catch (e: unknown) {
    toast.error(errText(e) || 'Google sign-in failed.')
  }
}

// ---- Resend timer ----
function startResend(seconds: number) {
  stopTimer()
  resendIn.value = seconds
  resendTimer = setInterval(() => {
    resendIn.value -= 1
    if (resendIn.value <= 0) stopTimer()
  }, 1000)
}
function stopTimer() {
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = null
  }
}
onUnmounted(stopTimer)
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen && !auth.isLoggedIn"
      class="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      @keydown.esc="close()"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-xl" @click="close()"></div>

      <div
        class="relative w-full max-w-[460px] overflow-hidden rounded-3xl border border-white/5 bg-surface-container-low p-6 shadow-2xl animate-scale-in sm:p-8"
      >
        <div
          class="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary-container/10 blur-3xl"
        ></div>

        <!-- Close -->
        <button
          class="absolute right-4 top-4 z-20 rounded-full p-2 text-text-muted transition-all hover:bg-white/5 hover:text-text-main"
          aria-label="Close"
          @click="close()"
        >
          <LucideX class="h-4 w-4" />
        </button>

        <!-- ===================== Account step ===================== -->
        <div v-if="step === 'account'" class="relative z-10">
          <h2
            id="login-modal-title"
            class="font-headline text-2xl font-black tracking-tight text-text-main sm:text-[28px]"
          >
            Sign in or create account
          </h2>
          <p class="mb-6 mt-2 text-[14px] leading-relaxed text-text-muted">
            Enter your email to continue to GonkaRouter. We will send a one-time verification code.
          </p>

          <!-- Google -->
          <template v-if="hasGoogle">
            <AuthGoogleSignInButton @token="onGoogleToken" />
            <div class="my-5 flex items-center gap-4">
              <span class="h-px flex-1 bg-white/10"></span>
              <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted"
                >or use email</span
              >
              <span class="h-px flex-1 bg-white/10"></span>
            </div>
          </template>

          <!-- Email -->
          <label class="mb-2 block text-[13px] font-bold text-text-main">Email</label>
          <input
            ref="emailInput"
            v-model="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full rounded-xl border border-white/10 bg-surface-container-high px-4 py-3.5 text-[15px] text-text-main outline-none transition-colors placeholder:text-text-muted focus:border-primary-container"
            @keydown.enter="sendCode()"
          />

          <p v-if="errorMsg" class="mt-3 text-[13px] text-red-400">{{ errorMsg }}</p>

          <button
            :disabled="sending"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-black text-primary-on transition-all kinetic-gradient hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100"
            @click="sendCode()"
          >
            <LucideLoader2 v-if="sending" class="h-5 w-5 animate-spin" />
            <span>Continue</span>
          </button>

          <p class="mt-6 text-center text-[12px] leading-relaxed text-text-muted">
            By continuing, you agree to the
            <NuxtLink to="/terms-of-service" class="font-bold text-text-main underline hover:text-primary-container"
              >Terms of Service</NuxtLink
            >
            and
            <NuxtLink to="/privacy-policy" class="font-bold text-text-main underline hover:text-primary-container"
              >Privacy Policy</NuxtLink
            >.
          </p>

          <!-- Legacy/migration path: existing wallet accounts sign in via SIWE -->
          <div class="mt-5 border-t border-white/5 pt-4 text-center">
            <button
              type="button"
              :disabled="walletConnecting"
              class="inline-flex items-center gap-1.5 text-[12px] font-bold text-text-muted transition-colors hover:text-text-main disabled:opacity-60"
              @click="signInWithWallet()"
            >
              <LucideLoader2 v-if="walletConnecting" class="h-3.5 w-3.5 animate-spin" />
              <LucideWallet v-else class="h-3.5 w-3.5" />
              Have a wallet account? Sign in with wallet
            </button>
          </div>
        </div>

        <!-- ===================== Code step ===================== -->
        <div v-else class="relative z-10">
          <button
            class="mb-6 rounded-full p-2 text-text-muted transition-all hover:bg-white/5 hover:text-text-main"
            aria-label="Back"
            @click="step = 'account'"
          >
            <LucideArrowLeft class="h-4 w-4" />
          </button>

          <h2 class="font-headline text-2xl font-black tracking-tight text-text-main sm:text-[28px]">
            Check your email to continue
          </h2>
          <p class="mt-2 text-[14px] leading-relaxed text-text-muted">
            We sent a one-time verification code to your inbox:
          </p>
          <p class="mb-7 mt-1 break-all text-[15px] font-black text-text-main">{{ email.trim() }}</p>

          <div class="flex justify-center gap-2 sm:gap-3" @paste="onPaste">
            <input
              v-for="(d, i) in digits"
              :key="i"
              :ref="(el) => { if (el) inputRefs[i] = el }"
              :value="d"
              type="text"
              inputmode="numeric"
              maxlength="1"
              autocomplete="one-time-code"
              class="h-14 w-12 rounded-xl border border-white/10 bg-surface-container-high text-center text-2xl font-black text-text-main outline-none transition-colors focus:border-primary-container sm:h-16 sm:w-14"
              @input="onDigitInput(i, $event)"
              @keydown="onDigitKeydown(i, $event)"
            />
          </div>

          <p v-if="errorMsg" class="mt-4 text-center text-[13px] text-red-400">{{ errorMsg }}</p>
          <p v-if="verifying" class="mt-4 flex items-center justify-center gap-2 text-[13px] text-text-muted">
            <LucideLoader2 class="h-4 w-4 animate-spin" /> Verifying…
          </p>

          <div class="mt-7 text-center">
            <span v-if="resendIn > 0" class="text-[13px] font-bold text-text-muted"
              >{{ resendIn }}s until resend</span
            >
            <button
              v-else
              class="text-[13px] font-bold text-primary-container hover:underline"
              @click="resend()"
            >
              Resend code
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
