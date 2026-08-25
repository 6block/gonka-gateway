// Google Analytics 4 (gtag.js).
//
// Hand-rolled rather than pulled in as a module: the requirement is page views
// plus a couple of conversion events, and controlling the loader ourselves
// keeps the script origin explicit alongside the CSP entry in nuxt.config.ts
// that allows it.
//
// Client-only (.client.ts) — gtag touches window/document and must never run
// during SSR.
//
// No measurement ID configured → this plugin does nothing at all: no script
// tag, no network request. That mirrors how googleClientId / turnstileSiteKey
// degrade, so local dev and preview builds stay analytics-free by default.

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin(() => {
  const measurementId = useRuntimeConfig().public.gaMeasurementId

  if (!measurementId) return

  window.dataLayer = window.dataLayer || []
  // Must forward `arguments` verbatim: gtag.js reads the raw arguments object
  // off dataLayer, so a rest-parameter array would not be interpreted the same.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  // send_page_view is disabled because this is a SPA: gtag.js would only ever
  // report the first load, leaving every client-side navigation uncounted. The
  // router hook below sends them instead.
  window.gtag('config', measurementId, { send_page_view: false })

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
        async: true
      }
    ]
  })

  const router = useRouter()

  // Hydration replays the current route through afterEach, so the entry page
  // would be reported twice — confirmed in the browser: two identical
  // page_view entries sat in dataLayer for a single load, which would have
  // inflated every session's landing page by 2x.
  //
  // Both trigger paths are kept (the explicit first send, and afterEach) so a
  // missed hook cannot lose the entry view; this guard removes the overlap
  // instead. The window is deliberately short: a genuine revisit of the same
  // path seconds later is real traffic and must still count.
  const dedupeWindowMs = 1000
  // Bounds for waiting on the <title> to catch up (see sendPageViewOnTitle).
  const titlePollMs = 20
  const titleWaitMaxMs = 400
  let lastPath = ''
  let lastSentAt = 0

  const sendPageView = (path: string): void => {
    const now = Date.now()
    if (path === lastPath && now - lastSentAt < dedupeWindowMs) return
    lastPath = path
    lastSentAt = now

    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.origin + path,
      page_title: document.title
    })
  }

  // Sends once the document title reflects the page being navigated to.
  //
  // unhead flushes <title> asynchronously with no public "done" hook, and it
  // is later than both nextTick and a 50ms timer — both were tried, and both
  // reported the *previous* page's title, which would file every SPA page view
  // under the wrong name in GA. Polling for the actual change is timing
  // -independent; the cap covers navigations between pages that legitimately
  // share a title, where no change will ever come.
  const sendPageViewOnTitle = (path: string): void => {
    const titleBefore = document.title
    let waited = 0

    const step = (): void => {
      if (document.title !== titleBefore || waited >= titleWaitMaxMs) {
        sendPageView(path)
        return
      }
      waited += titlePollMs
      setTimeout(step, titlePollMs)
    }

    setTimeout(step, titlePollMs)
  }

  // afterEach is registered only after the router settles, and the first view
  // is sent explicitly here.
  //
  // Registering it earlier double-counts the landing page: on hydration the
  // initial navigation still runs through afterEach, so the same page_view is
  // reported twice — verified in the browser before this was reordered. Every
  // session would have inflated its entry page by 2x.
  router.isReady().then(() => {
    sendPageView(router.currentRoute.value.fullPath)

    router.afterEach((to) => sendPageViewOnTitle(to.fullPath))
  })
})
