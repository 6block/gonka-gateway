<template>
  <div class="max-w-4xl mx-auto px-6 sm:px-8 py-24 sm:py-32 animate-fade-in">
    <!-- Header -->
    <div class="mb-14 sm:mb-16">
      <p class="text-[11px] font-black uppercase tracking-widest text-primary-container mb-4">
        Blog
      </p>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-headline tracking-tighter text-text-main leading-[1.05] mb-6">
        News &amp; Updates
      </h1>
      <p class="text-text-muted text-base sm:text-lg font-body leading-relaxed max-w-xl">
        Product updates, engineering deep-dives, and guides from the GonkaRouter team.
      </p>
    </div>

    <!-- Post list -->
    <div class="space-y-6">
      <NuxtLink
        v-for="post in posts"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        class="group block bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-primary-container/30 transition-all"
      >
        <div class="flex flex-col sm:flex-row sm:items-center gap-5">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-3 flex-wrap">
              <span
                class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border"
                :class="tagStyle(post.tag)"
              >
                {{ post.tag }}
              </span>
              <span class="text-[11px] text-text-muted font-body">{{ post.date }}</span>
            </div>
            <h2 class="text-lg sm:text-xl font-black font-headline tracking-tight text-text-main group-hover:text-primary-container transition-colors mb-2">
              {{ post.title }}
            </h2>
            <p class="text-text-muted text-sm font-body leading-relaxed line-clamp-2">
              {{ post.excerpt }}
            </p>
          </div>
          <!-- Cover thumbnail (when present), otherwise an arrow affordance -->
          <div
            v-if="post.cover"
            class="shrink-0 w-full sm:w-44 h-40 sm:h-28 rounded-xl overflow-hidden border border-white/5 bg-surface-container-high"
          >
            <img
              :src="post.cover"
              :alt="post.title"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div v-else class="shrink-0 self-center sm:self-start mt-2 sm:mt-1">
            <span class="text-text-muted group-hover:text-primary-container transition-colors text-xl font-black">→</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Pagination -->
    <nav
      v-if="totalPages > 1"
      class="mt-12 flex items-center justify-center gap-2 flex-wrap"
      aria-label="Blog pagination"
    >
      <NuxtLink
        v-if="currentPage > 1"
        :to="pageLink(currentPage - 1)"
        rel="prev"
        class="px-3 py-2 rounded-lg text-sm font-headline font-bold text-text-muted hover:text-text-main hover:bg-white/5 border border-white/10 transition-all"
        aria-label="Previous page"
      >
        ← Prev
      </NuxtLink>

      <template v-for="(item, i) in pageItems" :key="`${item}-${i}`">
        <span v-if="item === '…'" class="px-2 text-text-muted select-none">…</span>
        <NuxtLink
          v-else
          :to="pageLink(item)"
          class="min-w-[38px] text-center px-3 py-2 rounded-lg text-sm font-headline font-bold border transition-all"
          :class="item === currentPage
            ? 'bg-primary-container/15 text-primary-container border-primary-container/30'
            : 'text-text-muted hover:text-text-main hover:bg-white/5 border-white/10'"
          :aria-current="item === currentPage ? 'page' : undefined"
        >
          {{ item }}
        </NuxtLink>
      </template>

      <NuxtLink
        v-if="currentPage < totalPages"
        :to="pageLink(currentPage + 1)"
        rel="next"
        class="px-3 py-2 rounded-lg text-sm font-headline font-bold text-text-muted hover:text-text-main hover:bg-white/5 border border-white/10 transition-all"
        aria-label="Next page"
      >
        Next →
      </NuxtLink>
    </nav>

    <!-- Empty state (shown when posts array is empty) -->
    <div v-if="posts.length === 0" class="text-center py-24">
      <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-surface-container-high border border-white/5 flex items-center justify-center">
        <LucideRss class="w-7 h-7 text-text-muted" />
      </div>
      <h2 class="text-xl font-black font-headline text-text-main mb-3">Coming soon</h2>
      <p class="text-text-muted text-sm max-w-xs mx-auto font-body leading-relaxed">
        We're working on our first posts. Follow us on
        <a href="https://x.com/gonka_cn" target="_blank" rel="noreferrer" class="text-primary-container hover:underline">X</a>
        for updates.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LucideRss } from 'lucide-vue-next'

definePageMeta({ layout: 'landing' })

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string) || 'https://gonkarouter.io'

const route = useRoute()
const PAGE_SIZE = 12

// Current page comes from ?page=N (1-based). Clamped to >= 1.
const currentPage = computed(() => {
  const p = parseInt(String(route.query.page ?? '1'), 10)
  return Number.isFinite(p) && p > 0 ? p : 1
})

const { fetchPostsPaged } = useBlogPosts()

// Refetch whenever the page query changes; useAsyncData keeps SSR + client in
// sync and caches per page key.
const { data: pageData } = await useAsyncData(
  () => `blog-list-${currentPage.value}`,
  () => fetchPostsPaged(currentPage.value, PAGE_SIZE),
  { watch: [currentPage] },
)

const posts = computed(() => pageData.value?.items ?? [])
const total = computed(() => pageData.value?.total ?? 0)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

// Compact page number list with ellipses, e.g. 1 … 4 5 [6] 7 8 … 12
const pageItems = computed<(number | '…')[]>(() => {
  const tp = totalPages.value
  const cur = currentPage.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const out: (number | '…')[] = [1]
  const start = Math.max(2, cur - 1)
  const end = Math.min(tp - 1, cur + 1)
  if (start > 2) out.push('…')
  for (let i = start; i <= end; i++) out.push(i)
  if (end < tp - 1) out.push('…')
  out.push(tp)
  return out
})

const pageLink = (p: number) => (p <= 1 ? '/blog' : `/blog?page=${p}`)

useSeoMeta({
  title: 'Blog — News & Updates',
  description:
    'Product updates, engineering deep-dives, and guides from the GonkaRouter team. Learn about AI model routing, the Gonka Network, and developer best practices.',
  ogTitle: 'Blog | GonkaRouter',
  ogDescription:
    'Product updates and engineering guides from the GonkaRouter team.',
  ogUrl: `${siteUrl}/blog`,
  twitterTitle: 'Blog | GonkaRouter',
  twitterDescription: 'Product updates and engineering guides from the GonkaRouter team.'
})
// Canonical points at the current page; add prev/next hints for crawlers.
useHead(() => {
  const links: { rel: string; href: string }[] = [
    { rel: 'canonical', href: currentPage.value <= 1 ? `${siteUrl}/blog` : `${siteUrl}/blog?page=${currentPage.value}` },
  ]
  if (currentPage.value > 1) {
    links.push({ rel: 'prev', href: currentPage.value - 1 <= 1 ? `${siteUrl}/blog` : `${siteUrl}/blog?page=${currentPage.value - 1}` })
  }
  if (currentPage.value < totalPages.value) {
    links.push({ rel: 'next', href: `${siteUrl}/blog?page=${currentPage.value + 1}` })
  }
  return { link: links }
})

useStructuredData([
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'GonkaRouter Blog',
    description: 'Product updates, engineering deep-dives, and guides from the GonkaRouter team.',
    url: `${siteUrl}/blog`,
    publisher: { '@id': `${siteUrl}/#organization` }
  },
  breadcrumbList([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Blog', url: `${siteUrl}/blog` }
  ])
])

const tagStyle = (tag: string) => {
  const map: Record<string, string> = {
    Product: 'bg-primary-container/10 text-primary-container border-primary-container/20',
    Engineering: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Guide: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    IDE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Agents: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
  }
  return map[tag] ?? 'bg-surface-container-highest text-text-muted border-white/10'
}
</script>
