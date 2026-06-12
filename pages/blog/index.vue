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

const { fetchPosts } = useBlogPosts()
const posts = await fetchPosts()

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
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/blog` }] })

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
