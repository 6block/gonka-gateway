<template>
  <div class="dark home-page">
    <!-- 首页固定暗色：背景是暗色视频，浅色模式下文字会看不清 -->
    <!-- Hero：眼睛滚动推进，背景固定在整页后面 -->
    <HeroEyeScrollHero id="hero" eye-end-anchor="features">
      <div class="flex flex-wrap items-center justify-center gap-2 mb-6">
        <span class="inline-flex items-center gap-2 bg-black/50 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full">
          <span class="flex h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse"></span>
          <span class="font-label text-[11px] tracking-widest uppercase text-text-muted font-bold">Now supporting GLM-5.3-Flash</span>
        </span>
        <span class="inline-flex items-center gap-1.5 bg-primary-container/10 border border-primary-container/30 backdrop-blur-md px-3.5 py-1.5 rounded-full">
          <LucideZap class="w-3.5 h-3.5 text-primary-container" />
          <span class="font-label text-[11px] tracking-widest uppercase text-primary-container font-bold">1M free tokens for new users</span>
        </span>
      </div>

      <h1
        id="eye-hero-heading"
        class="font-headline text-[2.5rem] leading-[1.02] sm:text-6xl lg:text-7xl font-black tracking-tighter mb-5"
      >
        <span class="text-text-main">AI Model Router</span><br />
        <span class="bg-gradient-to-r from-primary-dim to-primary bg-clip-text text-transparent">on the Gonka Network</span>
      </h1>

      <p class="font-body text-text-muted text-base sm:text-lg leading-relaxed font-light mb-8">
        {{ heroDescription }}
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-3">
        <NuxtLink
          to="/dashboard"
          class="w-full sm:w-auto text-center kinetic-gradient text-primary-on px-8 py-3.5 rounded-full font-headline font-black text-base transition-all hover:-translate-y-0.5 active:scale-95 hover:shadow-glow-emerald-lg"
        >
          Get API Keys
        </NuxtLink>
        <button
          @click="scrollToModels"
          class="w-full sm:w-auto bg-black/50 backdrop-blur-md text-text-main border border-white/15 px-8 py-3.5 rounded-full font-headline font-bold text-base hover:bg-white/10 transition-all hover:-translate-y-0.5"
        >
          Explore Models
        </button>
      </div>

      <!-- 每项不拆行，窄屏时整项换行，避免 "No subscription" 被拆成两行 -->
      <ul class="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1.5 font-label text-[11px] tracking-widest uppercase text-text-muted">
        <li class="whitespace-nowrap">OpenAI compatible</li>
        <li class="whitespace-nowrap">Anthropic compatible</li>
        <li class="whitespace-nowrap">No subscription</li>
      </ul>

    </HeroEyeScrollHero>

    <!-- Featured Model -->
    <section
      id="models"
      class="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-surface relative overflow-hidden"
    >
      <div class="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-14 items-center">
        <div v-reveal>
          <p class="font-label text-xs tracking-widest uppercase text-primary-container font-bold mb-4">[ 01 / Models ]</p>
          <div
            class="inline-flex flex-wrap bg-black/50 p-1 rounded-2xl sm:rounded-full border border-white/10 mb-6"
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
              class="px-4 py-2 rounded-full text-xs font-black tracking-tight transition-all"
              :class="
                featuredModel === model.id
                  ? 'bg-primary-container text-primary-on shadow-lg shadow-primary-container/20'
                  : 'text-text-muted hover:text-text-main'
              "
            >
              {{ model.label }}
            </button>
          </div>

          <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-text-main mb-5 tracking-tight">
            {{ activeFeatured.label }}
          </h2>
          <p class="font-body text-text-muted text-base sm:text-lg mb-8 font-light leading-relaxed">
            {{ activeFeatured.tagline }}
          </p>

          <ul class="flex flex-wrap gap-2 mb-8">
            <li
              v-for="feature in features"
              :key="feature.label"
              class="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/10"
            >
              <component :is="feature.icon" class="w-4 h-4 text-primary-container" />
              <span class="font-label text-xs font-bold text-text-main tracking-wide">{{ feature.label }}</span>
            </li>
          </ul>

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/dashboard"
              class="kinetic-gradient text-primary-on px-7 py-3.5 rounded-full font-headline font-black text-base transition-all active:scale-95 hover:shadow-glow-emerald-lg hover:-translate-y-0.5"
            >
              Get API Keys
            </NuxtLink>
            <NuxtLink
              to="/models"
              class="bg-black/50 text-text-main ghost-border px-7 py-3.5 rounded-full font-headline font-bold text-base transition-all hover:bg-white/10 hover:-translate-y-0.5"
            >
              All models
            </NuxtLink>
          </div>
        </div>

          <!-- Code preview -->
          <div
            v-reveal="150"
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
      </div>
    </section>

    <HomeTopupPromo />
    <HomeWhy />
    <HomeFaq />

    <!-- Blog Section — only shown when API returns posts -->
    <section v-if="allBlogPosts.length > 0" class="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-surface relative overflow-hidden">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div v-reveal class="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <p class="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-text-muted mb-2 sm:mb-3">
              [ 05 / Blog ]
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
            v-for="(post, i) in displayedBlogPosts"
            :key="post.slug"
            v-reveal="i * 100"
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

    <HomeFinalCta />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { LucideZap, LucideShield, LucideTerminal } from 'lucide-vue-next'

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
// Live rate — tracks the Gonka network.
const { fromPer1M } = useGonkaPricing()
useSeoMeta({
  title: 'AI Model Router on the Gonka Network',
  description: () =>
    `One API for all AI models. OpenAI/Anthropic compatible, from ${fromPer1M.value} per 1M tokens, with 1M free tokens for new users.`,
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
  bodyAttrs: { class: 'home-eye-active' }
})

const heroDescription = computed(
  () => `One API for all AI models, built for developers. From ${fromPer1M.value} per 1M tokens.`
)


const features = [
  { label: '262k Context Window', icon: LucideZap },
  { label: 'Function Calling Ready', icon: LucideTerminal },
  { label: 'Private VPC Deployment', icon: LucideShield }
]

const featuredModels = [
  {
    id: 'glm',
    label: 'GLM-5.3-Flash',
    apiId: 'zai-org/GLM-5.3-Flash',
    tagline:
      'Optimized GLM-5.3-Flash: A reasoning-capable flash model with a 1M-token window — its hybrid linear-attention design holds long context far more comfortably than a standard transformer on the Gonka pipeline.'
  },
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
  }
  // 2026-09-05: Kimi-K2.6 removed — it lost every serving node on the Gonka
  // network (0 hosts on-chain as of epoch 383), so the model is uncallable.
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

onMounted(async () => {
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
/* 区块盖在固定背景层（z-index 0）之上；底色改透明让背景透出，卡片改半透明保证可读 */
.home-page > section {
  position: relative;
  z-index: 1;
}
.home-page section.bg-surface {
  background-color: transparent;
}
.home-page .bg-surface-container-high {
  background-color: rgb(var(--surface-container-high-rgb) / 0.55);
}
.home-page .bg-surface-container-lowest {
  background-color: rgb(var(--surface-container-lowest-rgb) / 0.7);
}
</style>

<style>
/* layout 的 footer 不在本页组件内，需要全局样式把它抬到背景层之上 */
body.home-eye-active footer {
  position: relative;
  z-index: 1;
}
</style>
