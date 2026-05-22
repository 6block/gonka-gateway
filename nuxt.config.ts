// https://nuxt.com/docs/api/configuration/nuxt-config
const isProd = process.env.NODE_ENV === 'production'

const apiOrigin = process.env.API_BASE || 'https://api.gonkascan.com'
const siteUrl = process.env.SITE_URL || 'https://router.gonkascan.com'
const siteName = 'GonkaRouter'
const siteDescription =
  'GonkaRouter — One API for all AI models on the Gonka Network. OpenAI/Anthropic compatible, $0.001 per 1M tokens, with $20 daily credits for 7 days for new users.'
const ogImage = `${siteUrl}/og-cover.png`
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || ''

// CSP allows the API origin for fetch/XHR and Google Fonts for typography.
// 'unsafe-inline' is required for Nuxt SSR hydration scripts/styles.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${apiOrigin}${isProd ? '' : ' ws: wss:'}`
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
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap'
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
      apiBase: process.env.API_BASE || 'https://api.gonkascan.com',
      siteUrl
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
