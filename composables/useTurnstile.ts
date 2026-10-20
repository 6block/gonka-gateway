// Loads the Cloudflare Turnstile script on demand and de-duplicates
// concurrent/repeat calls. Loaded lazily (only when the login modal mounts) so
// it never weighs down the landing page. Mirrors loadGoogleScript().
let turnstilePromise: Promise<void> | null = null

export function loadTurnstileScript(): Promise<void> {
  if (!import.meta.client) return Promise.reject(new Error('Turnstile is client-only'))
  if ((window as any).turnstile) return Promise.resolve()
  if (turnstilePromise) return turnstilePromise

  turnstilePromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    // render=explicit: we call turnstile.render() ourselves once the modal's
    // container exists, instead of the script scanning the DOM on load.
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      turnstilePromise = null
      reject(new Error('Failed to load Cloudflare Turnstile'))
    }
    document.head.appendChild(script)
  })
  return turnstilePromise
}
