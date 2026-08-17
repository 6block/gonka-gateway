<template>
  <div>
    <!-- Hero -->
    <section
      id="hero"
      class="relative asymmetric-padding px-4 sm:px-6 md:px-8 overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center text-center"
    >
      <!-- Floating particles -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <span
          v-for="p in particles"
          :key="p.id"
          class="absolute w-1 h-1 rounded-full bg-primary-container opacity-20 particle"
          :style="p.style"
        ></span>
      </div>

      <div class="relative z-10 max-w-6xl animate-fade-in">
        <div class="flex flex-col items-center gap-4 mb-10">
          <div
            class="inline-flex items-center gap-2 bg-surface-container-high ghost-border px-5 py-2 rounded-full"
          >
            <span class="flex h-2 w-2 rounded-full bg-primary-container animate-pulse"></span>
            <span
              class="font-label text-xs tracking-widest uppercase text-secondary font-bold"
            >
              Now Supporting DeepSeek-V4-Flash
            </span>
          </div>
        </div>

        <h1
          class="font-headline text-[2.25rem] leading-[1.08] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-5 sm:mb-6 sm:leading-[1.05] animate-float"
        >
          <span class="text-primary-dim">AI Model Router</span><br />
          <span class="text-text-main">on the Gonka Network</span>
        </h1>

        <div
          class="inline-flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 px-5 py-2 rounded-full mb-12 animate-scale-in"
        >
          <LucideZap class="w-4 h-4 text-primary-container" />
          <span class="text-xs sm:text-sm font-bold tracking-wide text-primary-container uppercase">
            New users get $20 credits
          </span>
        </div>

        <p
          class="font-body text-text-muted text-base sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 sm:mb-16 leading-relaxed font-light whitespace-pre-line"
        >
          {{ heroDescription }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <NuxtLink
            to="/dashboard"
            class="w-full sm:w-auto kinetic-gradient text-primary-on px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-headline font-black text-base sm:text-lg transition-all hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 hover:shadow-glow-emerald-lg"
          >
            Get API Keys
          </NuxtLink>
          <button
            @click="scrollToModels"
            class="w-full sm:w-auto bg-surface-container-highest text-text-main ghost-border px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-headline font-bold text-base sm:text-lg hover:bg-surface-container-high transition-all hover:-translate-y-0.5"
          >
            Explore Models
          </button>
        </div>

      </div>
    </section>

    <!-- Why Choose -->
    <section
      id="features"
      class="pt-12 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 bg-surface relative overflow-hidden"
    >
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8 sm:mb-12">
          <h2
            class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-text-main tracking-tight"
          >
            Why Choose GonkaRouter
          </h2>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          <div
            v-for="item in whyItems"
            :key="item.title"
            class="bg-surface-container-high p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] border border-white/5 hover:border-primary-container/30 transition-all group hover:-translate-y-1.5 duration-300"
          >
            <div
              class="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-primary-container/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary-container mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform"
            >
              <component :is="item.icon" class="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <h3 class="font-headline font-black text-base sm:text-lg lg:text-lg text-text-main leading-tight">
              {{ item.title }}
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Model -->
    <section
      id="models"
      class="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-surface relative overflow-hidden"
    >
      <div class="max-w-5xl mx-auto text-center relative z-10">
        <!-- Model toggle -->
        <div class="flex justify-center mb-10">
          <div
            class="inline-flex bg-surface-container-high p-1 rounded-full border border-white/5"
            role="tablist"
            aria-label="Featured model selector"
          >
            <button
              v-for="model in featuredModels"
              :key="model.id"
              type="button"
              role="tab"
              :aria-selected="featuredModel === model.id"
              @click="featuredModel = model.id"
              class="px-5 py-2 rounded-full text-xs font-black tracking-tight transition-all"
              :class="
                featuredModel === model.id
                  ? 'bg-primary-container text-primary-on shadow-lg shadow-primary-container/20'
                  : 'text-text-muted hover:text-text-main'
              "
            >
              {{ model.label }}
            </button>
          </div>
        </div>

        <h2
          class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-text-main mb-6 sm:mb-8 tracking-tight"
        >
          Featured Model: {{ activeFeatured.label }}
        </h2>
        <p class="font-body text-text-muted text-base sm:text-xl mb-10 sm:mb-14 max-w-3xl mx-auto font-light leading-relaxed">
          {{ activeFeatured.tagline }}
        </p>

        <div class="flex flex-col gap-8 sm:gap-12 items-center">
          <div class="flex flex-wrap justify-center gap-3 sm:gap-6">
            <div
              v-for="feature in features"
              :key="feature.label"
              class="flex items-center gap-2 sm:gap-3 bg-surface-container-high px-5 sm:px-8 py-3 sm:py-4 rounded-full ghost-border hover:border-primary-container/30 hover:bg-surface-container-highest transition-all cursor-default hover:scale-105 duration-300"
            >
              <component :is="feature.icon" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-container" />
              <span class="font-label text-xs sm:text-sm font-bold text-text-main tracking-wide">
                {{ feature.label }}
              </span>
            </div>
          </div>

          <!-- Code preview -->
          <div
            class="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden text-left relative z-10 shadow-xl shadow-black/30 hover:-translate-y-1 transition-transform duration-500"
          >
            <div
              class="bg-surface-container-high px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 border-b border-white/5"
            >
              <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500/40"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/40"></div>
              </div>
              <span
                class="text-[10px] sm:text-xs text-text-muted font-label ml-3 sm:ml-6 font-bold tracking-widest uppercase"
              >
                inference.py
              </span>
              <div class="ml-auto flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></div>
                <span
                  class="text-[10px] font-black text-primary-container uppercase tracking-tighter"
                >
                  Live
                </span>
              </div>
            </div>
            <div class="p-5 sm:p-8 md:p-10 font-mono text-xs sm:text-sm md:text-base leading-relaxed overflow-x-auto custom-scrollbar">
              <pre class="text-secondary"><code><span class="text-text-muted"># pip install openai</span>
<span class="text-primary-dim">from</span> openai <span class="text-primary-dim">import</span> OpenAI

client = OpenAI(
    api_key=<span class="text-tertiary">"sk-xxxxxx"</span>,
    base_url=<span class="text-tertiary">"{{ baseUrl }}"</span>,
)

response = client.chat.completions.create(
    model=<span class="text-tertiary">"{{ activeFeatured.apiId }}"</span>,
    messages=[
        {<span class="text-tertiary">"role"</span>: <span class="text-tertiary">"user"</span>, <span class="text-tertiary">"content"</span>: <span class="text-tertiary">"Hello!"</span>},
    ],
)

print(response.choices[<span class="text-tertiary">0</span>].message.content)<span class="inline-block w-2 h-5 bg-primary-container ml-1 align-middle animate-pulse"></span></code></pre>
            </div>
          </div>

          <NuxtLink
            to="/dashboard"
            class="kinetic-gradient text-primary-on px-8 py-4 rounded-full font-headline font-black text-lg transition-all active:scale-95 hover:shadow-glow-emerald-lg hover:-translate-y-0.5"
          >
            Get API Keys
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-surface">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-text-main tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p class="text-text-muted text-sm sm:text-base font-body leading-relaxed max-w-2xl mx-auto">
            The most common integration notes from the GonkaRouter documentation, condensed for quick scanning before you open the full guide.
          </p>
        </div>

        <div class="space-y-3 sm:space-y-4">
          <div
            v-for="(item, index) in displayedFaqs"
            :key="index"
            class="rounded-2xl border transition-all duration-200"
            :class="homeFaqOpen === index
              ? 'border-primary-container/70 bg-surface-container-high'
              : 'border-white/5 bg-surface-container-high/60 hover:bg-surface-container-high'"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full flex items-center justify-between gap-6 px-5 sm:px-6 py-5 text-left"
              :aria-expanded="homeFaqOpen === index"
            >
              <span class="font-body font-semibold text-base sm:text-lg leading-snug text-text-main">
                {{ item.q }}
              </span>
              <span
                class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border font-bold text-sm transition-all duration-200"
                :class="homeFaqOpen === index
                  ? 'rotate-90 border-primary-container/70 text-primary-container'
                  : 'border-white/10 text-text-muted'"
              >&gt;</span>
            </button>
            <Transition name="faq-slide">
              <div v-if="homeFaqOpen === index" class="px-5 sm:px-6 pb-5 overflow-hidden">
                <p class="text-text-muted text-sm sm:text-base font-body leading-relaxed" v-html="item.a"></p>
              </div>
            </Transition>
          </div>
        </div>

        <div class="flex flex-col items-center gap-4 mt-10">
          <button
            @click="showAllFaqs = !showAllFaqs; if (!showAllFaqs) homeFaqOpen = null"
            class="inline-flex items-center gap-2 bg-surface-container-high ghost-border text-text-main px-6 py-3 rounded-full font-headline font-bold text-sm transition-all hover:bg-white/5 hover:-translate-y-0.5"
          >
            <span v-if="!showAllFaqs">Show more FAQs +</span>
            <span v-else>Show fewer FAQs ^</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Blog Section — only shown when API returns posts -->
    <section v-if="allBlogPosts.length > 0" class="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-surface relative overflow-hidden">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <p class="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-text-muted mb-2 sm:mb-3">
              Latest Updates
            </p>
            <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-text-main tracking-tight">
              News Blog
            </h2>
          </div>
          <NuxtLink
            to="/blog"
            class="text-primary-container font-headline font-black text-sm hover:underline whitespace-nowrap mb-1.5"
          >
            See More →
          </NuxtLink>
        </div>

        <!-- Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <NuxtLink
            v-for="post in displayedBlogPosts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="group block"
          >
            <!-- Card visual — real cover when present, generated gradient otherwise -->
            <div
              class="relative h-40 rounded-2xl overflow-hidden mb-4"
              :style="post.cover ? undefined : { background: post.bgGradient }"
            >
              <img
                v-if="post.cover"
                :src="post.cover"
                :alt="post.title"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <template v-else>
                <div
                  class="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full blur-2xl"
                  :style="{ background: post.glowColor }"
                ></div>
                <div class="absolute inset-0 flex items-end justify-center gap-1.5 pb-6">
                  <div
                    v-for="(h, i) in post.bars"
                    :key="i"
                    class="rounded-full opacity-70"
                    :style="{ width: '13px', height: h + 'px', background: post.barColor }"
                  ></div>
                </div>
              </template>
              <div class="absolute top-4 left-4">
                <span
                  class="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                  :class="blogTagStyle(post.tag)"
                >{{ post.tag }}</span>
              </div>
            </div>
            <!-- Post meta -->
            <p class="text-[10px] text-text-muted font-body mb-2 uppercase tracking-widest">{{ post.date }}</p>
            <h3 class="font-headline font-black text-base sm:text-lg text-text-main tracking-tight group-hover:text-primary-container transition-colors line-clamp-2 mb-2">
              {{ post.title }}
            </h3>
            <p class="text-text-muted text-xs sm:text-sm font-body leading-relaxed line-clamp-2">
              {{ post.excerpt }}
            </p>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center gap-5 mt-10 sm:mt-14">
          <button
            @click="blogPage = Math.max(0, blogPage - 1)"
            :disabled="blogPage === 0"
            class="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-text-main hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm"
          >
            &lt;
          </button>
          <span class="font-headline font-black text-sm text-text-muted tracking-tight tabular-nums">
            {{ String(blogPage + 1).padStart(2, '0') }} / {{ String(totalBlogPages).padStart(2, '0') }}
          </span>
          <button
            @click="blogPage = Math.min(totalBlogPages - 1, blogPage + 1)"
            :disabled="blogPage >= totalBlogPages - 1"
            class="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-text-main hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import {
  LucideZap,
  LucideShield,
  LucideGlobe,
  LucideDatabase,
  LucideTerminal
} from 'lucide-vue-next'

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const homeFaqs = [
  {
    q: 'What is GonkaRouter?',
    a: 'GonkaRouter is an AI model router built on the Gonka Network. It gives you a single, OpenAI-compatible API endpoint that routes your requests to the best available AI model — including DeepSeek-V4-Flash, MiniMax-M2.7, Kimi-K2.6, and more — with transparent per-token pricing and no monthly subscriptions.'
  },
  {
    q: 'Is GonkaRouter an OpenRouter alternative?',
    a: 'Yes. Like OpenRouter, GonkaRouter provides a unified API to access multiple large language models. The key difference is that GonkaRouter is built on the Gonka Network with crypto-native payments, lower per-token rates starting at <strong class="text-text-main">$0.0004 per 1M tokens</strong>, and a one-time $20 free credit for new users.'
  },
  {
    q: 'How is GonkaRouter different from OpenRouter?',
    a: `A flat $0.0004 per 1M tokens for both input and output — no model-by-model price table to worry about. Crypto-native billing on the Gonka Network: no credit card, no subscriptions. New users get $20 credits.`
  },
  {
    q: 'How does GonkaRouter pricing work?',
    a: 'GonkaRouter charges a flat rate of <strong class="text-text-main">$0.0004 per 1 million tokens</strong>, applied equally to both input and output tokens. There are no monthly fees or per-model surcharges. New users get $20 credits. After that, you top up your balance and are billed only for what you consume.'
  },
  {
    q: 'Which AI models does GonkaRouter support?',
    a: 'GonkaRouter currently supports <strong class="text-text-main">DeepSeek-V4-Flash</strong>, <strong class="text-text-main">MiniMax-M2.7</strong>, <strong class="text-text-main">Kimi-K2.6</strong>, with more models being added regularly. All models share the same $0.0004/1M token rate and are accessible through one unified API endpoint.'
  },
  {
    q: 'Is the API compatible with OpenAI SDKs?',
    a: 'Yes. GonkaRouter uses an OpenAI-compatible API format. You can use the official OpenAI Python or TypeScript SDK by simply changing the <code class="bg-surface-container-highest px-1.5 py-0.5 rounded text-primary-dim text-[13px]">base_url</code> to <code class="bg-surface-container-highest px-1.5 py-0.5 rounded text-primary-dim text-[13px]">https://api.gonkarouter.io/v1</code> and setting your GonkaRouter API key.'
  },
  {
    q: 'Do I need a crypto wallet to use GonkaRouter?',
    a: 'No. Sign in with your email or Google account — no wallet required. A crypto wallet is only needed if you want to top up your balance with USDT (BEP-20) on the Gonka Network. You can also browse the Chat and Models pages as a guest.'
  },
  {
    q: 'How do I get started?',
    a: 'Getting started takes less than a minute: sign in with email or Google on the Dashboard, copy your API key, and replace the <code class="bg-surface-container-highest px-1.5 py-0.5 rounded text-primary-dim text-[13px]">base_url</code> in your existing OpenAI SDK calls. New accounts automatically receive a one-time $20 free credit — no payment setup required to start.'
  }
]

const INITIAL_FAQ_COUNT = 5
const homeFaqOpen = ref(null)
const showAllFaqs = ref(false)
const displayedFaqs = computed(() =>
  showAllFaqs.value ? homeFaqs : homeFaqs.slice(0, INITIAL_FAQ_COUNT)
)
const toggleFaq = (index) => {
  homeFaqOpen.value = homeFaqOpen.value === index ? null : index
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
const TAG_VISUAL = {
  Guide:       { bgGradient: 'radial-gradient(circle at 25% 60%, rgba(16,185,129,0.3) 0%, transparent 55%), #0a0e14', glowColor: '#10B981', barColor: '#34D399' },
  IDE:         { bgGradient: 'radial-gradient(circle at 25% 60%, rgba(59,130,246,0.3) 0%, transparent 55%), #0a0e14', glowColor: '#3B82F6', barColor: '#60A5FA' },
  Agents:      { bgGradient: 'radial-gradient(circle at 25% 60%, rgba(124,58,237,0.3) 0%, transparent 55%), #0a0e14', glowColor: '#7C3AED', barColor: '#A78BFA' },
  Product:     { bgGradient: 'radial-gradient(circle at 25% 60%, rgba(6,182,212,0.3) 0%, transparent 55%), #0a0e14',  glowColor: '#06B6D4', barColor: '#22D3EE' },
  Engineering: { bgGradient: 'radial-gradient(circle at 25% 60%, rgba(56,189,248,0.3) 0%, transparent 55%), #0a0e14', glowColor: '#38BDF8', barColor: '#7DD3FC' },
}
const DEFAULT_VISUAL = { bgGradient: 'radial-gradient(circle at 25% 60%, rgba(99,102,241,0.3) 0%, transparent 55%), #0a0e14', glowColor: '#6366F1', barColor: '#818CF8' }

const genBars = (slug) => {
  const seed = (slug || 'x').split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  return Array.from({ length: 7 }, (_, i) => 22 + ((seed * (i + 3) * 17 + i * 23) % 54))
}

const allBlogPosts = ref([])

const POSTS_PER_PAGE = 3
const blogPage = ref(0)
const totalBlogPages = computed(() => Math.ceil(allBlogPosts.value.length / POSTS_PER_PAGE))
const displayedBlogPosts = computed(() =>
  allBlogPosts.value.slice(blogPage.value * POSTS_PER_PAGE, (blogPage.value + 1) * POSTS_PER_PAGE)
)

const blogTagStyle = (tag) => {
  const map = {
    Guide:       'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    IDE:         'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    Agents:      'bg-violet-500/20 text-violet-400 border border-violet-500/30',
    Product:     'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    Engineering: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
  }
  return map[tag] ?? 'bg-white/5 text-text-muted border border-white/10'
}

definePageMeta({ layout: 'landing' })

const config = useRuntimeConfig()
const baseUrl = computed(() => `${config.public.apiBase}/v1`)

const siteUrl = config.public.siteUrl || 'https://gonkarouter.io'
useSeoMeta({
  title: 'AI Model Router on the Gonka Network',
  description:
    'One API for all AI models. OpenAI/Anthropic compatible, $0.0004 per 1M tokens, with a one-time $20 free credit for new users.',
  ogTitle: 'GonkaRouter — AI Model Router on the Gonka Network',
  ogDescription:
    'One API for all AI models. OpenAI/Anthropic compatible, $0.0004 per 1M tokens.',
  ogUrl: siteUrl,
  twitterTitle: 'GonkaRouter — AI Model Router on the Gonka Network',
  twitterDescription:
    'One API for all AI models. OpenAI/Anthropic compatible, $0.0004 per 1M tokens.'
})
useHead({ link: [{ rel: 'canonical', href: siteUrl }] })

const heroDescription =
  'One API for All AI Models\nDevelopers first\nAt $0.0004 per 1M tokens'

const whyItems = [
  { title: 'Cost-Effective Pricing', icon: LucideZap },
  { title: 'Crypto-Native Payments', icon: LucideShield },
  { title: 'Global Access', icon: LucideGlobe },
  { title: 'Integration with Web3 Ecosystems', icon: LucideDatabase }
]

const features = [
  { label: '262k Context Window', icon: LucideZap },
  { label: 'Function Calling Ready', icon: LucideTerminal },
  { label: 'Private VPC Deployment', icon: LucideShield }
]

const featuredModels = [
  {
    id: 'deepseek',
    label: 'DeepSeek-V4-Flash',
    apiId: 'deepseek-ai/DeepSeek-V4-Flash-0731',
    tagline:
      'Optimized DeepSeek-V4-Flash: The speed-tuned V4 variant — low-latency general chat, summarisation, and code assistance with reliable tool calling on the Gonka pipeline.'
  },
  {
    id: 'minimax',
    label: 'MiniMax-M2.7',
    apiId: 'MiniMaxAI/MiniMax-M2.7',
    tagline:
      'Optimized MiniMax-M2.7: A self-evolving agent model built for elite coding and complex agent harnesses — end-to-end software engineering and stable long-chain tool calling on the Gonka pipeline.'
  },
  {
    id: 'kimi',
    label: 'Kimi-K2.6',
    apiId: 'moonshotai/Kimi-K2.6',
    tagline:
      'Optimized Kimi-K2.6: Superior long-context reasoning with enhanced throughput on the Gonka pipeline.'
  }
  // TEMP 2026-06-25: Qwen3-235B hidden while upstream Gonka takes it offline for
  // adjustment. Restore when it is back online.
  // {
  //   id: 'qwen',
  //   label: 'Qwen3-235B',
  //   apiId: 'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8',
  //   tagline:
  //     'Optimized Qwen3-235B: Industry-leading reasoning performance with 40% faster Time to First Token (TTFT).'
  // }
]
const featuredModel = ref(featuredModels[0].id)
const activeFeatured = computed(
  () => featuredModels.find((m) => m.id === featuredModel.value) ?? featuredModels[0]
)

function scrollToModels() {
  const el = document.getElementById('models')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// Particles must be generated client-only — Math.random() during SSR vs.
// hydration would produce a Vue hydration mismatch warning.
const particles = ref([])
onMounted(async () => {
  particles.value = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    style: `left:${Math.random() * 100}%; top:${Math.random() * 100}%; animation-delay:${
      Math.random() * 10
    }s; animation-duration:${10 + Math.random() * 20}s;`
  }))

  // Load blog posts from API and enrich with visual metadata
  const { fetchPosts } = useBlogPosts()
  const posts = await fetchPosts()
  allBlogPosts.value = posts.map((p) => ({
    ...p,
    ...(TAG_VISUAL[p.tag] ?? DEFAULT_VISUAL),
    bars: genBars(p.slug),
  }))
})
</script>

<style scoped>
.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: opacity 0.2s ease, max-height 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.faq-slide-enter-from,
.faq-slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.faq-slide-enter-to,
.faq-slide-leave-from {
  opacity: 1;
  max-height: 400px;
}

.particle {
  animation-name: particleFloat;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes particleFloat {
  0% {
    transform: translateY(20%);
    opacity: 0;
  }
  30% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-120vh);
    opacity: 0;
  }
}
</style>
