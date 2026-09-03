// One-shot campaign promo for an offline event (see components/promo/EventPromoModal.vue).
//
// Three rules drive visibility, and all of them live here so the component only
// renders:
//   1. Show at most once per browser — dismissing writes a permanent marker.
//   2. Never show once the event is over; the campaign retires itself without a
//      deploy, so a forgotten modal can't advertise a past date.
//   3. Never show during SSR — the marker only exists client-side, so rendering
//      it on the server would flash the modal at users who already dismissed it.
//
// The storage key carries the campaign id: a future event gets a new id and is
// therefore shown again to everyone, without having to clear the old key.

export const EVENT_PROMO_CAMPAIGN = 'ai-builders-day-2026-09-21'

const STORAGE_KEY = `gr_promo_dismissed:${EVENT_PROMO_CAMPAIGN}`

// Event ends 2026-09-21 17:00 China Standard Time (UTC+8).
const EVENT_END_MS = Date.parse('2026-09-21T17:00:00+08:00')
const EVENT_START_MS = Date.parse('2026-09-21T13:30:00+08:00')

const MS_PER_DAY = 24 * 60 * 60 * 1000

export const useEventPromo = () => {
  const hasExpired = (): boolean => Date.now() > EVENT_END_MS

  const isDismissed = (): boolean => {
    if (typeof window === 'undefined') return true
    try {
      return window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      // Private mode / storage disabled: treat as dismissed rather than
      // re-prompting on every page view with no way to make it stop.
      return true
    }
  }

  const dismiss = (): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Best-effort — the in-memory flag still hides it for this session.
    }
  }

  // Eligible = client-side, event still upcoming, and never dismissed before.
  const isEligible = (): boolean =>
    typeof window !== 'undefined' && !hasExpired() && !isDismissed()

  // Whole days remaining, floored, for the countdown pill. 0 on the event day.
  const daysUntil = (): number =>
    Math.max(0, Math.ceil((EVENT_START_MS - Date.now()) / MS_PER_DAY))

  return { isEligible, isDismissed, dismiss, hasExpired, daysUntil }
}
