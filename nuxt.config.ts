// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: ''
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://36.189.234.197:18013'
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