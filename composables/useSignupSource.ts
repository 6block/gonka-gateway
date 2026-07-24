// Tracks where a sign-up originated (campaign attribution), e.g. the FFF
// founders page. The marker is written when the user starts registration from a
// campaign entry point, survives the navigation to the home page + the login
// modal flow, and is read once by the auth store when a new account is created.
//
// Persisted in localStorage (not a cookie) because it's purely client-side
// attribution. A timestamp bounds it so an abandoned click can't silently tag a
// much-later, unrelated sign-up.
const STORAGE_KEY = 'gr_signup_source'
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24h

interface StoredSource {
  source: string
  ts: number
}

export const useSignupSource = () => {
  const set = (source: string): void => {
    if (typeof window === 'undefined' || !source) return
    try {
      const payload: StoredSource = { source, ts: Date.now() }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Ignore storage failures (private mode, quota) — attribution is best-effort.
    }
  }

  // Returns the active source tag, or '' if none/expired.
  const get = (): string => {
    if (typeof window === 'undefined') return ''
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return ''
      const parsed = JSON.parse(raw) as Partial<StoredSource>
      if (!parsed?.source || typeof parsed.ts !== 'number') return ''
      if (Date.now() - parsed.ts > MAX_AGE_MS) {
        clear()
        return ''
      }
      return parsed.source
    } catch {
      return ''
    }
  }

  const clear = (): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore.
    }
  }

  return { set, get, clear }
}
