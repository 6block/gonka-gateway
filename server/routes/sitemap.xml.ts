import { defineEventHandler, setHeader } from 'h3'

interface SitemapEntry {
  loc: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: string
  lastmod: string
}

// lastmod reflects the real last content update per page (YYYY-MM-DD).
// Bump the relevant date when a page's content meaningfully changes —
// do NOT use a per-request timestamp, which signals constant churn to crawlers.
const PUBLIC_ROUTES: ReadonlyArray<Omit<SitemapEntry, 'loc'> & { path: string }> = [
  { path: '/', changefreq: 'weekly', priority: '1.0', lastmod: '2026-06-01' },
  { path: '/chat', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-01' },
  { path: '/docs', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-01' },
  { path: '/models', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-01' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3', lastmod: '2026-05-22' },
  { path: '/terms-of-service', changefreq: 'yearly', priority: '0.3', lastmod: '2026-05-22' }
]

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

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl as string | undefined)?.replace(/\/$/, '') ||
    'https://gonkarouter.io'

  const urls = PUBLIC_ROUTES.map((route) => {
    const loc = escapeXml(`${siteUrl}${route.path}`)
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${route.lastmod}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return xml
})
