<template>
  <div class="home">
    <!-- Hero: live particle network under a thin instrument layer -->
    <section id="hero" class="hero" aria-labelledby="hero-title">
      <HeroParticles
        :shift-x="HERO_FORM.shiftX"
        :shift-y="HERO_FORM.shiftY"
        :wide-scale="HERO_FORM.wideScale"
        :wide-from="HERO_FORM.wideFrom"
      />

      <div class="hero__ui">
        <h1 id="hero-title" class="hero__title">
          <span>AI Model Router</span>
          <span class="hero__title-dim">on the Gonka Network</span>
        </h1>

        <div class="hero__side">
          <ul class="facts" aria-label="Highlights">
            <li class="facts__item facts__item--key">10M free tokens for new users</li>
            <li class="facts__item">OpenAI + Anthropic compatible</li>
            <li class="facts__item">New: GLM-5.3-Flash</li>
          </ul>
          <p class="hero__lede">{{ heroDescription }}</p>
          <div class="hero__cta">
            <NuxtLink to="/dashboard" class="lbtn lbtn--primary lbtn--lg">
              Get API Keys
              <LucideArrowRight class="w-4 h-4" aria-hidden="true" />
            </NuxtLink>
            <button type="button" class="lbtn lbtn--ghost lbtn--lg hero__ghost" @click="scrollToModels">
              Explore models
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- At a glance: the facts that used to crowd the first viewport -->
    <section id="glance" class="glance" aria-label="At a glance">
      <div class="glance__inner">
        <div class="glance__cell">
          <h2 class="tag-head">[info]</h2>
          <p>One OpenAI- and Anthropic-compatible endpoint for open models served by the decentralized Gonka Network.</p>
        </div>
        <div class="glance__cell">
          <h2 class="tag-head">[pricing]</h2>
          <p class="glance__figure">{{ fromPer1M }}<span class="dim"> / 1M tokens</span></p>
          <p>One rate for input and output that tracks the live Gonka network price. USDT top-up, no subscription, no card.</p>
        </div>
        <div class="glance__cell glance__cell--models">
          <h2 class="tag-head">[models]</h2>
          <ol class="glance__models">
            <li v-for="model in featuredModels" :key="model.id">
              <button type="button" class="glance__model" @click="openModel(model.id)">
                <span class="glance__model-name">{{ model.label }}<br /><span class="dim">{{ model.apiId }}</span></span>
                <span class="glance__model-spec">{{ model.spec }}</span>
              </button>
            </li>
          </ol>
        </div>
        <div class="glance__cell">
          <h2 class="tag-head">[connect]</h2>
          <NuxtLink to="/docs" class="about-link">Docs <LucideArrowRight class="w-3.5 h-3.5" aria-hidden="true" /></NuxtLink>
          <NuxtLink to="/pricing" class="about-link">Pricing <LucideArrowRight class="w-3.5 h-3.5" aria-hidden="true" /></NuxtLink>
          <a href="https://discord.gg/pAbxwbzbDZ" target="_blank" rel="noreferrer" class="about-link">
            Discord <LucideArrowUpRight class="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <!-- Why Choose -->
    <section id="features" class="sec" aria-labelledby="why-title">
      <div class="sec__inner sec__split">
        <header class="sec__head">
          <h2 id="why-title" class="display-2">Why choose GonkaRouter</h2>
          <p class="sec__lede">Open models at the network's own price, behind the SDK you already use.</p>
        </header>
        <ul class="ledger">
          <li v-for="item in whyItems" :key="item.title" class="ledger__row">
            <component :is="item.icon" class="ledger__icon" aria-hidden="true" />
            <h3 class="ledger__title">{{ item.title }}</h3>
            <p class="ledger__text">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Featured Model -->
    <section id="models" class="sec" aria-labelledby="models-title">
      <div class="sec__inner">
        <div class="models__top">
          <h2 id="models-title" class="display-2">Featured model</h2>
          <div class="tabs" role="tablist" aria-label="Featured model selector">
            <button
              v-for="model in featuredModels"
              :id="`tab-${model.id}`"
              :key="model.id"
              type="button"
              role="tab"
              class="chip chip--btn"
              :class="{ 'chip--on': featuredModel === model.id }"
              :aria-selected="featuredModel === model.id"
              :aria-controls="`panel-${model.id}`"
              @click="featuredModel = model.id"
            >
              {{ model.label }}
            </button>
          </div>
        </div>

        <div :id="`panel-${activeFeatured.id}`" class="models__grid" role="tabpanel" :aria-labelledby="`tab-${activeFeatured.id}`">
          <div class="models__info">
            <h3 class="models__name">{{ activeFeatured.label }}</h3>
            <p class="models__tagline">{{ activeFeatured.tagline }}</p>
            <ul class="specs">
              <li v-for="feature in features" :key="feature.label" class="specs__row">
                <component :is="feature.icon" class="w-4 h-4 text-primary-container" aria-hidden="true" />
                {{ feature.label }}
              </li>
              <li class="specs__row">
                <LucideTag class="w-4 h-4 text-primary-container" aria-hidden="true" />
                From {{ fromPer1M }} / 1M tokens
              </li>
            </ul>
            <NuxtLink to="/dashboard" class="lbtn lbtn--primary lbtn--lg">
              Get API Keys
              <LucideArrowRight class="w-4 h-4" aria-hidden="true" />
            </NuxtLink>
          </div>

          <div class="code">
            <div class="code__bar">
              <span>inference.py</span>
              <span class="code__model">{{ activeFeatured.apiId }}</span>
              <span class="code__lang">Python · OpenAI SDK</span>
            </div>
            <pre class="code__body"><code><span class="text-text-muted"># pip install openai</span>
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

print(response.choices[<span class="text-tertiary">0</span>].message.content)<span class="code__caret" aria-hidden="true"></span></code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="sec" aria-labelledby="faq-title">
      <div class="sec__inner sec__split">
        <header class="sec__head">
          <h2 id="faq-title" class="display-2">Frequently asked questions</h2>
          <p class="sec__lede">The most common integration notes from the documentation, condensed for quick scanning.</p>
          <NuxtLink to="/docs" class="about-link">Read the docs <LucideArrowRight class="w-3.5 h-3.5" aria-hidden="true" /></NuxtLink>
        </header>

        <div>
          <div class="faq">
            <div v-for="(item, index) in displayedFaqs" :key="item.q" class="faq__item" :class="{ 'is-open': homeFaqOpen === index }">
              <h3>
                <button
                  :id="`faq-q-${index}`"
                  type="button"
                  class="faq__q"
                  :aria-expanded="homeFaqOpen === index"
                  :aria-controls="`faq-a-${index}`"
                  @click="toggleFaq(index)"
                >
                  <span>{{ item.q }}</span>
                  <LucidePlus class="faq__icon" aria-hidden="true" />
                </button>
              </h3>
              <div
                :id="`faq-a-${index}`"
                class="faq__a"
                role="region"
                :aria-labelledby="`faq-q-${index}`"
                :inert="homeFaqOpen !== index"
              >
                <div class="faq__a-inner"><p v-html="item.a"></p></div>
              </div>
            </div>
          </div>
          <button type="button" class="lbtn lbtn--ghost faq__more" @click="toggleAllFaqs">
            {{ showAllFaqs ? 'Show fewer' : `Show all ${homeFaqs.length}` }}
          </button>
        </div>
      </div>
    </section>

    <!-- Blog — only shown when API returns posts -->
    <section v-if="allBlogPosts.length > 0" class="sec" aria-labelledby="blog-title">
      <div class="sec__inner">
        <div class="blog__top">
          <h2 id="blog-title" class="display-2">News blog</h2>
          <NuxtLink to="/blog" class="about-link">See all posts <LucideArrowRight class="w-3.5 h-3.5" aria-hidden="true" /></NuxtLink>
        </div>

        <div class="blog__grid">
          <NuxtLink v-for="post in displayedBlogPosts" :key="post.slug" :to="`/blog/${post.slug}`" class="post">
            <div class="post__thumb" :style="post.cover ? undefined : { background: post.bgGradient }">
              <img v-if="post.cover" :src="post.cover" :alt="post.title" loading="lazy" class="post__img" />
              <template v-else>
                <div class="post__glow" :style="{ background: post.glowColor }"></div>
                <div class="post__bars">
                  <div v-for="(h, i) in post.bars" :key="i" :style="{ height: h + 'px', background: post.barColor }"></div>
                </div>
              </template>
            </div>
            <div class="post__meta">
              <span>{{ post.date }}</span>
              <span class="chip chip--sm">{{ post.tag }}</span>
            </div>
            <h3 class="post__title">{{ post.title }}</h3>
            <p class="post__excerpt">{{ post.excerpt }}</p>
          </NuxtLink>
        </div>

        <div v-if="totalBlogPages > 1" class="pager">
          <button type="button" class="icon-btn" :disabled="blogPage === 0" aria-label="Previous posts" @click="blogPage = Math.max(0, blogPage - 1)">
            <LucideChevronLeft class="w-4 h-4" aria-hidden="true" />
          </button>
          <span class="pager__count">{{ String(blogPage + 1).padStart(2, '0') }} / {{ String(totalBlogPages).padStart(2, '0') }}</span>
          <button type="button" class="icon-btn" :disabled="blogPage >= totalBlogPages - 1" aria-label="Next posts" @click="blogPage = Math.min(totalBlogPages - 1, blogPage + 1)">
            <LucideChevronRight class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>

    <!-- Close -->
    <section class="sec close" aria-labelledby="close-title">
      <div class="sec__inner">
        <h2 id="close-title" class="close__title">Change one line.<br /><span class="hero__title-dim">Keep your OpenAI SDK.</span></h2>
        <code class="close__code"><span class="dim">base_url=</span>"{{ baseUrl }}"</code>
        <div class="hero__cta">
          <NuxtLink to="/dashboard" class="lbtn lbtn--primary lbtn--lg">
            Get API Keys
            <LucideArrowRight class="w-4 h-4" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink to="/docs" class="lbtn lbtn--ghost lbtn--lg">Read the docs</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import {
  LucideArrowRight,
  LucideArrowUpRight,
  LucideChevronLeft,
  LucideChevronRight,
  LucideDatabase,
  LucideGlobe,
  LucidePlus,
  LucideShield,
  LucideTag,
  LucideTerminal,
  LucideZap
} from 'lucide-vue-next'

// The home page is always dark: the hero is a black WebGL field.
definePageMeta({ layout: 'landing', colorMode: 'dark' })

// The particle form is centred and large; the headline and the offer sit on
// either side of it along the bottom edge. shiftX/shiftY nudge the form's
// centre (fractions of the canvas), wideScale grows it on wide screens.
const HERO_FORM = { shiftX: 0.02, shiftY: -0.02, wideScale: 1.22, wideFrom: 1100 }

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const homeFaqs = [
  {
    q: 'What is GonkaRouter?',
    a: 'GonkaRouter is an AI model router built on the Gonka Network. It gives you a single, OpenAI-compatible API endpoint that routes your requests to the best available AI model — including GLM-5.3-Flash, DeepSeek-V4-Flash and MiniMax-M2.7 — with transparent per-token pricing and no monthly subscriptions.'
  },
  {
    q: 'Is GonkaRouter an OpenRouter alternative?',
    a: 'Yes. Like OpenRouter, GonkaRouter provides a unified API to access multiple large language models. The key difference is that GonkaRouter is built on the Gonka Network with crypto-native payments and <strong class="text-text-main">per-token rates that track the Gonka network price</strong>, plus 10M free tokens for new users.'
  },
  {
    q: 'How is GonkaRouter different from OpenRouter?',
    a: `A single per-token rate that tracks the Gonka network — the same for input and output, with no model-by-model price table to worry about. Crypto-native billing on the Gonka Network: no credit card, no subscriptions. New users get 10M free tokens.`
  },
  {
    q: 'How does GonkaRouter pricing work?',
    a: 'GonkaRouter charges a <strong class="text-text-main">single per-token rate that tracks the Gonka network price</strong>, applied equally to both input and output tokens. There are no monthly fees or per-model surcharges — see the Pricing page for the current live rate. New users get 10M free tokens. After that, you top up your balance and are billed only for what you consume.'
  },
  {
    q: 'Which AI models does GonkaRouter support?',
    a: 'GonkaRouter currently supports <strong class="text-text-main">GLM-5.3-Flash</strong>, <strong class="text-text-main">DeepSeek-V4-Flash</strong> and <strong class="text-text-main">MiniMax-M2.7</strong>, with more models being added regularly. All models share the same per-token rate — which tracks the Gonka network — and are accessible through one unified API endpoint.'
  },
  {
    q: 'Is the API compatible with OpenAI SDKs?',
    a: 'Yes. GonkaRouter uses an OpenAI-compatible API format. You can use the official OpenAI Python or TypeScript SDK by simply changing the <code class="inline-code">base_url</code> to <code class="inline-code">https://api.gonkarouter.io/v1</code> and setting your GonkaRouter API key.'
  },
  {
    q: 'Do I need a crypto wallet to use GonkaRouter?',
    a: 'No. Sign in with your email or Google account — no wallet required. A crypto wallet is only needed if you want to top up your balance with USDT (BEP-20) on the Gonka Network. You can also browse the Chat and Models pages as a guest.'
  },
  {
    q: 'How do I get started?',
    a: 'Getting started takes less than a minute: sign in with email or Google on the Dashboard, copy your API key, and replace the <code class="inline-code">base_url</code> in your existing OpenAI SDK calls. New accounts automatically receive 10M free tokens — no payment setup required to start.'
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
const toggleAllFaqs = () => {
  showAllFaqs.value = !showAllFaqs.value
  if (!showAllFaqs.value) homeFaqOpen.value = null
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
// Generated thumbnails for posts without a cover: black field, one tinted glow.
const tagVisual = (glow, bar) => ({
  bgGradient: `radial-gradient(circle at 25% 60%, ${glow}4d 0%, transparent 55%), #050505`,
  glowColor: glow,
  barColor: bar
})
const TAG_VISUAL = {
  Guide: tagVisual('#00FFA3', '#34D399'),
  IDE: tagVisual('#3B82F6', '#60A5FA'),
  Agents: tagVisual('#7C3AED', '#A78BFA'),
  Product: tagVisual('#06B6D4', '#22D3EE'),
  Engineering: tagVisual('#38BDF8', '#7DD3FC')
}
const DEFAULT_VISUAL = tagVisual('#6366F1', '#818CF8')

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

// ─── SEO ──────────────────────────────────────────────────────────────────────
const config = useRuntimeConfig()
const baseUrl = computed(() => `${config.public.apiBase}/v1`)

const siteUrl = config.public.siteUrl || 'https://gonkarouter.io'
// Live rate — tracks the Gonka network.
const { fromPer1M } = useGonkaPricing()
useSeoMeta({
  title: 'AI Model Router on the Gonka Network',
  description: () =>
    `One API for all AI models. OpenAI/Anthropic compatible, from ${fromPer1M.value} per 1M tokens, with 10M free tokens for new users.`,
  ogTitle: 'GonkaRouter — AI Model Router on the Gonka Network',
  ogDescription: () =>
    `One API for all AI models. OpenAI/Anthropic compatible, from ${fromPer1M.value} per 1M tokens.`,
  ogUrl: siteUrl,
  twitterTitle: 'GonkaRouter — AI Model Router on the Gonka Network',
  twitterDescription: () =>
    `One API for all AI models. OpenAI/Anthropic compatible, from ${fromPer1M.value} per 1M tokens.`
})
useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
  meta: [{ name: 'theme-color', content: '#000000' }]
})

const heroDescription = computed(
  () => `One API for all AI models. Developers first. From ${fromPer1M.value} per 1M tokens.`
)

// ─── Content ──────────────────────────────────────────────────────────────────
const whyItems = [
  {
    title: 'Cost-effective pricing',
    icon: LucideZap,
    text: 'One per-token rate that follows the live Gonka network price, the same for input and output. No per-model price table.'
  },
  {
    title: 'Crypto-native payments',
    icon: LucideShield,
    text: 'Top up with USDT and pay only for what you use. No credit card, no subscription.'
  },
  {
    title: 'Global access',
    icon: LucideGlobe,
    text: 'Sign in with email or Google, copy a key, and call one OpenAI- or Anthropic-compatible endpoint from anywhere.'
  },
  {
    title: 'Integration with Web3 ecosystems',
    icon: LucideDatabase,
    text: 'Requests are served by the decentralized Gonka Network, and billing settles on-chain.'
  }
]

const features = [
  { label: '262k context window', icon: LucideZap },
  { label: 'Function calling ready', icon: LucideTerminal },
  { label: 'Private VPC deployment', icon: LucideShield }
]

const featuredModels = [
  {
    id: 'glm',
    label: 'GLM-5.3-Flash',
    apiId: 'zai-org/GLM-5.3-Flash',
    spec: 'Reasoning\nLong context',
    tagline:
      'Optimized GLM-5.3-Flash: A reasoning-capable flash model with a 262k-token window — its hybrid linear-attention design holds long context far more comfortably than a standard transformer on the Gonka pipeline.'
  },
  {
    id: 'deepseek',
    label: 'DeepSeek-V4-Flash',
    apiId: 'deepseek-ai/DeepSeek-V4-Flash-0731',
    spec: 'Low latency\nTool calling',
    tagline:
      'Optimized DeepSeek-V4-Flash: The speed-tuned V4 variant — low-latency general chat, summarisation, and code assistance with reliable tool calling on the Gonka pipeline.'
  },
  {
    id: 'minimax',
    label: 'MiniMax-M2.7',
    apiId: 'MiniMaxAI/MiniMax-M2.7',
    spec: 'Coding\nAgents',
    tagline:
      'Optimized MiniMax-M2.7: A self-evolving agent model built for elite coding and complex agent harnesses — end-to-end software engineering and stable long-chain tool calling on the Gonka pipeline.'
  }
  // 2026-09-05: Kimi-K2.6 removed — it lost every serving node on the Gonka
  // network (0 hosts on-chain as of epoch 383), so the model is uncallable.
  // TEMP 2026-06-25: Qwen3-235B hidden while upstream Gonka takes it offline for
  // adjustment. Restore when it is back online.
  // {
  //   id: 'qwen',
  //   label: 'Qwen3-235B',
  //   apiId: 'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8',
  //   spec: 'Reasoning\nFast TTFT',
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

function openModel(id) {
  featuredModel.value = id
  scrollToModels()
}

onMounted(async () => {
  // Load blog posts from API and enrich with visual metadata
  const { fetchPosts } = useBlogPosts()
  const posts = await fetchPosts()
  allBlogPosts.value = posts.map((p) => ({
    ...p,
    ...(TAG_VISUAL[p.tag] ?? DEFAULT_VISUAL),
    bars: genBars(p.slug)
  }))
})
</script>

<style scoped>
.home {
  --ink: #dddddd;
  background: #000;
  color: var(--ink);
  font-size: var(--text-body);
  line-height: 1.5;
}
.dim {
  color: var(--ink-soft);
}

/* ── Shared atoms ─────────────────────────────────────────────────────────── */
.chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 9px;
  font-size: var(--text-ui);
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--chip-text);
  background: var(--chip);
  border-radius: 2px;
  white-space: nowrap;
}
.chip--on {
  background: #e6e6e6;
  color: #000;
}
.chip--btn {
  padding: 8px 12px;
  transition: background-color var(--duration-fast) ease, color var(--duration-fast) ease;
}
.chip--btn:not(.chip--on):hover {
  background: #2a2a2a;
  color: #fff;
}
.chip--sm {
  padding: 3px 7px;
  font-size: 10px;
}
.tag-head {
  margin-bottom: 0.9em;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary-container);
}
.about-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
  font-size: 13px;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: #555;
  transition: opacity var(--duration-normal) ease, text-decoration-color var(--duration-normal) ease;
}
.about-link:hover {
  opacity: 0.7;
  text-decoration-color: currentColor;
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 2px;
  color: var(--ink);
  transition: border-color var(--duration-fast) ease;
}
.icon-btn:hover:not(:disabled) {
  border-color: var(--ink);
}
.icon-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
:deep(.inline-code) {
  padding: 1px 5px;
  font-size: 12px;
  color: var(--primary-dim);
  background: var(--chip);
  border-radius: 2px;
}
.display-2 {
  font-size: clamp(28px, 1.4rem + 1.6vw, 44px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: #fff;
  text-wrap: balance;
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
}
.hero__ui {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: end;
  gap: 32px;
  min-height: 100svh;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 96px var(--gutter) 56px;
  pointer-events: none;
}
.hero__ui a,
.hero__ui button {
  pointer-events: auto;
}
/* The headline glows into the cloud; the offer column stays solid. */
.hero__title {
  display: flex;
  flex-direction: column;
  font-size: clamp(34px, 0.6rem + 4.4vw, 88px);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.04em;
  color: #fff;
  text-transform: uppercase;
  mix-blend-mode: plus-lighter;
}
.hero__title-dim {
  color: #7a7a7a;
}
.hero__side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
.facts,
.hero__lede {
  text-shadow: 0 0 12px #000, 0 0 2px #000;
}

/* Highlights read as a spec list, not as buttons: no fill, no border, a
   square marker per line, the free-token offer in brand green. */
.facts {
  display: grid;
  gap: 8px;
}
.facts__item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--ink);
}
.facts__item::before {
  content: '';
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  background: var(--ink-soft);
}
.facts__item--key {
  color: var(--primary-container);
  font-weight: 500;
}
.facts__item--key::before {
  background: var(--primary-container);
}
.hero__lede {
  max-width: 40ch;
  font-size: 15px;
  color: var(--ink);
}
.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}
.hero__ghost {
  background: rgb(0 0 0 / 0.4);
}

@media (min-width: 1100px) {
  .hero__ui {
    grid-template-columns: minmax(0, 1fr) minmax(0, 380px);
    align-items: end;
    column-gap: 64px;
  }
  .hero__side {
    justify-self: end;
  }
}
@media (max-width: 767px) {
  /* On a phone the type stack covers the lower half of the poster, so fade
     that half toward black to keep the dim headline line readable. */
  .hero::after {
    content: '';
    position: absolute;
    inset: 40% 0 0;
    z-index: 0;
    background: linear-gradient(to bottom, transparent, rgb(0 0 0 / 0.85) 55%);
    pointer-events: none;
  }
  .hero__ui {
    gap: 24px;
    padding-bottom: 40px;
  }
  .facts__item:nth-child(n + 3) {
    display: none;
  }
}

/* ── At a glance strip ────────────────────────────────────────────────────── */
.glance {
  border-top: 1px solid var(--line);
}
.glance__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 0 var(--gutter);
}
.glance__cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 36px 0;
  border-bottom: 1px solid var(--line);
}
.glance__cell p {
  max-width: 40ch;
  color: var(--ink-soft);
  text-wrap: pretty;
}
.glance__cell .tag-head {
  margin-bottom: 10px;
}
.glance__figure {
  margin-bottom: 6px;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: #fff !important;
}
.glance__figure .dim {
  font-size: 12px;
  letter-spacing: 0;
}
.glance__models {
  width: 100%;
}
.glance__model {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 10px 0;
  text-align: left;
  font-size: 12px;
  border-top: 1px solid var(--line);
}
.glance__models li:first-child .glance__model {
  border-top: 0;
  padding-top: 0;
}
.glance__model-name {
  color: #fff;
  transition: color var(--duration-fast) ease;
}
.glance__model:hover .glance__model-name {
  color: var(--primary-container);
}
.glance__model-spec {
  color: var(--ink-soft);
  text-align: right;
  white-space: pre-line;
  text-transform: uppercase;
  font-size: var(--text-ui);
}
@media (min-width: 768px) {
  .glance__inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 40px;
  }
}
@media (min-width: 1100px) {
  .glance__inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 0.7fr);
    column-gap: 0;
  }
  .glance__cell {
    padding: 44px 32px 48px;
    border-bottom: 0;
    border-left: 1px solid var(--line);
  }
  .glance__cell:first-child {
    padding-left: 0;
    border-left: 0;
  }
}

/* ── Sections ─────────────────────────────────────────────────────────────── */
.sec {
  border-top: 1px solid var(--line);
}
.sec__inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: var(--space-section) var(--gutter) calc(var(--space-section) * 0.8);
}
.sec__split {
  display: grid;
  gap: 40px;
}
.sec__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}
.sec__lede {
  max-width: 40ch;
  color: var(--ink-soft);
}
@media (min-width: 1024px) {
  .sec__split {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 64px;
  }
  .sec__head {
    position: sticky;
    top: 96px;
    align-self: start;
  }
}

/* Why — ruled ledger */
.ledger__row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: 6px 16px;
  padding: 22px 0;
  border-top: 1px solid var(--line);
}
.ledger__row:last-child {
  border-bottom: 1px solid var(--line);
}
.ledger__icon {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  color: var(--primary-container);
}
.ledger__title {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: var(--track-ui);
}
.ledger__text {
  grid-column: 2;
  max-width: 60ch;
  color: var(--ink-soft);
}
@media (min-width: 768px) {
  .ledger__row {
    grid-template-columns: 20px minmax(0, 2fr) minmax(0, 3fr);
  }
  .ledger__text {
    grid-column: 3;
  }
}

/* Models */
.models__top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 40px;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.models__grid {
  display: grid;
  gap: 32px;
}
.models__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
.models__name {
  font-size: clamp(22px, 1rem + 1vw, 30px);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: #fff;
}
.models__tagline {
  max-width: 52ch;
  color: var(--ink-soft);
}
.specs {
  width: 100%;
  margin: 4px 0 8px;
}
.specs__row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: var(--track-ui);
  border-top: 1px solid var(--line);
}
.specs__row:last-child {
  border-bottom: 1px solid var(--line);
}
.code {
  min-width: 0;
  background: #050505;
  border: 1px solid var(--line);
  border-radius: 2px;
}
.code__bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  font-size: var(--text-ui);
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--ink-soft);
  border-bottom: 1px solid var(--line);
}
.code__model {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: none;
}
.code__lang {
  margin-left: auto;
  white-space: nowrap;
}
.code__body {
  padding: 24px 20px;
  overflow-x: auto;
  font-size: clamp(12px, 0.7rem + 0.2vw, 14px);
  line-height: 1.7;
  color: var(--secondary);
  scrollbar-width: thin;
  scrollbar-color: #2a2a2a transparent;
}
.code__caret {
  display: inline-block;
  width: 0.55em;
  height: 1.1em;
  margin-left: 4px;
  vertical-align: middle;
  background: var(--primary-container);
  animation: blink 1.1s steps(2, jump-none) infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
@media (min-width: 1024px) {
  .models__grid {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 64px;
  }
}

/* FAQ */
.faq__item {
  border-top: 1px solid var(--line);
}
.faq__item:last-child {
  border-bottom: 1px solid var(--line);
}
.faq__q {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  padding: 20px 0;
  text-align: left;
  font-size: 14px;
  color: #fff;
  transition: color var(--duration-fast) ease;
}
.faq__q:hover {
  color: var(--primary-container);
}
.faq__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  color: var(--ink-soft);
  transition: transform var(--duration-normal) var(--ease-out-expo), color var(--duration-fast) ease;
}
.is-open .faq__icon {
  transform: rotate(45deg);
  color: var(--primary-container);
}
/* Collapse with grid rows rather than max-height, so no layout property animates. */
.faq__a {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows var(--duration-normal) var(--ease-out-expo), opacity 0.2s ease;
}
.is-open .faq__a {
  grid-template-rows: 1fr;
  opacity: 1;
}
.faq__a-inner {
  min-height: 0;
  overflow: hidden;
}
.faq__a p {
  max-width: 68ch;
  padding-bottom: 22px;
  color: var(--ink-soft);
}
.faq__a :deep(strong) {
  color: #fff;
  font-weight: 500;
}
.faq__more {
  margin-top: 28px;
}

/* Blog */
.blog__top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 40px;
}
.blog__grid {
  display: grid;
  gap: 40px 24px;
}
@media (min-width: 640px) {
  .blog__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .blog__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.post {
  display: block;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
.post__thumb {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: #0a0a0a;
  border-radius: 2px;
}
.post__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-out-expo);
}
.post:hover .post__img {
  transform: scale(1.04);
}
.post__glow {
  position: absolute;
  left: 24px;
  top: 50%;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  filter: blur(24px);
  transform: translateY(-50%);
}
.post__bars {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  padding-bottom: 24px;
}
.post__bars div {
  width: 10px;
  border-radius: 1px;
  opacity: 0.7;
}
.post__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  font-size: var(--text-ui);
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--ink-soft);
}
.post__title {
  display: -webkit-box;
  margin-top: 10px;
  overflow: hidden;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
  color: #fff;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color var(--duration-fast) ease;
}
.post:hover .post__title {
  color: var(--primary-container);
}
.post__excerpt {
  display: -webkit-box;
  margin-top: 8px;
  overflow: hidden;
  color: var(--ink-soft);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 48px;
}
.pager__count {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--ink-soft);
}

/* Close */
.close .sec__inner {
  padding-bottom: var(--space-section);
}
.close__title {
  font-size: clamp(32px, 1rem + 4.4vw, 80px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #fff;
  text-transform: uppercase;
}
.close__code {
  display: inline-block;
  max-width: 100%;
  margin-top: 32px;
  padding: 10px 14px;
  overflow-x: auto;
  font-size: 13px;
  white-space: nowrap;
  color: var(--tertiary);
  background: #050505;
  border: 1px solid var(--line);
  border-radius: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .code__caret {
    animation: none;
  }
}
</style>
