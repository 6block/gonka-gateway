// useTopup.ts — card top-up through Stripe Checkout, plus the deposit bonus
// rule shared with crypto deposits.
//
// The backend is the source of truth for every amount: it validates the
// requested amount, opens the Checkout Session and credits the balance. The
// bonus computed here is only a preview; the checkout response and the order
// status carry the figures that are actually credited.

import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

export interface TopupConfig {
  stripe_enabled: boolean
  /** Percent of each qualifying deposit credited on top, e.g. "20"; "0" = off */
  bonus_percent: string
  /** Minimum deposit (USD) that earns the bonus */
  bonus_min_amount: string
  currency: 'USD'
  min_amount: string
  max_amount: string
}

export type StripeOrderStatus = 'created' | 'credited' | 'expired' | 'failed'

export interface StripeOrder {
  order_no: string
  status: StripeOrderStatus
  amount: string
  currency: 'USD'
  bonus?: string
  total?: string
  checkout_url?: string
  created_at: string
  credited_at?: string
}

interface CheckoutResponse {
  order_no: string
  checkout_url: string
  amount: string
  bonus: string
  total: string
}

/** Plain decimal with at most two places, the only form the backend accepts. */
const AMOUNT_RE = /^\d+(\.\d{1,2})?$/

/** Parses a USD amount to integer cents, or null when it is not a valid amount. */
export function parseUsdCents(raw: string): number | null {
  const s = raw.trim()
  if (!AMOUNT_RE.test(s)) return null
  const [whole, frac = ''] = s.split('.')
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, '0'))
  return Number.isSafeInteger(cents) ? cents : null
}

/** Bonus preview in USD for a deposit of `cents`, mirroring the backend rule. */
export function bonusPreview(cents: number, cfg: Pick<TopupConfig, 'bonus_percent' | 'bonus_min_amount'>): number {
  const pct = Number(cfg.bonus_percent)
  const minCents = parseUsdCents(cfg.bonus_min_amount) ?? 0
  if (!(pct > 0) || cents < minCents) return 0
  return Math.trunc(cents * pct * 100) / 1e6 // micro-dollars, truncated like the backend
}

/** "25" → "$25", "25.5" → "$25.50"; at most two decimals, trailing zeros only when needed. */
export function formatUsd(value: number | string): string {
  const n = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(n)) return '-'
  const fixed = Math.trunc(n * 100) / 100
  return `$${fixed.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(fixed) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

/** Only ever leave the site for Stripe's own hosted checkout. */
function isStripeCheckoutUrl(raw: string): boolean {
  try {
    const u = new URL(raw)
    return u.protocol === 'https:' && u.hostname === 'checkout.stripe.com'
  } catch {
    return false
  }
}

function errorStatus(e: unknown): number | undefined {
  return (e as { response?: { status?: number } })?.response?.status
}

function errorMessage(e: unknown): string | undefined {
  return (e as { data?: { error?: { message?: string } } })?.data?.error?.message
}

export function useTopup() {
  const auth = useAuthStore()
  const apiBase = useRuntimeConfig().public.apiBase as string
  const headers = (): Record<string, string> => ({ Authorization: `Bearer ${auth.token}` })

  const config = ref<TopupConfig | null>(null)
  const configError = ref(false)

  async function loadConfig(): Promise<void> {
    if (!auth.token) return
    configError.value = false
    try {
      config.value = await $fetch<TopupConfig>(`${apiBase}/api/billing/topup/config`, { headers: headers() })
    } catch (e: unknown) {
      if (errorStatus(e) === 401) auth.logout()
      configError.value = true
    }
  }

  /**
   * Opens a Checkout Session and returns its URL, or an error message for the
   * user. Navigating is left to the caller, so it can recover if the browser
   * never leaves (slow network) or brings the page back from its cache.
   */
  async function createCheckout(amount: string): Promise<{ url: string } | { error: string }> {
    try {
      const res = await $fetch<CheckoutResponse>(`${apiBase}/api/billing/stripe/checkout`, {
        method: 'POST',
        headers: headers(),
        body: { amount },
      })
      if (!isStripeCheckoutUrl(res.checkout_url)) return { error: 'Unexpected payment link. Please contact support.' }
      return { url: res.checkout_url }
    } catch (e: unknown) {
      const status = errorStatus(e)
      if (status === 401) {
        auth.logout()
        return { error: 'Session expired. Please sign in again.' }
      }
      if (status === 429) return { error: errorMessage(e) || 'Too many attempts. Please wait a minute and try again.' }
      return { error: errorMessage(e) || 'Could not start the payment. Please try again.' }
    }
  }

  async function fetchOrder(orderNo: string): Promise<StripeOrder> {
    return $fetch<StripeOrder>(`${apiBase}/api/billing/stripe/orders/${encodeURIComponent(orderNo)}`, {
      headers: headers(),
    })
  }

  return { config, configError, loadConfig, createCheckout, fetchOrder, errorStatus }
}
