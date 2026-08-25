module.exports = {
  apps: [
    {
      name: 'gonkarouter',
      port: '3001',
      script: './.output/server/index.mjs',
      max_memory_restart: '300M',
      env: {
        // GA4 measurement ID (public — it ships in the page source regardless).
        //
        // Injected here rather than in .env on purpose: .env is read by
        // `npm run dev` too, so putting a live ID there would file local
        // development browsing into the production property. pm2 only runs the
        // built server, so this stays production-only.
        //
        // The NUXT_PUBLIC_ prefix is Nuxt's runtime override for
        // runtimeConfig.public.gaMeasurementId, so it applies to an existing
        // build without rebuilding — a rebuild is only needed for code changes.
        NUXT_PUBLIC_GA_MEASUREMENT_ID: 'G-5YBJ3DPKE0'
      }
    }
  ]
}
