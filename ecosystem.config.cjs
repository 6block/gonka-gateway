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
        NUXT_PUBLIC_GA_MEASUREMENT_ID: 'G-5YBJ3DPKE0',
        // Cloudflare Turnstile site key (public — rendered into the page). Same
        // production-only reasoning as GA above: in dev the key would reject
        // localhost, so dev keeps running without the challenge.
        //
        // The matching secret lives only in model-gateway's .env as
        // TURNSTILE_SECRET. Enable it there *after* this key is live: with the
        // secret set and no token coming from the page, every email login 403s.
        NUXT_PUBLIC_TURNSTILE_SITE_KEY: '0x4AAAAAAFcbQ4RGI69Sc6pz'
      }
    }
  ]
}
