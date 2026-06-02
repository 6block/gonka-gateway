// Inject page-level JSON-LD structured data.
//
// Global Organization / WebSite / SoftwareApplication graph lives in app.vue.
// This composable adds PAGE-SPECIFIC schema (ItemList, TechArticle, FAQPage,
// BreadcrumbList, …). Only attach schema that is backed by content actually
// visible on the page — unsupported schema risks a manual spam action.

type JsonLdNode = Record<string, unknown>

/**
 * Serialize one or more JSON-LD nodes into <script type="application/ld+json">
 * tags. Each node is keyed by its @type so Nuxt dedupes correctly on navigation.
 */
export const useStructuredData = (data: JsonLdNode | JsonLdNode[]): void => {
  const nodes = Array.isArray(data) ? data : [data]

  useHead({
    script: nodes.map((node, index) => ({
      type: 'application/ld+json',
      key: `ld-${(node['@type'] as string | undefined) ?? index}`,
      innerHTML: JSON.stringify(node)
    }))
  })
}

interface BreadcrumbItem {
  name: string
  url: string
}

/** Build a BreadcrumbList node from an ordered list of crumbs. */
export const breadcrumbList = (items: ReadonlyArray<BreadcrumbItem>): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})
