// Fixed site-wide blog author. The optimization guide asks every post to
// show author identity (name + avatar + bio + social link) both visually and
// in JSON-LD, to raise E-E-A-T / authority signals. We use a single author
// across all posts for now; swap to per-post fields later if needed.
//
// avatar: drop a real headshot at /public/authors/anna-jones.jpg (or .webp)
// and point `avatar` at it. Falls back to the site icon until then.
export interface BlogAuthor {
  name: string
  bio: string
  avatar: string
  linkedin?: string
  twitter?: string
}

export const BLOG_AUTHOR: BlogAuthor = {
  name: 'Anna Jones',
  bio: 'Writing about AI infrastructure, model routing, and developer tooling at GonkaRouter.',
  avatar: '/authors/anna-jones.jpg',
  linkedin: 'https://www.linkedin.com/in/anna-jones-12510041a',
}

// sameAs links for JSON-LD Person — only the ones that are set.
export const authorSameAs = (a: BlogAuthor): string[] =>
  [a.linkedin, a.twitter].filter((u): u is string => !!u)
