import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import markedKatex from 'marked-katex-extension'
import hljs from 'highlight.js/lib/common'

// Renders assistant chat messages (untrusted LLM output) from Markdown to safe
// HTML: marked for parsing, highlight.js for code blocks, KaTeX for $…$ / $$…$$
// math, DOMPurify for XSS sanitisation. Sanitisation needs a DOM, so rendering
// runs client-side only; on the server we return escaped plain text and the
// client re-renders on hydration (chat is a logged-in, client-fetched view, so
// there is no SEO cost).

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
  // KaTeX: render $…$ inline and $$…$$ block math. throwOnError:false so a
  // malformed expression from the model degrades to visible source instead of
  // breaking the whole message.
  marked.use(
    markedKatex({
      throwOnError: false,
      nonStandard: true // also accept $…$ without the strict spacing rules
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
    // KaTeX emits MathML plus positioned <span>s that rely on inline `style`,
    // so we keep `style` (DOMPurify parses and sanitises CSS values — it strips
    // js/behaviour, so this is safe) and enable the MathML profile. Event-handler
    // attributes are still dropped by DOMPurify's defaults.
    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true, mathMl: true },
      ADD_ATTR: ['target', 'rel']
    })
  }

  return { render }
}
