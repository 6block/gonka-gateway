import { defineEventHandler, setHeader } from 'h3'

interface SitemapEntry {
  loc: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: string
  lastmod: string
}

// Static, hand-maintained pages. Blog POSTS are appended dynamically from the
// backend (see below) so the sitemap never lists articles that don't exist in
// the DB — stale hardcoded blog slugs previously produced soft-404s that hurt
// crawling. lastmod reflects the real last content update per page (YYYY-MM-DD);
// bump it when a page meaningfully changes rather than using a per-request
// timestamp, which signals constant churn to crawlers.
const PUBLIC_ROUTES: ReadonlyArray<Omit<SitemapEntry, 'loc'> & { path: string }> = [
  { path: '/', changefreq: 'weekly', priority: '1.0', lastmod: '2026-06-05' },
  { path: '/pricing', changefreq: 'monthly', priority: '0.9', lastmod: '2026-06-05' },
  { path: '/docs', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-01' },
  { path: '/models', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-01' },
  { path: '/feedback', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-05' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-09' },
  { path: '/chat', changefreq: 'weekly', priority: '0.7', lastmod: '2026-06-01' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3', lastmod: '2026-05-22' },
  { path: '/terms-of-service', changefreq: 'yearly', priority: '0.3', lastmod: '2026-05-22' }
]

interface ApiPost {
  slug: string
  updated_at?: string
  created_at?: string
}

const toYMD = (iso?: string): string => {
  if (!iso) return new Date().toISOString().slice(0, 10)
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10)
}

// Fetch published posts from the backend so the sitemap always mirrors the DB.
// Fails soft: on any error we return an empty list and still emit the static
// routes, so the sitemap endpoint never 500s.
const fetchBlogEntries = async (apiBase: string): Promise<Array<Omit<SitemapEntry, 'loc'> & { path: string }>> => {
  if (!apiBase) return []
  try {
    const data = await $fetch<{ items?: ApiPost[] } | ApiPost[]>(`${apiBase}/api/posts`, {
      params: { status: 'published', page_size: 50 },
      timeout: 4000,
    })
    const items = Array.isArray(data) ? data : data.items ?? []
    return items.map((p) => ({
      path: `/blog/${p.slug}`,
      changefreq: 'monthly' as const,
      priority: '0.7',
      lastmod: toYMD(p.updated_at ?? p.created_at),
    }))
  } catch {
    return []
  }
}

const escapeXml = (value: string): string =>
  value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return char
    }
  })

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl as string | undefined)?.replace(/\/$/, '') ||
    'https://gonkarouter.io'
  const apiBase = (config.public.apiBase as string | undefined)?.replace(/\/$/, '') || ''

  const blogEntries = await fetchBlogEntries(apiBase)
  const allRoutes = [...PUBLIC_ROUTES, ...blogEntries]

  const urls = allRoutes.map((route) => {
    const loc = escapeXml(`${siteUrl}${route.path}`)
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${route.lastmod}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return xml
})
