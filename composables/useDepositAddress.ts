// useDepositAddress.ts — per-chain deposit address fetching composable.
//
// Accepts a MaybeRef<DepositChain> so the caller can pass a computed ref
// and the composable stays reactive when the selected chain changes.

import { ref, toValue, type MaybeRef } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

// ── Chain metadata ────────────────────────────────────────────────────────────

export type ChainId = 'bsc' | 'ton'

export interface DepositChain {
  id: ChainId
  /** Human-readable network label shown in the UI */
  label: string
  /** Regex that validates the raw address string returned by the backend */
  addressPattern: RegExp
  /** Optional normalisation step (e.g. EVM checksum). May be async. */
  normalise?: (raw: string) => Promise<string> | string
  /** Displayed estimated arrival time */
  arrival: string
  /** Whether this chain requires a connected EVM wallet before showing address */
  requiresWallet: boolean
}

/** All supported deposit chains. Add new entries here to extend. */
export const DEPOSIT_CHAINS: Record<ChainId, DepositChain> = {
  bsc: {
    id: 'bsc',
    label: 'BEP-20 (BSC)',
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
    normalise: async (raw) => {
      try {
        const { getAddress } = await import('ethers')
        return getAddress(raw)
      } catch {
        return raw
      }
    },
    arrival: '1-5 mins',
    requiresWallet: true,
  },
  ton: {
    id: 'ton',
    label: 'TON',
    // TON addresses: bounceable EQ... or non-bounceable UQ... base64url, ~48 chars
    addressPattern: /^[EUe][Qq][A-Za-z0-9_-]{46}$/,
    normalise: (raw) => raw, // no JS-side checksum needed; backend returns canonical form
    arrival: '~10 secs',
    requiresWallet: false,
  },
}

// ── Composable ────────────────────────────────────────────────────────────────

/**
 * Provides deposit-address fetch state for a given chain.
 * Accepts a MaybeRef so a computed ref can be passed directly.
 */
export function useDepositAddress(chainRef: MaybeRef<DepositChain>) {
  const auth = useAuthStore()
  const toast = useToast()
  const apiBase = useRuntimeConfig().public.apiBase as string

  const depositAddress = ref('')
  const loadingAddress = ref(false)

  async function fetchDepositAddress(): Promise<void> {
    const chain = toValue(chainRef)
    if (!auth.token) return
    loadingAddress.value = true
    depositAddress.value = ''
    try {
      const res = await $fetch<{ address?: string }>(
        `${apiBase}/api/billing/deposit-address`,
        {
          query: { chain: chain.id },
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      )
      const raw = res?.address
      if (typeof raw !== 'string' || !chain.addressPattern.test(raw)) {
        toast.error('Received an invalid deposit address. Contact support before sending funds.')
        return
      }
      depositAddress.value = chain.normalise ? await chain.normalise(raw) : raw
    } catch (e: unknown) {
      if ((e as any)?.response?.status === 401) {
        auth.logout()
        toast.error('Session expired. Please sign in again.')
      } else {
        toast.error('Failed to load deposit address. Please try again.')
      }
    } finally {
      loadingAddress.value = false
    }
  }

  return { depositAddress, loadingAddress, fetchDepositAddress }
}
