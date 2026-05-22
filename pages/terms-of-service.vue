<template>
  <div class="bg-surface text-text-main pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8">
    <div class="max-w-4xl mx-auto space-y-10 sm:space-y-16">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-3 text-primary-container hover:text-primary-dim transition-all font-black font-headline uppercase tracking-widest text-[10px] group"
      >
        <LucideArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </NuxtLink>

      <div class="space-y-12">
        <header class="space-y-3 sm:space-y-4 border-b border-white/5 pb-6 sm:pb-10">
          <h1 class="text-3xl sm:text-4xl md:text-6xl font-black font-headline tracking-tighter">
            Terms of Service
          </h1>
          <p class="text-text-muted font-bold tracking-tight">
            Last Updated: April 20, 2026
          </p>
        </header>

        <article class="space-y-8 sm:space-y-12 text-text-muted leading-relaxed font-medium">
          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              1. Acceptance of Terms
            </h2>
            <div class="space-y-4 text-sm md:text-base">
              <p>Welcome to GonkaRouter ("Service", "we", "us", or "our").</p>
              <p>
                By accessing or using our Service, you agree to be bound by these
                Terms of Service ("Terms").
              </p>
              <p>If you do not agree to these Terms, you may not use the Service.</p>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              2. Description of Service
            </h2>
            <p class="text-sm md:text-base">
              GonkaRouter provides an API and related services that enable users to
              access and interact with artificial intelligence models and related
              infrastructure.
            </p>
            <p class="text-sm md:text-base">
              We reserve the right to modify, suspend, or discontinue any part of the
              Service at any time without prior notice.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              3. Eligibility
            </h2>
            <p class="text-sm md:text-base">
              You must be at least 18 years old (or the age of majority in your
              jurisdiction) to use the Service. By using the Service, you represent
              and warrant that you meet these requirements.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              4. User Responsibilities
            </h2>
            <div class="bg-surface-container-high p-8 rounded-3xl border border-white/5 space-y-6">
              <div class="space-y-3">
                <p
                  class="text-[10px] font-black uppercase tracking-widest text-primary-container"
                >
                  You agree to:
                </p>
                <ul class="list-disc pl-5 space-y-1 text-sm md:text-base">
                  <li>Use the Service only for lawful purposes</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>
                    Ensure that your use of the Service does not violate any
                    third-party rights
                  </li>
                </ul>
              </div>
              <div class="space-y-3">
                <p
                  class="text-[10px] font-black uppercase tracking-widest text-red-400"
                >
                  You agree not to:
                </p>
                <ul class="list-disc pl-5 space-y-1 text-sm md:text-base">
                  <li>Use the Service for illegal, harmful, or abusive activities</li>
                  <li>Attempt to reverse engineer, disrupt, or overload the Service</li>
                  <li>Bypass rate limits or security mechanisms</li>
                  <li>Use the Service to generate content that is unlawful or infringes rights</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              5. API Usage
            </h2>
            <div class="space-y-4 text-sm md:text-base">
              <p>
                You are responsible for securing your API keys and credentials. All
                activity under your API key is your responsibility.
              </p>
              <p>
                We may impose rate limits, usage limits, or access restrictions. We
                reserve the right to suspend or terminate access for abuse or misuse.
              </p>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              6. Fees and Billing
            </h2>
            <p class="text-sm md:text-base">
              Certain features may require payment. Fees are non-refundable unless
              otherwise stated. We may change pricing with reasonable notice.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              7. Intellectual Property
            </h2>
            <p class="text-sm md:text-base">
              We retain all rights, title, and interest in and to the Service. You
              retain ownership of your input data. You are responsible for ensuring
              you have rights to any content you submit.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              8. AI-Generated Content
            </h2>
            <p class="text-sm md:text-base">
              Outputs generated by the Service may be inaccurate or incomplete. You
              are solely responsible for evaluating and using the outputs. We do not
              guarantee the accuracy, reliability, or suitability of generated
              content.
            </p>
          </section>

          <section
            class="space-y-4 bg-primary-container/5 border border-primary-container/10 p-8 rounded-3xl"
          >
            <h2
              class="text-xl sm:text-2xl font-black font-headline tracking-tight text-primary-container"
            >
              9. Security &amp; Web3 Disclaimer
            </h2>
            <ul class="space-y-2 list-disc pl-5 text-sm md:text-base font-bold text-primary-dim">
              <li>
                GonkaRouter does not access or store users' private keys, wallet
                credentials, or blockchain assets
              </li>
              <li>
                You are solely responsible for the security of your wallets,
                credentials, and assets
              </li>
              <li>We are not responsible for any loss of funds, tokens, or digital assets</li>
            </ul>
          </section>

          <section class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <h2
                  class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main"
                >
                  10. Disclaimer of Warranties
                </h2>
                <p class="text-sm opacity-80">
                  The Service is provided on an "as is" basis. We disclaim all
                  warranties including merchantability and fitness for a particular
                  purpose.
                </p>
              </div>
              <div class="space-y-3">
                <h2
                  class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main"
                >
                  11. Limitation of Liability
                </h2>
                <p class="text-sm opacity-80">
                  We shall not be liable for any indirect, incidental, or
                  consequential damages. Our total liability shall not exceed the
                  amount paid by you.
                </p>
              </div>
            </div>
          </section>

          <section class="space-y-4 opacity-80 text-sm border-t border-white/5 pt-12">
            <h2 class="text-xl font-black font-headline tracking-tight text-text-main">
              12. Contact
            </h2>
            <p>
              Email:
              <a
                href="mailto:contact@gonka-router.com"
                class="text-primary-container hover:underline font-bold"
                >contact@gonka-router.com</a
              >
            </p>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideArrowLeft } from 'lucide-vue-next'

definePageMeta({ layout: 'landing' })

const tosConfig = useRuntimeConfig()
const tosSiteUrl = tosConfig.public.siteUrl || 'https://router.gonkascan.com'
useSeoMeta({
  title: 'Terms of Service',
  description:
    'GonkaRouter Terms of Service governing your use of the AI Model Router on the Gonka Network.',
  ogTitle: 'Terms of Service | GonkaRouter',
  ogDescription: 'GonkaRouter Terms of Service.',
  ogUrl: `${tosSiteUrl}/terms-of-service`
})
useHead({ link: [{ rel: 'canonical', href: `${tosSiteUrl}/terms-of-service` }] })
</script>
