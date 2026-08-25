// Thin wrapper over gtag so feature code can report events without caring
// whether analytics is configured, or whether it is running on the server.
//
// Every guard here matters in this app: the plugin is client-only and skipped
// entirely when no measurement ID is set, so `window.gtag` is undefined in dev,
// in preview builds, and during SSR. Call sites should not have to repeat that
// check — an analytics call must never be able to break a signup.

interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined
}

export const useAnalytics = () => {
  const track = (event: string, params: AnalyticsEventParams = {}): void => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
    try {
      // Undefined values are dropped rather than sent as "undefined" strings,
      // which would pollute the GA4 reports with a junk dimension value.
      const clean = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
      )
      window.gtag('event', event, clean)
    } catch {
      // Analytics is best-effort and must never surface to the user.
    }
  }

  // GA4 recognises `sign_up` as a standard event, so it shows up in the
  // conversion reports without extra configuration. `method` distinguishes the
  // auth paths; `signup_source` carries our own campaign tag (see
  // useSignupSource) so a campaign landing page can be tied to the conversion
  // it produced — which plain page-view data cannot tell you.
  const trackSignUp = (method: string, signupSource?: string): void => {
    track('sign_up', { method, signup_source: signupSource })
  }

  const trackLogin = (method: string): void => {
    track('login', { method })
  }

  return { track, trackSignUp, trackLogin }
}
