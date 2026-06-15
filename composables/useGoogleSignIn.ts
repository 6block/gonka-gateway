// Loads the Google Identity Services (GSI) script on demand and de-duplicates
// concurrent/repeat calls. Loaded lazily (only when the login modal mounts) so
// it never weighs down the landing page.
let gsiPromise: Promise<void> | null = null

export function loadGoogleScript(): Promise<void> {
  if (!import.meta.client) return Promise.reject(new Error('GSI is client-only'))
  if ((window as any).google?.accounts?.id) return Promise.resolve()
  if (gsiPromise) return gsiPromise

  gsiPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      gsiPromise = null
      reject(new Error('Failed to load Google Identity Services'))
    }
    document.head.appendChild(script)
  })
  return gsiPromise
}
