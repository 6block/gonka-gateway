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
  <div class="pay">
    <div class="pay-page success">
      <!-- Not signed in (e.g. returned in another browser) -->
      <section v-if="!auth.isLoggedIn" class="pay-block">
        <p class="pay-tag">[payment]</p>
        <h1 class="pay-headline success__gap">Sign in to see your payment</h1>
        <p class="pay-lede success__gap">
          Your payment is safe either way: it is credited to the account that started it.
        </p>
        <button class="pay-btn pay-btn--primary pay-btn--lg success__actions" @click="openLogin()">
          <LucideLogIn class="h-4 w-4" /> Sign In
        </button>
      </section>

      <section v-else class="pay-block" aria-live="polite">
        <!-- Credited -->
        <template v-if="state === 'credited' && order">
          <p class="pay-tag success__status"><LucideCheckCircle2 class="h-4 w-4" /> [credited]</p>
          <h1 class="pay-display success__title">Payment received<span>Higher limit unlocked</span></h1>
          <p class="pay-lede success__gap">
            Your balance has been topped up. Your API keys now run with a higher concurrency limit,
            applied automatically within a few minutes.
          </p>

          <dl class="pay-ledger success__ledger">
            <div class="pay-ledger__row">
              <dt>Paid</dt>
              <dd>{{ formatUsd(order.amount) }}</dd>
            </div>
            <div v-if="Number(order.bonus) > 0" class="pay-ledger__row">
              <dt>Bonus</dt>
              <dd class="pay-green">+{{ formatUsd(order.bonus ?? 0) }}</dd>
            </div>
            <div class="pay-ledger__row">
              <dt>Concurrency</dt>
              <dd class="pay-green">Higher limit</dd>
            </div>
            <div class="pay-ledger__row pay-ledger__row--total">
              <dt>Credited</dt>
              <dd>{{ formatUsd(order.total ?? order.amount) }}</dd>
            </div>
          </dl>
        </template>

        <!-- Waiting for confirmation -->
        <template v-else-if="state === 'loading' || (state === 'pending' && !gaveUp)">
          <p class="pay-tag success__status"><LucideLoader2 class="h-4 w-4 animate-spin" /> [confirming]</p>
          <h1 class="pay-headline success__gap">Confirming your payment…</h1>
          <p class="pay-lede success__gap">This usually takes a few seconds. You can keep this page open.</p>
        </template>

        <!-- Still pending after polling -->
        <template v-else-if="state === 'pending' && gaveUp">
          <p class="pay-tag success__status"><LucideClock class="h-4 w-4" /> [pending]</p>
          <h1 class="pay-headline success__gap">Still confirming</h1>
          <p class="pay-lede success__gap">
            Some payment methods take longer to settle. Your balance updates automatically once
            Stripe confirms it; check Transactions in a few minutes.
          </p>
          <p v-if="resumeUrl" class="success__gap">
            <a :href="resumeUrl" class="pay-link">Didn't finish paying? Return to checkout ↗</a>
          </p>
        </template>

        <!-- Expired / failed -->
        <template v-else-if="state === 'closed'">
          <p class="pay-tag success__status success__status--bad"><LucideAlertCircle class="h-4 w-4" /> [not completed]</p>
          <h1 class="pay-headline success__gap">Payment not completed</h1>
          <p class="pay-lede success__gap">
            This checkout {{ order?.status === 'expired' ? 'expired' : 'did not go through' }}. No charge was made.
          </p>
        </template>

        <!-- Missing / unknown order -->
        <template v-else>
          <p class="pay-tag success__status success__status--bad"><LucideAlertCircle class="h-4 w-4" /> [not found]</p>
          <h1 class="pay-headline success__gap">Order not found</h1>
          <p class="pay-lede success__gap">{{ loadError || 'This link is missing its order number.' }}</p>
        </template>

        <div class="success__actions">
          <NuxtLink to="/dashboard" class="pay-btn pay-btn--primary pay-btn--lg">
            Go to Dashboard <LucideArrowRight class="h-4 w-4" />
          </NuxtLink>
          <NuxtLink
            :to="state === 'closed' || state === 'error' || state === 'missing' ? '/deposit' : '/transactions'"
            class="pay-btn pay-btn--ghost pay-btn--lg"
          >
            {{ state === 'closed' || state === 'error' || state === 'missing' ? 'Try again' : 'View transactions' }}
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.success {
  max-width: 720px;
}
.success__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.success__status--bad {
  color: var(--pay-danger);
}
.success__title {
  margin-top: 18px;
}
.success__gap {
  margin-top: 12px;
}
.success__ledger {
  margin-top: 28px;
}
.success__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 32px;
}
</style>
