// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    newApiToken: process.env.NEW_API_TOKEN || 'sk-OnkUYV0JCHqlveAlkTs88qm3ur0WoXExylBAHJu13cacjwlJ',
    newApiUrl: process.env.NEW_API_URL || 'http://36.189.234.197:18011/v1' // Update this to the actual base URL
  },
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        clientPort: 3000
      }
    }
  }
})