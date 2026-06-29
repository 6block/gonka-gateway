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
            <span class="post-date">
              <span class="date-label">{{ isUpdated ? 'Updated' : 'Published' }}</span>
              <time :datetime="isUpdated ? modifiedISO : publishedISO">{{ displayDate }}</time>
            </span>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>
          <p class="post-excerpt">{{ post.excerpt }}</p>

          <!-- Author -->
          <div class="post-author">
            <img class="author-avatar" :src="author.avatar" :alt="author.name" width="40" height="40" />
            <div class="author-meta">
              <a
                v-if="author.linkedin"
                :href="author.linkedin"
                target="_blank"
                rel="author noopener"
                class="author-name"
              >{{ author.name }}</a>
              <span v-else class="author-name">{{ author.name }}</span>
              <span class="author-bio">{{ author.bio }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Article body -->
      <article class="post-body">
        <!-- Table of contents -->
        <nav v-if="toc.length >= 2" class="post-toc" aria-label="Table of contents">
          <p class="toc-title">On this page</p>
          <ul>
            <li v-for="item in toc" :key="item.id" :class="`toc-l${item.level}`">
              <a :href="`#${item.id}`">{{ item.text }}</a>
            </li>
          </ul>
        </nav>

        <div class="prose" v-html="renderedContent" />

        <!-- Author card (footer, reinforces authority) -->
        <div class="author-card">
          <img class="author-card-avatar" :src="author.avatar" :alt="author.name" width="56" height="56" />
          <div class="author-card-body">
            <p class="author-card-name">{{ author.name }}</p>
            <p class="author-card-bio">{{ author.bio }}</p>
            <a
              v-if="author.linkedin"
              :href="author.linkedin"
              target="_blank"
              rel="author noopener"
              class="author-card-link"
            >LinkedIn ↗</a>
          </div>
        </div>

        <!-- Related posts (internal links) -->
        <section v-if="relatedPosts.length" class="related-blogs" aria-label="Related posts">
          <h2 class="related-title">Related posts</h2>
          <div class="related-grid">
            <NuxtLink
              v-for="rp in relatedPosts"
              :key="rp.slug"
              :to="`/blog/${rp.slug}`"
              class="related-card"
            >
              <span class="related-card-tag" :class="tagStyle(rp.tag)">{{ rp.tag }}</span>
              <span class="related-card-title">{{ rp.title }}</span>
              <span class="related-card-excerpt">{{ rp.excerpt }}</span>
            </NuxtLink>
          </div>
        </section>

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
import { BLOG_AUTHOR, authorSameAs } from '~/composables/useBlogAuthor'

definePageMeta({ layout: 'landing' })

// WangEditor 输出 HTML；静态 fallback 是 Markdown。
// 以内容首个非空字符是否为 "<" 来区分。
const isHtml = (s: string) => s.trimStart().startsWith('<')

const route = useRoute()
const slug = route.params.slug as string
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string) || 'https://gonkarouter.io'

const { fetchPost, fetchPosts } = useBlogPosts()
const post = await fetchPost(slug)

// Related posts: same tag, most recent, excluding the current post (max 3).
// Falls back to other recent posts if too few share the tag, so the section
// is never empty on a site with enough content.
const relatedPosts = ref<any[]>([])
if (post) {
  const all = await fetchPosts()
  const others = all.filter((p) => p.slug !== slug)
  const sameTag = others.filter((p) => p.tag && p.tag === post.tag)
  const rest = others.filter((p) => !(p.tag && p.tag === post.tag))
  relatedPosts.value = [...sameTag, ...rest].slice(0, 3)
}

// Date handling per the SEO guide:
//   - Prefer updated_at; fall back to created_at.
//   - Expose published + modified in BOTH meta tags and JSON-LD.
//   - Show a single visible date (the "most relevant" = updated if present).
const publishedISO = computed(() => toISO(post?.created_at) || toISO(post?.date))
const modifiedISO = computed(() => toISO(post?.updated_at) || publishedISO.value)
// "有更新时间取更新时间，没有更新时间才取发布时间"
const displayDate = computed(() => {
  const iso = post?.updated_at || post?.created_at
  return iso ? formatDate(iso) : (post?.date ?? '')
})
const isUpdated = computed(
  () => !!post?.updated_at && !!post?.created_at && !sameDay(post.updated_at, post.created_at),
)

function toISO(v?: string): string {
  if (!v) return ''
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}
function formatDate(v: string): string {
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
function sameDay(a: string, b: string): boolean {
  const da = new Date(a), db = new Date(b)
  return da.toDateString() === db.toDateString()
}

// Clamp the meta description to the 140–160 char sweet spot the guide asks
// for: trim trailing whitespace, cap at 160, cut on a word boundary.
function clampDescription(s: string, max = 160): string {
  const t = (s || '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max - 30 ? cut.slice(0, lastSpace) : cut).trim() + '…'
}
const metaDescription = computed(() => clampDescription(post?.excerpt ?? ''))

if (post) {
  useSeoMeta({
    title: `${post.title} — GonkaRouter Blog`,
    description: metaDescription.value,
    ogTitle: post.title,
    ogDescription: metaDescription.value,
    ogType: 'article',
    ogUrl: `${siteUrl}/blog/${slug}`,
    ogImage: post.cover || `${siteUrl}/og-default.png`,
    twitterTitle: post.title,
    twitterDescription: metaDescription.value,
    twitterImage: post.cover || `${siteUrl}/og-default.png`,
    // article:* time tags — both published and modified, per guide page 2/3.
    articlePublishedTime: publishedISO.value,
    articleModifiedTime: modifiedISO.value,
    articleAuthor: BLOG_AUTHOR.name,
  })
  useHead({
    link: [{ rel: 'canonical', href: `${siteUrl}/blog/${slug}` }],
  })
  useStructuredData([
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: metaDescription.value,
      url: `${siteUrl}/blog/${slug}`,
      datePublished: publishedISO.value,
      dateModified: modifiedISO.value,
      image: post.cover || `${siteUrl}/og-default.png`,
      author: {
        '@type': 'Person',
        name: BLOG_AUTHOR.name,
        description: BLOG_AUTHOR.bio,
        url: BLOG_AUTHOR.linkedin || siteUrl,
        sameAs: authorSameAs(BLOG_AUTHOR),
      },
      publisher: { '@id': `${siteUrl}/#organization` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${slug}` },
    },
    breadcrumbList([
      { name: 'Home', url: `${siteUrl}/` },
      { name: 'Blog', url: `${siteUrl}/blog` },
      { name: post.title, url: `${siteUrl}/blog/${slug}` },
    ]),
  ])
}

const author = BLOG_AUTHOR

// ── Content rendering + table of contents ──────────────────────────────────
// We post-process the rendered HTML to (a) guarantee every <img> has an alt,
// and (b) inject id anchors on H2/H3 so the TOC can link to them.
interface TocItem { id: string; text: string; level: number }
const toc = ref<TocItem[]>([])

function slugifyHeading(text: string, used: Set<string>): string {
  let base = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')
  if (!base) base = 'section'
  let id = base, n = 2
  while (used.has(id)) { id = `${base}-${n++}` }
  used.add(id)
  return id
}

const renderedContent = computed(() => {
  if (!post?.content) return ''
  let html = isHtml(post.content) ? post.content : (marked.parse(post.content) as string)

  // Server-safe DOM parsing isn't available during SSR, so process with
  // regex: this runs identically on server and client and avoids hydration
  // mismatches. Both transforms are idempotent.
  const used = new Set<string>()
  const items: TocItem[] = []

  // 1. Add ids to h2/h3 and collect TOC entries.
  html = html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    if (!text) return full
    // Reuse an existing id if the heading already has one.
    const existing = /\sid=["']([^"']+)["']/i.exec(attrs)
    const id = existing ? existing[1] : slugifyHeading(text, used)
    items.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 })
    if (existing) return full
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`
  })

  // 2. Ensure every <img> has a non-empty alt (fallback = post title).
  const fallbackAlt = (post.title || 'Blog image').replace(/"/g, '&quot;')
  html = html.replace(/<img\b([^>]*)>/gi, (full, attrs) => {
    if (/\salt=["'][^"']*["']/i.test(attrs)) {
      // Has alt but it may be empty → fill empty ones.
      return full.replace(/\salt=["']\s*["']/i, ` alt="${fallbackAlt}"`)
    }
    return `<img${attrs} alt="${fallbackAlt}">`
  })

  toc.value = items
  return html
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

/* Embedded YouTube / Bilibili players. The editor wraps the iframe in
   <div class="embed-wrapper"> with a 16:9 aspect-ratio so the public side
   doesn't depend on host-provided dimensions. */
.prose :deep(.embed-wrapper) {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 1.5rem 0;
  border-radius: 10px;
  overflow: hidden;
  background: #0a0f1a;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.prose :deep(.embed-wrapper iframe) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
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

/* ── Visible date ──────────────────────────────────────────────────────────── */
.date-label {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  font-size: 10px;
  opacity: 0.7;
  margin-right: 6px;
}

/* ── Author (hero) ─────────────────────────────────────────────────────────── */
.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 1.75rem;
}
.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
}
.author-meta { display: flex; flex-direction: column; gap: 1px; }
.author-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-main);
  text-decoration: none;
}
a.author-name:hover { color: var(--color-primary-container); text-decoration: underline; }
.author-bio { font-size: 12px; color: var(--color-text-muted); line-height: 1.4; }

/* ── Table of contents ─────────────────────────────────────────────────────── */
.post-toc {
  margin: 0 0 2.5rem;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
}
.toc-title {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-bottom: 0.625rem;
}
.post-toc ul { list-style: none; margin: 0; padding: 0; }
.post-toc li { margin: 0.3rem 0; }
.post-toc li.toc-l3 { padding-left: 1rem; }
.post-toc a {
  font-size: 13.5px;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s;
}
.post-toc a:hover { color: var(--color-primary-container); }
.prose :deep(h2),
.prose :deep(h3) { scroll-margin-top: 90px; }
/* ── Author card (footer) ──────────────────────────────────────────────────── */
.author-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-top: 3.5rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}
.author-card-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
}
.author-card-name { font-size: 15px; font-weight: 800; color: var(--color-text-main); margin-bottom: 2px; }
.author-card-bio { font-size: 13px; color: var(--color-text-muted); line-height: 1.55; margin-bottom: 6px; }
.author-card-link {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--color-primary-container);
  text-decoration: none;
}
.author-card-link:hover { text-decoration: underline; }

/* ── Related blogs ─────────────────────────────────────────────────────────── */
.related-blogs {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.related-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--color-text-main);
  margin-bottom: 1.25rem;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.related-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 1rem 1.125rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  text-decoration: none;
  transition: border-color 0.15s, transform 0.15s;
}
.related-card:hover {
  border-color: rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}
.related-card-tag {
  align-self: flex-start;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid;
}
.related-card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-main);
  line-height: 1.35;
}
.related-card-excerpt {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
