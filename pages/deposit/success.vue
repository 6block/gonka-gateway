<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  LucideCheckCircle2,
  LucideLoader2,
  LucideAlertCircle,
  LucideClock,
  LucideLogIn,
  LucideArrowRight,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useLoginModal } from '~/composables/useLoginModal'
import { useTopup, formatUsd, type StripeOrder } from '~/composables/useTopup'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Payment status', robots: 'noindex,nofollow' })

// Stripe redirects here as soon as the payment is submitted; crediting
// happens a moment later (webhook, or the backend asking Stripe on this poll).
const POLL_INTERVAL_MS = 3000
const POLL_MAX_ATTEMPTS = 40 // ~2 minutes, then ask the user to check later

const auth = useAuthStore()
const route = useRoute()
const { open: openLogin } = useLoginModal()
const { fetchOrder, errorStatus } = useTopup()

const orderNo = computed(() => (typeof route.query.order_no === 'string' ? route.query.order_no : ''))
const order = ref<StripeOrder | null>(null)
const loadError = ref('')
const gaveUp = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined
let attempts = 0

async function poll() {
  if (!orderNo.value || !auth.token) return
  attempts++
  try {
    order.value = await fetchOrder(orderNo.value)
    loadError.value = ''
  } catch (e: unknown) {
    const status = errorStatus(e)
    if (status === 401) {
      auth.logout()
      return
    }
    if (status === 404) {
      loadError.value = 'We could not find this order on your account.'
      return
    }
    // Transient: keep polling, the backend or network may be slow.
  }
  if (order.value?.status !== 'created') return
  if (attempts >= POLL_MAX_ATTEMPTS) {
    gaveUp.value = true
    return
  }
  timer = setTimeout(poll, POLL_INTERVAL_MS)
}

onMounted(poll)
onBeforeUnmount(() => clearTimeout(timer))

// Signing in from this page (returned in a fresh session) starts the poll.
watch(
  () => auth.token,
  (token, prev) => {
    if (token && !prev && !order.value) {
      attempts = 0
      poll()
    }
  }
)

const resumeUrl = computed(() => {
  const raw = order.value?.checkout_url
  if (!raw) return ''
  try {
    const u = new URL(raw)
    return u.protocol === 'https:' && u.hostname === 'checkout.stripe.com' ? raw : ''
  } catch {
    return ''
  }
})

const state = computed<'missing' | 'loading' | 'pending' | 'credited' | 'closed' | 'error'>(() => {
  if (!orderNo.value) return 'missing'
  if (loadError.value) return 'error'
  if (!order.value) return 'loading'
  if (order.value.status === 'credited') return 'credited'
  if (order.value.status === 'expired' || order.value.status === 'failed') return 'closed'
  return 'pending'
})
</script>

<template>
  <div class="min-h-full px-4 py-8 sm:px-8 sm:py-12">
    <div class="mx-auto max-w-xl">
      <!-- Not signed in (e.g. returned in another browser) -->
      <div
        v-if="!auth.isLoggedIn"
        class="rounded-3xl border border-white/5 bg-surface-container-low p-8 text-center"
      >
        <LucideLogIn class="mx-auto mb-4 h-8 w-8 text-text-muted" />
        <h1 class="font-headline text-xl font-black text-text-main">Sign in to see your payment</h1>
        <p class="mx-auto mt-2 max-w-sm text-sm text-text-muted">
          Your payment is safe either way: it is credited to the account that started it.
        </p>
        <button
          class="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-black text-primary-on kinetic-gradient hover:shadow-glow-emerald"
          @click="openLogin()"
        >
          <LucideLogIn class="h-4 w-4" /> Sign In
        </button>
      </div>

      <div
        v-else
        class="rounded-3xl border border-white/5 bg-surface-container-low p-8 text-center"
        aria-live="polite"
      >
        <!-- Credited -->
        <template v-if="state === 'credited' && order">
          <LucideCheckCircle2 class="mx-auto mb-4 h-12 w-12 text-primary-container" />
          <h1 class="font-headline text-2xl font-black text-text-main">Payment received</h1>
          <p class="mt-2 text-sm text-text-muted">Your balance has been topped up.</p>

          <dl class="mx-auto mt-6 max-w-sm divide-y divide-white/5 rounded-2xl border border-white/5 bg-surface-container-high px-4 text-left text-sm">
            <div class="flex justify-between py-3">
              <dt class="text-text-muted">Paid</dt>
              <dd class="font-bold text-text-main">{{ formatUsd(order.amount) }}</dd>
            </div>
            <div v-if="Number(order.bonus) > 0" class="flex justify-between py-3">
              <dt class="text-text-muted">Bonus</dt>
              <dd class="font-bold text-primary-container">+{{ formatUsd(order.bonus ?? 0) }}</dd>
            </div>
            <div class="flex justify-between py-3">
              <dt class="font-bold text-text-main">Credited</dt>
              <dd class="font-headline font-black text-primary-container">{{ formatUsd(order.total ?? order.amount) }}</dd>
            </div>
          </dl>
        </template>

        <!-- Waiting for confirmation -->
        <template v-else-if="state === 'loading' || (state === 'pending' && !gaveUp)">
          <LucideLoader2 class="mx-auto mb-4 h-10 w-10 animate-spin text-primary-container" />
          <h1 class="font-headline text-xl font-black text-text-main">Confirming your payment…</h1>
          <p class="mt-2 text-sm text-text-muted">This usually takes a few seconds. You can keep this page open.</p>
        </template>

        <!-- Still pending after polling -->
        <template v-else-if="state === 'pending' && gaveUp">
          <LucideClock class="mx-auto mb-4 h-10 w-10 text-text-muted" />
          <h1 class="font-headline text-xl font-black text-text-main">Still confirming</h1>
          <p class="mx-auto mt-2 max-w-sm text-sm text-text-muted">
            Some payment methods take longer to settle. Your balance updates automatically once
            Stripe confirms it; check Transactions in a few minutes.
          </p>
          <a
            v-if="resumeUrl"
            :href="resumeUrl"
            class="mt-4 inline-block text-sm font-bold text-primary-container hover:underline"
          >
            Didn't finish paying? Return to checkout
          </a>
        </template>

        <!-- Expired / failed -->
        <template v-else-if="state === 'closed'">
          <LucideAlertCircle class="mx-auto mb-4 h-10 w-10 text-red-400" />
          <h1 class="font-headline text-xl font-black text-text-main">Payment not completed</h1>
          <p class="mt-2 text-sm text-text-muted">
            This checkout {{ order?.status === 'expired' ? 'expired' : 'did not go through' }}. No charge was made.
          </p>
        </template>

        <!-- Missing / unknown order -->
        <template v-else>
          <LucideAlertCircle class="mx-auto mb-4 h-10 w-10 text-red-400" />
          <h1 class="font-headline text-xl font-black text-text-main">Order not found</h1>
          <p class="mt-2 text-sm text-text-muted">{{ loadError || 'This link is missing its order number.' }}</p>
        </template>

        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/dashboard"
            class="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-black text-primary-on kinetic-gradient hover:shadow-glow-emerald"
          >
            Go to Dashboard <LucideArrowRight class="h-4 w-4" />
          </NuxtLink>
          <NuxtLink
            :to="state === 'closed' || state === 'error' || state === 'missing' ? '/deposit' : '/transactions'"
            class="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 font-bold text-text-main hover:bg-white/5"
          >
            {{ state === 'closed' || state === 'error' || state === 'missing' ? 'Try again' : 'View transactions' }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
