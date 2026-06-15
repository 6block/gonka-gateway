<script setup>
const appConfig = useRuntimeConfig()
const appSiteUrl = appConfig.public.siteUrl || 'https://gonkarouter.io'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${appSiteUrl}/#organization`,
      name: 'GonkaRouter',
      url: appSiteUrl,
      logo: `${appSiteUrl}/gonkaIcon.png`
    },
    {
      '@type': 'WebSite',
      '@id': `${appSiteUrl}/#website`,
      url: appSiteUrl,
      name: 'GonkaRouter',
      description:
        'GonkaRouter — One API for all AI models on the Gonka Network. OpenAI/Anthropic compatible, $0.0004 per 1M tokens.',
      publisher: { '@id': `${appSiteUrl}/#organization` },
      inLanguage: 'en'
    },
    {
      '@type': 'SoftwareApplication',
      name: 'GonkaRouter',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0.0004', priceCurrency: 'USD' },
      url: appSiteUrl
    }
  ]
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd)
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-surface text-text-main antialiased font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Global login modal (Google + email OTP), shared by every layout -->
    <AuthLoginModal />
    <!-- Forced account upgrade for legacy wallet users (bind an email) -->
    <AuthUpgradeModal />
    <!-- Global toasts so notifications surface on landing pages too -->
    <Toast />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Global scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
html.light ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 163, 0.35);
}
</style>
