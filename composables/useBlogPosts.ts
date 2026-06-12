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
      return items.map((p) => ({
        ...p,
        date: p.created_at
          ? new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : p.date ?? '',
      }))
    } catch {
      return []
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

  return { fetchPosts, fetchPost }
}
