// Live Gonka chat price. The gonka channel's rate tracks the Gonka network
// (governance list price × devshard multiplier × GNK/USD), so the marketing
// site reads it from the backend instead of hardcoding a figure. Fetched with
// useAsyncData so the value is present during SSR — the SEO meta and JSON-LD
// need the real number, not a client-side hydration.

export interface GonkaPricingModel {
  model_id: string
  usd_per_1k: string
  usd_per_million: string
}

export interface GonkaPricing {
  currency: string
  source: string
  models: GonkaPricingModel[]
  gnk_usd?: string
  updated_at?: string
  from_usd_per_million?: string
}

// Fallback shown only if the API is unreachable during SSR. Kept close to the
// real current rate so the page never renders a wildly wrong or empty price.
const STATIC_FROM_PER_1M = '0.0013'

function formatUsdPerM(raw: string): string {
  const n = Number(raw)
  if (!isFinite(n) || n <= 0) return '$0.0013'
  // 4 decimals is enough across the sane $0.0002–$0.02 band
  return '$' + n.toFixed(4)
}

export function useGonkaPricing() {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string | undefined)?.replace(/\/$/, '') ?? ''

  const { data } = useAsyncData<GonkaPricing | null>('gonka-pricing', async () => {
    if (!apiBase) return null
    try {
      return await $fetch<GonkaPricing>(`${apiBase}/api/pricing`, { timeout: 5000 })
    } catch {
      return null
    }
  })

  // Raw "from" price per 1M tokens (string), and a formatted "$0.0013" display.
  const fromPer1MRaw = computed(() => data.value?.from_usd_per_million ?? STATIC_FROM_PER_1M)
  const fromPer1M = computed(() => formatUsdPerM(fromPer1MRaw.value))

  return { pricing: data, fromPer1M, fromPer1MRaw }
}
