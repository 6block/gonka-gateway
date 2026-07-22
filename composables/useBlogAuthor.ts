// Fixed site-wide blog author. The optimization guide asks every post to
// show author identity (name + avatar + bio + social link) both visually and
// in JSON-LD, to raise E-E-A-T / authority signals. We use a single author
// across all posts for now; swap to per-post fields later if needed.
//
// avatar: drop a real headshot at /public/authors/carol-gao.jpg (or .webp)
// and point `avatar` at it. The blog page currently renders the author as a
// text link (no avatar), so this is only used if an avatar is reintroduced.
export interface BlogAuthor {
  name: string
  bio: string
  avatar: string
  linkedin?: string
  twitter?: string
}

export const BLOG_AUTHOR: BlogAuthor = {
  name: 'Carol Gao',
  bio: 'Writing about AI infrastructure, model routing, and developer tooling at GonkaRouter.',
  avatar: '/authors/carol-gao.jpg',
  linkedin: 'https://www.linkedin.com/in/carol-gao-71b158422/overlay/contact-info/',
}

// sameAs links for JSON-LD Person — only the ones that are set.
export const authorSameAs = (a: BlogAuthor): string[] =>
  [a.linkedin, a.twitter].filter((u): u is string => !!u)
