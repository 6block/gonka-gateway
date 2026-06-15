<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { LucideShieldCheck, LucideLoader2, LucideArrowLeft } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

const auth = useAuthStore()
const toast = useToast()

// Forced upgrade applies to legacy wallet accounts that have no email yet.
// Driven purely by auth state: once an email is bound it disappears. There is
// no close button — the user must complete the upgrade.
const shouldShow = computed(
  () => auth.isLoggedIn && !!auth.user?.address && !auth.user?.email
)

type Step = 'intro' | 'email' | 'code'
const step = ref<Step>('intro')
const email = ref('')
const sending = ref(false)
const verifying = ref(false)
const errorMsg = ref('')
const otpRef = ref<{ reset: () => void; focus: () => void } | null>(null)

const resendIn = ref(0)
let resendTimer: ReturnType<typeof setInterval> | null = null

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))

watch(shouldShow, (v) => {
  if (v) {
    step.value = 'intro'
    email.value = ''
    errorMsg.value = ''
  } else {
    stopTimer()
  }
})

function errText(e: unknown): string {
  const data = (e as any)?.data
  return data?.error?.message || data?.message || (e as any)?.message || ''
}

async function sendCode() {
  if (!emailValid.value) {
    errorMsg.value = 'Please enter a valid email address.'
    return
  }
  sending.value = true
  errorMsg.value = ''
  try {
    const res = await auth.sendEmailCode(email.value.trim(), '')
    step.value = 'code'
    startResend(res?.resend_after ?? 60)
    otpRef.value?.reset()
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

async function onCode(code: string) {
  if (verifying.value) return
  verifying.value = true
  errorMsg.value = ''
  try {
    await auth.bindEmail(email.value.trim(), code)
    toast.success('Account upgraded')
    stopTimer()
    // shouldShow flips to false automatically once user.email is set.
  } catch (e: unknown) {
    errorMsg.value = errText(e) || 'The code is incorrect or expired.'
    otpRef.value?.reset()
  } finally {
    verifying.value = false
  }
}

async function resend() {
  if (resendIn.value > 0) return
  await sendCode()
}

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
      v-if="shouldShow"
      class="fixed inset-0 z-[95] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div class="absolute inset-0 bg-black/70 backdrop-blur-xl"></div>

      <div
        class="relative w-full max-w-[480px] overflow-hidden rounded-3xl border border-white/5 bg-surface-container-low p-6 shadow-2xl animate-scale-in sm:p-8"
      >
        <div
          class="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary-container/10 blur-3xl"
        ></div>

        <!-- ===== Intro ===== -->
        <div v-if="step === 'intro'" class="relative z-10">
          <div
            class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/10 text-primary-container"
          >
            <LucideShieldCheck class="h-6 w-6" />
          </div>
          <h2
            id="upgrade-modal-title"
            class="font-headline text-2xl font-black tracking-tight text-text-main"
          >
            Account Security &amp; Service Upgrade
          </h2>
          <p class="mt-3 text-[14px] leading-relaxed text-text-muted">
            GonkaRouter is upgrading its account system. Going forward, Email will serve as your
            unique and official ID for better stability and real-time alerts.
          </p>
          <p class="mt-3 text-[14px] leading-relaxed text-text-muted">
            Your wallet, API Keys, and all assets will be automatically and seamlessly linked.
            <span class="font-bold text-text-main">No data will be lost.</span>
          </p>
          <button
            class="mt-7 w-full rounded-xl py-3.5 font-black text-primary-on transition-all kinetic-gradient hover:scale-[1.01] active:scale-[0.99]"
            @click="step = 'email'"
          >
            Confirm &amp; Upgrade
          </button>
        </div>

        <!-- ===== Email ===== -->
        <div v-else-if="step === 'email'" class="relative z-10">
          <button
            class="mb-5 rounded-full p-2 text-text-muted transition-all hover:bg-white/5 hover:text-text-main"
            aria-label="Back"
            @click="step = 'intro'"
          >
            <LucideArrowLeft class="h-4 w-4" />
          </button>
          <h2 class="font-headline text-2xl font-black tracking-tight text-text-main">
            Add your email
          </h2>
          <p class="mb-6 mt-2 text-[14px] leading-relaxed text-text-muted">
            We'll send a one-time verification code to confirm it's yours.
          </p>
          <label class="mb-2 block text-[13px] font-bold text-text-main">Email</label>
          <input
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
        </div>

        <!-- ===== Code ===== -->
        <div v-else class="relative z-10">
          <button
            class="mb-5 rounded-full p-2 text-text-muted transition-all hover:bg-white/5 hover:text-text-main"
            aria-label="Back"
            @click="step = 'email'"
          >
            <LucideArrowLeft class="h-4 w-4" />
          </button>
          <h2 class="font-headline text-2xl font-black tracking-tight text-text-main">
            Verify your email
          </h2>
          <p class="mt-2 text-[14px] leading-relaxed text-text-muted">Enter the code sent to:</p>
          <p class="mb-7 mt-1 break-all text-[15px] font-black text-text-main">{{ email.trim() }}</p>

          <AuthOtpInput ref="otpRef" :disabled="verifying" @complete="onCode" />

          <p v-if="errorMsg" class="mt-4 text-center text-[13px] text-red-400">{{ errorMsg }}</p>
          <p
            v-if="verifying"
            class="mt-4 flex items-center justify-center gap-2 text-[13px] text-text-muted"
          >
            <LucideLoader2 class="h-4 w-4 animate-spin" /> Linking your account…
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
