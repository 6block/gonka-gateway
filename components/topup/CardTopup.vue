<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { LucideLock, LucideLoader2, LucideShieldCheck } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'
import { bonusPreview, formatUsd, parseUsdCents, useTopup, type TopupConfig } from '~/composables/useTopup'

interface Props {
  config: TopupConfig
  account: string
}
const props = defineProps<Props>()

const toast = useToast()
const { createCheckout } = useTopup()

const PRESETS = [10, 20, 50, 100]

const minCents = computed(() => parseUsdCents(props.config.min_amount) ?? 500)
const maxCents = computed(() => parseUsdCents(props.config.max_amount) ?? 1_000_000)
const presets = computed(() =>
  PRESETS.filter((usd) => usd * 100 >= minCents.value && usd * 100 <= maxCents.value)
)

const amount = ref(String(presets.value[1] ?? presets.value[0] ?? props.config.min_amount))
const submitting = ref(false)

const cents = computed(() => parseUsdCents(amount.value))
const amountError = computed(() => {
  if (amount.value.trim() === '') return 'Enter an amount'
  if (cents.value === null) return 'Use a plain amount with at most two decimals'
  if (cents.value < minCents.value || cents.value > maxCents.value) {
    return `Amount must be between ${formatUsd(props.config.min_amount)} and ${formatUsd(props.config.max_amount)}`
  }
  return ''
})

const bonusPct = computed(() => Number(props.config.bonus_percent) || 0)
const bonus = computed(() => (cents.value === null ? 0 : bonusPreview(cents.value, props.config)))
const total = computed(() => (cents.value === null ? 0 : cents.value / 100 + bonus.value))

function presetBonus(usd: number): number {
  return bonusPreview(usd * 100, props.config)
}

// If the browser has not left for Stripe after this long (slow link to
// checkout.stripe.com), offer the link instead of an endless spinner.
const NAVIGATION_FALLBACK_MS = 8000

const pendingUrl = ref('')
let fallbackTimer: ReturnType<typeof setTimeout> | undefined

function resetCheckout() {
  clearTimeout(fallbackTimer)
  submitting.value = false
  pendingUrl.value = ''
}

async function pay() {
  if (amountError.value || submitting.value) return
  submitting.value = true
  const res = await createCheckout(amount.value.trim())
  if ('error' in res) {
    toast.error(res.error)
    resetCheckout()
    return
  }
  // A top-level navigation: CSP form-action would block a form POST redirect.
  window.location.assign(res.url)
  fallbackTimer = setTimeout(() => {
    submitting.value = false
    pendingUrl.value = res.url
  }, NAVIGATION_FALLBACK_MS)
}

// Going Back from Stripe can restore this page from the browser's cache with
// the button still busy; start fresh instead. Unpaid checkouts just expire.
function onPageShow(e: PageTransitionEvent) {
  if (e.persisted) resetCheckout()
}
onMounted(() => window.addEventListener('pageshow', onPageShow))
onBeforeUnmount(() => {
  window.removeEventListener('pageshow', onPageShow)
  clearTimeout(fallbackTimer)
})
</script>

<template>
  <div class="card-topup">
    <!-- Amount -->
    <section class="pay-block" aria-labelledby="amount-title">
      <div class="pay-block__head">
        <h2 id="amount-title" class="pay-tag">[amount]</h2>
        <span v-if="bonusPct > 0" class="pay-label pay-green">+{{ bonusPct }}% bonus from {{ formatUsd(config.bonus_min_amount) }}</span>
      </div>

      <div class="pay-presets">
        <button
          v-for="usd in presets"
          :key="usd"
          type="button"
          class="pay-preset"
          :aria-pressed="cents === usd * 100"
          @click="amount = String(usd)"
        >
          <span class="pay-preset__usd">${{ usd }}</span>
          <span v-if="presetBonus(usd) > 0" class="pay-preset__bonus">+{{ formatUsd(presetBonus(usd)) }} bonus</span>
        </button>
      </div>

      <label for="topup-amount" class="pay-label card-topup__custom">Custom amount</label>
      <div class="pay-input" :class="{ 'is-invalid': amountError }">
        <span class="pay-input__affix">$</span>
        <input
          id="topup-amount"
          v-model="amount"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          :aria-invalid="!!amountError"
          aria-describedby="topup-amount-hint"
          @keydown.enter="pay()"
        />
        <span class="pay-input__affix">USD</span>
      </div>
      <p id="topup-amount-hint" class="card-topup__hint" :class="amountError ? 'pay-error' : 'pay-fine'">
        {{ amountError || `${formatUsd(config.min_amount)}–${formatUsd(config.max_amount)} per payment, up to two decimals.` }}
      </p>
    </section>

    <!-- Summary + pay -->
    <section class="pay-block" aria-labelledby="confirm-title">
      <div class="pay-block__head">
        <h2 id="confirm-title" class="pay-tag">[confirm]</h2>
      </div>

      <dl class="pay-ledger">
        <div class="pay-ledger__row">
          <dt>Account</dt>
          <dd class="card-topup__account">{{ account }}</dd>
        </div>
        <div class="pay-ledger__row">
          <dt>You pay</dt>
          <dd>{{ cents === null ? '-' : formatUsd(cents / 100) }}</dd>
        </div>
        <div v-if="bonusPct > 0" class="pay-ledger__row">
          <dt>Bonus ({{ bonusPct }}%)</dt>
          <dd class="pay-green">+{{ formatUsd(bonus) }}</dd>
        </div>
        <div class="pay-ledger__row">
          <dt>Concurrency</dt>
          <dd class="pay-green">Higher limit</dd>
        </div>
        <div class="pay-ledger__row pay-ledger__row--total">
          <dt>Credited to balance</dt>
          <dd>{{ cents === null ? '-' : formatUsd(total) }}</dd>
        </div>
      </dl>

      <button
        type="button"
        :disabled="!!amountError || submitting"
        class="pay-btn pay-btn--primary pay-btn--lg pay-btn--block card-topup__pay"
        @click="pay()"
      >
        <LucideLoader2 v-if="submitting" class="h-4 w-4 animate-spin" />
        <LucideLock v-else class="h-4 w-4" />
        {{ submitting ? 'Opening secure checkout…' : 'Pay securely with Stripe' }}
      </button>

      <p v-if="pendingUrl" class="pay-fine card-topup__note" role="status">
        Checkout is taking a while to open.
        <a :href="pendingUrl" class="pay-link">Open Stripe checkout ↗</a>
      </p>

      <p class="pay-fine card-topup__note card-topup__secure">
        <LucideShieldCheck class="h-3.5 w-3.5 shrink-0" />
        <span>
          Card, Alipay and wallet options depend on your region. Payment details are handled by Stripe;
          GonkaRouter never sees your card.
        </span>
      </p>
    </section>
  </div>
</template>

<style scoped>
.card-topup__custom {
  display: block;
  margin-top: 20px;
}
.card-topup__hint {
  margin-top: 8px;
}
.card-topup__account {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: none;
}
.card-topup__pay {
  margin-top: 20px;
}
.card-topup__note {
  margin-top: 12px;
}
.card-topup__secure {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
</style>
