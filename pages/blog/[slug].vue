<template>
  <div class="blog-post-page animate-fade-in">
    <!-- 404 state -->
    <div v-if="!post" class="max-w-2xl mx-auto px-6 py-32 text-center">
      <p class="text-5xl font-black mb-4">404</p>
      <h1 class="text-2xl font-black font-headline text-text-main mb-3">Post not found</h1>
      <p class="text-text-muted mb-8">This article may have been moved or deleted.</p>
      <NuxtLink to="/blog" class="text-primary-container hover:underline font-semibold">← Back to Blog</NuxtLink>
    </div>

    <template v-else>
      <!-- Hero -->
      <div class="post-hero">
        <div class="post-hero-inner">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 text-primary-container text-[11px] font-black uppercase tracking-widest hover:opacity-75 transition-opacity mb-7"
          >
            <LucideArrowLeft class="w-3.5 h-3.5" />
            Back to Blog
          </NuxtLink>

          <div class="post-meta">
            <span class="post-tag" :class="tagStyle(post.tag)">{{ post.tag }}</span>
            <span class="post-date">{{ post.date }}</span>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>
          <p class="post-excerpt">{{ post.excerpt }}</p>
        </div>
      </div>

      <!-- Article body -->
      <article class="post-body">
        <div class="prose" v-html="renderedContent" />

        <!-- Footer nav -->
        <div class="post-foot">
          <NuxtLink to="/blog" class="back-link">← Back to all posts</NuxtLink>
        </div>
      </article>
    </template>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { LucideArrowLeft } from 'lucide-vue-next'

definePageMeta({ layout: 'landing' })

// WangEditor 输出 HTML；静态 fallback 是 Markdown。
// 以内容首个非空字符是否为 "<" 来区分。
const isHtml = (s: string) => s.trimStart().startsWith('<')

const route = useRoute()
const slug = route.params.slug as string
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string) || 'https://gonkarouter.io'

const { fetchPost } = useBlogPosts()
const post = await fetchPost(slug)

if (post) {
  useSeoMeta({
    title: `${post.title} — GonkaRouter Blog`,
    description: post.excerpt,
    ogTitle: post.title,
    ogDescription: post.excerpt,
    ogUrl: `${siteUrl}/blog/${slug}`,
    ogImage: post.cover || `${siteUrl}/og-default.png`,
    twitterTitle: post.title,
    twitterDescription: post.excerpt,
    twitterImage: post.cover || `${siteUrl}/og-default.png`,
  })
  useHead({
    link: [{ rel: 'canonical', href: `${siteUrl}/blog/${slug}` }],
  })
  useStructuredData([
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${slug}`,
      datePublished: post.created_at ?? post.date,
      dateModified: post.updated_at ?? post.created_at ?? post.date,
      image: post.cover || `${siteUrl}/og-default.png`,
      author: {
        '@type': 'Organization',
        name: 'GonkaRouter',
        url: siteUrl,
      },
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    breadcrumbList([
      { name: 'Home', url: `${siteUrl}/` },
      { name: 'Blog', url: `${siteUrl}/blog` },
      { name: post.title, url: `${siteUrl}/blog/${slug}` },
    ]),
  ])
}

const renderedContent = computed(() => {
  if (!post?.content) return ''
  return isHtml(post.content) ? post.content : marked.parse(post.content) as string
})

const tagStyle = (tag: string) => {
  const map: Record<string, string> = {
    Product: 'tag-product',
    Engineering: 'tag-engineering',
    Guide: 'tag-guide',
    IDE: 'tag-ide',
    Agents: 'tag-agents',
  }
  return map[tag] ?? 'tag-default'
}
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────────────────── */
.blog-post-page {
  min-height: 100vh;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.post-hero {
  padding: clamp(4rem, 8vw, 7rem) 0 clamp(3rem, 5vw, 5rem);
  background:
    radial-gradient(ellipse 70% 50% at 50% -10%, rgba(99, 102, 241, 0.12), transparent 70%),
    radial-gradient(ellipse 40% 30% at 80% 100%, rgba(6, 182, 212, 0.06), transparent 60%);
}

.post-hero-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color 0.15s;
  margin-bottom: 1.75rem;
}
.back-link:hover { color: var(--color-primary-container); }

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.post-tag {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid;
}
.tag-guide     { color: #34d399; border-color: rgba(52,211,153,.3); background: rgba(52,211,153,.08); }
.tag-ide       { color: #60a5fa; border-color: rgba(96,165,250,.3); background: rgba(96,165,250,.08); }
.tag-agents    { color: #a78bfa; border-color: rgba(167,139,250,.3); background: rgba(167,139,250,.08); }
.tag-product   { color: #7c3aed; border-color: rgba(124,58,237,.3); background: rgba(124,58,237,.08); }
.tag-engineering { color: #38bdf8; border-color: rgba(56,189,248,.3); background: rgba(56,189,248,.08); }
.tag-default   { color: var(--color-text-muted); border-color: rgba(255,255,255,.1); background: transparent; }

.post-date {
  font-size: 11px;
  color: var(--color-text-muted);
}

.post-title {
  font-size: clamp(1.875rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--color-text-main);
  margin-bottom: 1.25rem;
}

.post-excerpt {
  font-size: 1.0625rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 640px;
}

/* ── Body ────────────────────────────────────────────────────────────────── */
.post-body {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 1.5rem clamp(5rem, 10vw, 8rem);
}

.post-foot {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* ── Prose (Markdown + WangEditor HTML) ──────────────────────────────────── */
.prose {
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

/* WangEditor 输出带内联样式的 <span>，不能被 prose 全局色覆盖。
   用 all:revert 让浏览器优先走 element 的 style 属性。 */
.prose :deep(span[style]) { all: revert; }

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-text-main);
  line-height: 1.25;
}

.prose :deep(h1) { font-size: 1.875rem; margin: 2.5rem 0 1.125rem; }
.prose :deep(h2) { font-size: 1.375rem; margin: 2.25rem 0 0.875rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
.prose :deep(h3) { font-size: 1.125rem; margin: 1.75rem 0 0.625rem; }

.prose :deep(p) { margin: 1rem 0; }

.prose :deep(a) {
  color: #7c3aed;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: color 0.15s;
}
.prose :deep(a:hover) { color: #a78bfa; }

.prose :deep(strong) { color: var(--color-text-main); font-weight: 700; }
.prose :deep(em) { font-style: italic; }

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.5rem;
  margin: 1rem 0;
}
.prose :deep(ul) { list-style: disc; }
.prose :deep(ol) { list-style: decimal; }
.prose :deep(li) { margin: 0.35rem 0; }

.prose :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85em;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 6px;
  color: #e2e8f0;
}

.prose :deep(pre) {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}
.prose :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  color: #e2e8f0;
  line-height: 1.7;
}

.prose :deep(blockquote) {
  border-left: 3px solid #7c3aed;
  padding: 0.5rem 0 0.5rem 1.25rem;
  margin: 1.5rem 0;
  color: var(--color-text-muted);
  font-style: italic;
}

.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.9rem;
}
.prose :deep(th),
.prose :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.6rem 1rem;
  text-align: left;
}
.prose :deep(th) {
  background: rgba(255, 255, 255, 0.04);
  font-weight: 700;
  color: var(--color-text-main);
}
.prose :deep(tr:hover td) {
  background: rgba(255, 255, 255, 0.02);
}

.prose :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 2rem 0;
}

.prose :deep(img) {
  max-width: 100%;
  border-radius: 10px;
  margin: 1.5rem 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Figures — preserved when the editor allows them through.
   Our paste normalizer flattens external <figure> to <img> + .image-caption
   so this rule is mainly a safety net for content authored elsewhere. */
.prose :deep(figure) {
  margin: 1.5rem 0;
  text-align: center;
}
.prose :deep(figure img) {
  margin: 0 auto;
  display: block;
}
.prose :deep(figcaption),
.prose :deep(.image-caption) {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-style: italic;
  text-align: center;
  line-height: 1.5;
}
</style>
