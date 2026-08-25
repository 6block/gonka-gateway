export interface BlogPost {
  id?: number
  slug: string
  title: string
  excerpt: string
  content?: string
  cover?: string
  tag: string
  status?: string
  date: string
  created_at?: string
  updated_at?: string
}

export interface BlogPostsPage {
  items: BlogPost[]
  total: number
  page: number
  pageSize: number
}

const formatDate = (p: BlogPost): BlogPost => ({
  ...p,
  date: p.created_at
    ? new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : p.date ?? '',
})

export const useBlogPosts = () => {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string | undefined)?.replace(/\/$/, '') ?? ''

  const fetchPosts = async (): Promise<BlogPost[]> => {
    if (!apiBase) return []
    try {
      const data = await $fetch<{ items: BlogPost[] } | BlogPost[]>(`${apiBase}/api/posts`, {
        params: { status: 'published' },
        timeout: 5000,
      })
      const items = Array.isArray(data) ? data : (data as { items: BlogPost[] }).items ?? []
      return items.map(formatDate)
    } catch {
      return []
    }
  }

  // Paginated variant for the blog index. Returns items plus total so the page
  // can render a pager. Fails soft to an empty page.
  const fetchPostsPaged = async (page: number, pageSize: number): Promise<BlogPostsPage> => {
    const empty: BlogPostsPage = { items: [], total: 0, page, pageSize }
    if (!apiBase) return empty
    try {
      const data = await $fetch<{ items: BlogPost[]; total: number; page: number; page_size: number }>(
        `${apiBase}/api/posts`,
        { params: { status: 'published', page, page_size: pageSize }, timeout: 5000 },
      )
      return {
        items: (data.items ?? []).map(formatDate),
        total: data.total ?? 0,
        page: data.page ?? page,
        pageSize: data.page_size ?? pageSize,
      }
    } catch {
      return empty
    }
  }

  const fetchPost = async (slug: string): Promise<BlogPost | null> => {
    if (!apiBase) return null
    try {
      const data = await $fetch<BlogPost>(`${apiBase}/api/posts/${slug}`, { timeout: 5000 })
      return {
        ...data,
        date: data.created_at
          ? new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : data.date ?? '',
      }
    } catch {
      return null
    }
  }

  return { fetchPosts, fetchPostsPaged, fetchPost }
}
