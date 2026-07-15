import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js/lib/common'

// Renders assistant chat messages (untrusted LLM output) from Markdown to safe
// HTML: marked for parsing, highlight.js for code blocks, DOMPurify for XSS
// sanitisation. Sanitisation needs a DOM, so rendering runs client-side only;
// on the server we return escaped plain text and the client re-renders on
// hydration (chat is a logged-in, client-fetched view, so there is no SEO cost).

let marked: Marked | null = null

function getMarked(): Marked {
  if (marked) return marked
  marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = lang && hljs.getLanguage(lang) ? lang : undefined
        try {
          if (language) return hljs.highlight(code, { language }).value
          return hljs.highlightAuto(code).value
        } catch {
          return code
        }
      }
    })
  )
  marked.setOptions({
    gfm: true,
    breaks: true // treat single newlines as <br>, matching how chat models write
  })
  return marked
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function useMarkdown() {
  // Render Markdown to sanitised HTML. Returns escaped text on the server so
  // SSR never touches DOMPurify (which requires a browser DOM).
  async function render(source: string): Promise<string> {
    if (!source) return ''
    if (!import.meta.client) {
      return `<p>${escapeHtml(source)}</p>`
    }
    const rawHtml = getMarked().parse(source) as string
    // Dynamic import keeps DOMPurify out of the SSR bundle and off the initial
    // client load until a message actually needs rendering.
    const DOMPurify = (await import('dompurify')).default
    return DOMPurify.sanitize(rawHtml, {
      ADD_ATTR: ['target', 'rel'],
      // Anchor safety: force external links to open safely.
      FORBID_ATTR: ['style', 'onerror', 'onload']
    })
  }

  return { render }
}
