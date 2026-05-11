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

      <div class="space-y-10 sm:space-y-12">
        <header class="space-y-3 sm:space-y-4 border-b border-white/5 pb-6 sm:pb-10">
          <h1 class="text-3xl sm:text-4xl md:text-6xl font-black font-headline tracking-tighter">
            Privacy Policy
          </h1>
          <p class="text-text-muted font-bold tracking-tight">
            Last Updated: April 20, 2026
          </p>
        </header>

        <article class="space-y-8 sm:space-y-12 text-text-muted leading-relaxed font-medium">
          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              1. Introduction
            </h2>
            <div class="space-y-4 text-sm md:text-base">
              <p>Welcome to GonkaRouter ("Service", "we", "us", or "our").</p>
              <p>
                We are committed to protecting your privacy and ensuring transparency
                in how we collect, use, and safeguard your information.
              </p>
              <p>
                This Privacy Policy explains how we handle information when you access
                or use our API, applications, or related services.
              </p>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              2. Information We Collect
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base">
              <div class="bg-surface-container-high p-6 rounded-3xl border border-white/5 space-y-4">
                <h3 class="text-lg font-black text-text-main flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
                  2.1 Information You Provide
                </h3>
                <ul class="space-y-2 list-disc pl-5 opacity-80">
                  <li>API requests and inputs (e.g., prompts, messages)</li>
                  <li>Account-related information (if applicable)</li>
                  <li>Contact information if you communicate with us</li>
                </ul>
              </div>
              <div class="bg-surface-container-high p-6 rounded-3xl border border-white/5 space-y-4">
                <h3 class="text-lg font-black text-text-main flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  2.2 Automatically Collected Information
                </h3>
                <ul class="space-y-2 list-disc pl-5 opacity-80">
                  <li>IP address</li>
                  <li>Device and browser type</li>
                  <li>Request metadata (timestamps, endpoints used)</li>
                  <li>Usage data (e.g., API activity and performance metrics)</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              3. How We Use Information
            </h2>
            <div class="bg-surface-container-high/50 p-8 rounded-3xl border border-white/5">
              <p
                class="mb-6 font-bold text-text-main opacity-60 uppercase tracking-widest text-[10px]"
              >
                We use collected information to:
              </p>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm md:text-base">
                <li
                  v-for="use in usageList"
                  :key="use"
                  class="flex items-center gap-3"
                >
                  <span class="shrink-0 w-1 h-1 bg-primary-container rounded-full"></span>
                  {{ use }}
                </li>
              </ul>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              4. Data Retention
            </h2>
            <div class="space-y-4 text-sm md:text-base">
              <p>We may retain API inputs and outputs for a limited period for:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Debugging and troubleshooting</li>
                <li>Service improvement</li>
                <li>Security monitoring</li>
              </ul>
              <p>We aim to minimize data retention and delete data when no longer necessary.</p>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              5. Data Sharing and Disclosure
            </h2>
            <div class="space-y-4 text-sm md:text-base">
              <p>
                We do not sell your personal data. We may share information only in
                the following cases:
              </p>
              <ul class="list-disc pl-5 space-y-1">
                <li>With infrastructure providers (e.g., cloud hosting platforms)</li>
                <li>To comply with applicable laws and legal obligations</li>
                <li>To enforce our terms or protect our rights and users</li>
              </ul>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              6. Data Security
            </h2>
            <p class="text-sm md:text-base">
              We implement reasonable technical and organizational safeguards to
              protect your data. However, no system is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              7. Third-Party Services
            </h2>
            <p class="text-sm md:text-base">
              GonkaRouter may rely on third-party providers (such as cloud
              infrastructure or model providers) to deliver the Service. These
              providers may process data on our behalf under their own privacy
              policies.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              8. International Data Transfers
            </h2>
            <p class="text-sm md:text-base">
              Your information may be processed in jurisdictions outside your country
              of residence, including where our infrastructure providers operate.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              9. Your Rights
            </h2>
            <div class="space-y-4 text-sm md:text-base">
              <p>Depending on your location, you may have rights to:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Access your personal data</li>
                <li>Request correction or deletion</li>
                <li>Object to or restrict processing</li>
              </ul>
              <p>
                To exercise these rights, please contact us at:
                <a
                  href="mailto:contact@gonka-router.com"
                  class="text-primary-container font-black hover:underline"
                  >contact@gonka-router.com</a
                >
              </p>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              10. Children's Privacy
            </h2>
            <p class="text-sm md:text-base">
              Our Service is not intended for individuals under the age of 13 (or
              applicable age in your jurisdiction). We do not knowingly collect
              personal data from children.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              11. Changes to This Policy
            </h2>
            <p class="text-sm md:text-base">
              We may update this Privacy Policy from time to time. Any changes will
              be posted on this page with an updated "Last Updated" date.
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              12. Contact Us
            </h2>
            <p class="text-sm md:text-base">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p class="font-bold text-text-main">
              Email:
              <a
                href="mailto:contact@gonka-router.com"
                class="text-primary-container hover:underline"
                >contact@gonka-router.com</a
              >
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight text-text-main">
              13. API-Specific Notes
            </h2>
            <ul class="list-disc pl-5 space-y-1 text-sm md:text-base">
              <li>We process user inputs (prompts) and outputs solely to provide the Service</li>
              <li>Avoid submitting sensitive personal, financial, or confidential information</li>
              <li>API usage may be logged for performance monitoring and abuse prevention</li>
            </ul>
          </section>

          <section
            class="bg-primary-container/5 border border-primary-container/10 p-8 rounded-3xl space-y-4"
          >
            <h2
              class="text-2xl font-black font-headline tracking-tight text-primary-container"
            >
              14. Security &amp; Web3 Disclaimer
            </h2>
            <ul class="space-y-2 list-disc pl-5 text-sm md:text-base font-bold text-primary-dim">
              <li>
                GonkaRouter does not access or store users' private keys, wallet
                credentials, or blockchain assets
              </li>
              <li>
                Users are solely responsible for the security of their credentials
                and usage of the Service
              </li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideArrowLeft } from 'lucide-vue-next'

definePageMeta({ layout: 'landing' })

const usageList = [
  'Provide, operate, and maintain GonkaRouter',
  'Process and respond to API requests',
  'Improve system performance and reliability',
  'Monitor usage and prevent abuse or misuse',
  'Ensure security and detect fraudulent activity'
]
</script>
