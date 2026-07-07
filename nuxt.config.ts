// https://nuxt.com/docs/api/configuration/nuxt-config
const isProd = process.env.NODE_ENV === 'production'

const apiOrigin = process.env.API_BASE || 'https://api.gonkarouter.io'
const siteUrl = process.env.SITE_URL || 'https://gonkarouter.io'
const siteName = 'GonkaRouter'
const siteDescription =
  'GonkaRouter — One API for all AI models on the Gonka Network. OpenAI/Anthropic compatible, $0.0004 per 1M tokens, with a one-time $20 free credit for new users.'
const ogImage = `${siteUrl}/og-cover.png`
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || ''

// CSP allows the API origin for fetch/XHR and Google Fonts for typography.
// 'unsafe-inline' is required for Nuxt SSR hydration scripts/styles.
// accounts.google.com → Google Identity Services (Sign in with Google).
// challenges.cloudflare.com → Cloudflare Turnstile human verification.
// Both load a script and render an iframe, so they need script-src + frame-src.
// youtube.com / youtu.be / player.bilibili.com → blog post embedded players,
// authored via the admin "嵌入" toolbar button. frame-src only — these hosts
// do not run any of our scripts, just render their own iframe content.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://accounts.google.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "frame-src https://accounts.google.com https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com https://youtube.com https://player.bilibili.com",
  `connect-src 'self' ${apiOrigin} https://accounts.google.com https://challenges.cloudflare.com${isProd ? '' : ' ws: wss:'}`
].join('; ')

const securityHeaders: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': contentSecurityPolicy
}

if (isProd) {
  securityHeaders['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
}

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  devtools: { enabled: !isProd },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  nitro: {
    routeRules: {
      '/**': { headers: securityHeaders }
    }
  },
  css: ['~/assets/css/tokens.css'],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },
  app: {
    head: {
      title: `${siteName} - AI Model Router on the Gonka Network`,
      titleTemplate: `%s | ${siteName}`,
      htmlAttrs: { lang: 'en' },
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          // Weights are pruned to those actually used in markup (audited via
          // font-* utility usage): Inter 300/400/500/700, Plus Jakarta 700/800,
          // JetBrains Mono 400/500. Dropping unused weights (e.g. Inter 600)
          // shrinks the render-blocking font CSS and the downloaded font files.
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap'
        }
      ],
      meta: [
        { name: 'theme-color', content: '#0e0e0e' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover'
        },
        { name: 'description', content: siteDescription },
        { name: 'robots', content: 'index,follow,max-image-preview:large' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:title', content: siteName },
        { property: 'og:description', content: siteDescription },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:alt', content: siteName },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: siteName },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: ogImage },
        ...(googleSiteVerification
          ? [{ name: 'google-site-verification', content: googleSiteVerification }]
          : [])
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'https://api.gonkarouter.io',
      siteUrl,
      // Google Sign-In client ID (public) and Cloudflare Turnstile site key
      // (public). Empty by default → the corresponding UI degrades gracefully
      // (Google button hidden, Turnstile skipped) so dev works without them.
      // Override at runtime via NUXT_PUBLIC_GOOGLE_CLIENT_ID / NUXT_PUBLIC_TURNSTILE_SITE_KEY.
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || ''
    }
  },
  devServer: {
    port: 3001
  },
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        clientPort: 3001
      }
    }
  }
})
