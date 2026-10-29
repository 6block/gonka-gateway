<script setup lang="ts">
import { ref, computed } from 'vue'
import { LucideLock, LucideLoader2, LucideShieldCheck, LucideGift } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'
import { bonusPreview, formatUsd, parseUsdCents, useTopup, type TopupConfig } from '~/composables/useTopup'

interface Props {
  config: TopupConfig
  account: string
}
const props = defineProps<Props>()

const toast = useToast()
const { startCheckout } = useTopup()

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

async function pay() {
  if (amountError.value || submitting.value) return
  submitting.value = true
  const err = await startCheckout(amount.value.trim())
  if (err) {
    toast.error(err)
    submitting.value = false
  }
  // On success the browser is navigating to Stripe; keep the button busy.
}
</script>

<template>
  <div class="space-y-4">
    <!-- Amount -->
    <section class="rounded-3xl border border-white/5 bg-surface-container-low p-6 sm:p-8">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 class="font-headline text-lg font-black text-text-main">Choose an amount</h2>
        <span
          v-if="bonusPct > 0"
          class="inline-flex items-center gap-1.5 rounded-full border border-primary-container/30 bg-primary-container/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-container"
        >
          <LucideGift class="h-3 w-3" /> +{{ bonusPct }}% bonus
        </span>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          v-for="usd in presets"
          :key="usd"
          type="button"
          class="rounded-2xl border px-3 py-4 text-center transition-all"
          :class="
            cents === usd * 100
              ? 'border-primary-container bg-primary-container/10 shadow-glow-emerald'
              : 'border-white/5 bg-surface-container-high hover:border-white/15'
          "
          :aria-pressed="cents === usd * 100"
          @click="amount = String(usd)"
        >
          <span
            class="block font-headline text-2xl font-black"
            :class="cents === usd * 100 ? 'text-primary-container' : 'text-text-main'"
          >
            ${{ usd }}
          </span>
          <span v-if="presetBonus(usd) > 0" class="mt-1 block text-[11px] font-bold text-primary-container">
            +{{ formatUsd(presetBonus(usd)) }} bonus
          </span>
        </button>
      </div>

      <label for="topup-amount" class="mt-5 block px-1 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">
        Custom amount
      </label>
      <div
        class="mt-2 flex items-center rounded-xl border bg-surface-container-high px-4 transition-colors focus-within:border-primary-container/60"
        :class="amountError ? 'border-red-500/40' : 'border-white/5'"
      >
        <span class="font-headline font-black text-text-muted">$</span>
        <input
          id="topup-amount"
          v-model="amount"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          class="w-full bg-transparent px-2 py-3 font-headline text-lg font-black text-text-main outline-none"
          :aria-invalid="!!amountError"
          aria-describedby="topup-amount-hint"
          @keydown.enter="pay()"
        />
        <span class="text-xs font-bold text-text-muted">USD</span>
      </div>
      <p id="topup-amount-hint" class="mt-2 px-1 text-xs" :class="amountError ? 'text-red-400' : 'text-text-muted'">
        {{ amountError || `${formatUsd(config.min_amount)}–${formatUsd(config.max_amount)} per payment, up to two decimals.` }}
      </p>
    </section>

    <!-- Summary + pay -->
    <section class="rounded-3xl border border-white/5 bg-surface-container-low p-6 sm:p-8">
      <h2 class="mb-4 font-headline text-lg font-black text-text-main">Confirm payment</h2>

      <dl class="divide-y divide-white/5 text-sm">
        <div class="flex items-center justify-between gap-4 pb-3">
          <dt class="text-text-muted">Account</dt>
          <dd class="truncate font-bold text-text-main">{{ account }}</dd>
        </div>
        <div class="flex items-center justify-between py-3">
          <dt class="text-text-muted">You pay</dt>
          <dd class="font-headline text-xl font-black text-text-main">{{ cents === null ? '-' : formatUsd(cents / 100) }}</dd>
        </div>
        <div v-if="bonusPct > 0" class="flex items-center justify-between py-3">
          <dt class="text-text-muted">
            Bonus <span class="text-[11px]">({{ bonusPct }}%, from {{ formatUsd(config.bonus_min_amount) }})</span>
          </dt>
          <dd class="font-bold text-primary-container">+{{ formatUsd(bonus) }}</dd>
        </div>
        <div class="flex items-center justify-between pt-3">
          <dt class="font-bold text-text-main">Credited to balance</dt>
          <dd class="font-headline text-xl font-black text-primary-container">{{ cents === null ? '-' : formatUsd(total) }}</dd>
        </div>
      </dl>

      <button
        type="button"
        :disabled="!!amountError || submitting"
        class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-black text-primary-on kinetic-gradient transition-shadow hover:shadow-glow-emerald disabled:cursor-not-allowed disabled:opacity-60"
        @click="pay()"
      >
        <LucideLoader2 v-if="submitting" class="h-5 w-5 animate-spin" />
        <LucideLock v-else class="h-4 w-4" />
        {{ submitting ? 'Opening secure checkout…' : 'Pay securely with Stripe' }}
      </button>

      <p class="mt-4 flex items-start justify-center gap-1.5 text-center text-[11px] leading-relaxed text-text-muted">
        <LucideShieldCheck class="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Card, Alipay and wallet options depend on your region. Payment details are handled by Stripe;
          GonkaRouter never sees your card.
        </span>
      </p>
    </section>
  </div>
</template>
