<template>
  <div class="animate-fade-in">
    <!-- Hero -->
    <section class="max-w-4xl mx-auto px-6 sm:px-8 pt-24 sm:pt-32 pb-16 text-center">
      <p class="text-[11px] font-black uppercase tracking-widest text-primary-container mb-4">
        Pricing
      </p>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-headline tracking-tighter text-text-main leading-[1.05] mb-6">
        One rate.<br class="hidden sm:block" /> No surprises.
      </h1>
      <p class="text-text-muted text-base sm:text-lg font-body leading-relaxed max-w-xl mx-auto mb-10">
        GonkaRouter charges a single transparent rate for all models. No monthly fees, no per-model markups — pay only for the tokens you use.
      </p>
      <NuxtLink
        to="/dashboard"
        class="inline-flex items-center gap-2 kinetic-gradient text-primary-on px-8 py-4 rounded-full font-headline font-black text-base transition-all hover:shadow-glow-emerald hover:-translate-y-0.5 active:scale-95"
      >
        Get API Keys — It's Free
      </NuxtLink>
    </section>

    <!-- Core rate card -->
    <section class="max-w-4xl mx-auto px-6 sm:px-8 pb-16">
      <div class="grid md:grid-cols-3 gap-4 sm:gap-6">
        <!-- Main rate -->
        <div class="md:col-span-2 bg-surface-container-low border border-primary-container/20 rounded-3xl p-8 sm:p-10 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1 kinetic-gradient"></div>
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>
          <p class="text-[11px] font-black uppercase tracking-widest text-primary-container mb-4">Flat Token Rate</p>
          <div class="flex items-baseline gap-2 mb-3">
            <span class="text-5xl sm:text-6xl font-black font-headline tracking-tighter text-text-main">$0.0004</span>
            <span class="text-text-muted font-body text-sm">/ 1M tokens</span>
          </div>
          <p class="text-text-muted text-sm font-body mb-8 leading-relaxed">
            Same rate for input and output tokens, across all models. No per-model surcharges.
          </p>
          <ul class="space-y-3">
            <li v-for="f in rateFeatures" :key="f" class="flex items-center gap-3 text-sm font-body text-text-muted">
              <LucideCheck class="w-4 h-4 text-primary-container shrink-0" />
              {{ f }}
            </li>
          </ul>
        </div>

        <!-- Free credit card -->
        <div class="bg-surface-container-low border border-white/5 rounded-3xl p-8 flex flex-col">
          <p class="text-[11px] font-black uppercase tracking-widest text-primary-container mb-4">New Users</p>
          <div class="flex items-baseline gap-1 mb-3">
            <span class="text-4xl font-black font-headline tracking-tighter text-text-main">$20</span>
            <span class="text-text-muted font-body text-sm">one-time</span>
          </div>
          <p class="text-text-muted text-sm font-body mb-6 leading-relaxed flex-1">
            A one-time $20 free credit to get started. No credit card required.
          </p>
          <div class="bg-surface-container-high rounded-2xl p-4 text-xs font-body text-text-muted leading-relaxed">
            Top up your balance with crypto on the Gonka Network and pay only for what you use.
          </div>
        </div>
      </div>
    </section>

    <!-- How billing works -->
    <section class="max-w-4xl mx-auto px-6 sm:px-8 pb-16">
      <h2 class="text-2xl sm:text-3xl font-black font-headline tracking-tight text-text-main mb-8">
        How billing works
      </h2>
      <div class="grid sm:grid-cols-3 gap-4">
        <div
          v-for="step in steps"
          :key="step.title"
          class="bg-surface-container-low border border-white/5 rounded-2xl p-6"
        >
          <div class="w-9 h-9 rounded-xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center mb-4">
            <component :is="step.icon" class="w-4 h-4 text-primary-container" />
          </div>
          <h3 class="font-headline font-black text-base text-text-main mb-2">{{ step.title }}</h3>
          <p class="text-text-muted text-sm font-body leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Models & rates -->
    <section class="max-w-4xl mx-auto px-6 sm:px-8 pb-16">
      <h2 class="text-2xl sm:text-3xl font-black font-headline tracking-tight text-text-main mb-2">
        Available models
      </h2>
      <p class="text-text-muted text-sm mb-8">All models at the same rate — $0.0004 / 1M tokens.</p>
      <div class="border border-white/5 rounded-2xl overflow-hidden">
        <table class="w-full text-sm font-body">
          <thead>
            <tr class="bg-surface-container-high border-b border-white/5">
              <th class="text-left px-6 py-4 font-black text-text-muted uppercase text-[11px] tracking-widest">Model</th>
              <th class="text-left px-6 py-4 font-black text-text-muted uppercase text-[11px] tracking-widest hidden sm:table-cell">Max Output</th>
              <th class="text-right px-6 py-4 font-black text-text-muted uppercase text-[11px] tracking-widest">Input</th>
              <th class="text-right px-6 py-4 font-black text-text-muted uppercase text-[11px] tracking-widest">Output</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(model, i) in models"
              :key="model.name"
              class="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <td class="px-6 py-4">
                <div class="font-black text-text-main text-sm">{{ model.name }}</div>
                <div class="text-[11px] text-text-muted font-mono mt-0.5 hidden sm:block">{{ model.id }}</div>
              </td>
              <td class="px-6 py-4 text-text-muted hidden sm:table-cell">{{ model.ctx }}</td>
              <td class="px-6 py-4 text-right">
                <span class="text-primary-container font-black">$0.0004</span>
                <span class="text-text-muted text-[11px]">/1M</span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-primary-container font-black">$0.0004</span>
                <span class="text-text-muted text-[11px]">/1M</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-text-muted text-xs mt-4 font-body">
        Context figures are each model's published limit. Prompts in the hundreds of
        thousands of tokens take minutes to process and can exceed the gateway's
        10-minute request timeout — split very long inputs across turns.
      </p>
      <p class="text-text-muted text-xs mt-2 font-body">
        More models coming soon.
        <NuxtLink to="/models" class="text-primary-container hover:underline">View all models →</NuxtLink>
      </p>
    </section>

    <!-- FAQ teaser -->
    <section class="max-w-4xl mx-auto px-6 sm:px-8 pb-24 sm:pb-32">
      <div class="bg-surface-container-low border border-white/5 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 class="text-xl font-black font-headline tracking-tight text-text-main mb-2">
            Questions about pricing?
          </h2>
          <p class="text-text-muted text-sm font-body">
            Check the FAQ or reach out to our team.
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <NuxtLink
            to="/faq"
            class="inline-flex items-center gap-2 bg-surface-container-high ghost-border text-text-main px-5 py-2.5 rounded-full font-headline font-black text-sm transition-all hover:bg-white/5"
          >
            View FAQ
          </NuxtLink>
          <a
            href="mailto:contact@gonka-router.com"
            class="inline-flex items-center gap-2 kinetic-gradient text-primary-on px-5 py-2.5 rounded-full font-headline font-black text-sm transition-all hover:shadow-glow-emerald active:scale-95"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { LucideCheck, LucideWallet, LucideZap, LucideBarChart2 } from 'lucide-vue-next'

definePageMeta({ layout: 'landing' })

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://gonkarouter.io'

useSeoMeta({
  title: 'Pricing — $0.0004 per 1M tokens',
  description:
    'GonkaRouter charges a flat $0.0004 per 1M tokens for all models — input and output. No monthly fees, no per-model markups. New users get $20 credits.',
  ogTitle: 'Pricing | GonkaRouter',
  ogDescription:
    'Flat $0.0004 per 1M tokens across all models. No subscriptions. A one-time $20 free credit for new users.',
  ogUrl: `${siteUrl}/pricing`,
  twitterTitle: 'Pricing | GonkaRouter',
  twitterDescription:
    'Flat $0.0004 per 1M tokens. No monthly fees. A one-time $20 free credit for new users.'
})
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/pricing` }] })

useStructuredData([
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'GonkaRouter Pricing',
    description:
      'GonkaRouter charges a flat $0.0004 per 1M tokens for all AI models, with no monthly fees and a one-time $20 free credit for new users.',
    url: `${siteUrl}/pricing`
  },
  breadcrumbList([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Pricing', url: `${siteUrl}/pricing` }
  ])
])

const rateFeatures = [
  'Same rate for all models — no tiers',
  'Input and output tokens billed equally',
  'No monthly subscription or base fee',
  'Pay only for tokens consumed',
  'Crypto-native payments on the Gonka Network',
  'One-time $20 free credit for new users'
]

const steps = [
  {
    icon: LucideWallet,
    title: 'Sign in & get credits',
    desc: 'Sign in with email or Google. New accounts automatically receive a one-time $20 free credit.'
  },
  {
    icon: LucideZap,
    title: 'Use the API',
    desc: 'Make API calls using any OpenAI-compatible SDK. Each request deducts from your balance at $0.0004 per 1M tokens.'
  },
  {
    icon: LucideBarChart2,
    title: 'Monitor & top up',
    desc: 'Track usage and billing in real time on the Dashboard. Top up with crypto whenever you need more credits.'
  }
]

const models = [
  // Published limit (max_position_embeddings 1048576). Reaching it in practice
  // is load-dependent — see the timeout note rendered under the table.
  { name: 'DeepSeek-V4-Flash', id: 'deepseek-ai/DeepSeek-V4-Flash-0731', ctx: '1M' },
  { name: 'MiniMax-M2.7', id: 'MiniMaxAI/MiniMax-M2.7', ctx: '192K' },
  { name: 'Kimi-K2.6', id: 'moonshotai/Kimi-K2.6', ctx: '262K' }
  // TEMP 2026-06-25: Qwen3-235B hidden while upstream Gonka takes it offline for
  // adjustment. Restore when it is back online.
  // { name: 'Qwen3-235B-A22B-Instruct', id: 'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8', ctx: '262K' }
]
</script>
