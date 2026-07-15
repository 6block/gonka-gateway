<template>
  <div
    class="markdown-body font-body max-w-full"
    @click="onClick"
    v-html="html"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMarkdown } from '~/composables/useMarkdown'
import { useToast } from '~/composables/useToast'

const props = defineProps<{ content: string }>()

const { render } = useMarkdown()
const toast = useToast()
const html = ref('')

// Wrap each highlighted <pre> block with a header (language label + copy
// button), GPT-style. Injected after sanitisation on trusted static markup;
// the code content itself already passed through DOMPurify.
function decorateCodeBlocks(raw: string): string {
  return raw.replace(
    /<pre><code class="hljs(?: language-(\w+))?"([^>]*)>/g,
    (_full, lang) => {
      const label = lang || 'code'
      return (
        `<div class="code-block">` +
        `<div class="code-header">` +
        `<span class="code-lang">${label}</span>` +
        `<button type="button" class="code-copy" data-copy aria-label="Copy code">Copy</button>` +
        `</div>` +
        `<pre><code class="hljs${lang ? ' language-' + lang : ''}">`
      )
    }
  ).replace(/<\/code><\/pre>/g, '</code></pre></div>')
}

watch(
  () => props.content,
  async (val) => {
    const rendered = await render(val)
    html.value = decorateCodeBlocks(rendered)
  },
  { immediate: true }
)

// Event delegation for the injected copy buttons (v-html content has no Vue
// listeners of its own).
async function onClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement)?.closest('[data-copy]') as HTMLElement | null
  if (!btn) return
  const block = btn.closest('.code-block')
  const code = block?.querySelector('code')?.textContent ?? ''
  try {
    await navigator.clipboard.writeText(code)
    btn.textContent = 'Copied'
    setTimeout(() => (btn.textContent = 'Copy'), 1500)
  } catch {
    toast.error('Failed to copy')
  }
}
</script>

<style>
/* Unscoped: styles must reach v-html content. Namespaced under .markdown-body
   so they don't leak into the rest of the app. */
.markdown-body {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--tw-prose-body, inherit);
  overflow-wrap: anywhere;
}
.markdown-body > *:first-child { margin-top: 0; }
.markdown-body > *:last-child { margin-bottom: 0; }

.markdown-body p { margin: 0.5rem 0; }
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  font-weight: 800;
  line-height: 1.3;
  margin: 1.1rem 0 0.6rem;
}
.markdown-body h1 { font-size: 1.35rem; }
.markdown-body h2 { font-size: 1.2rem; }
.markdown-body h3 { font-size: 1.05rem; }
.markdown-body h4 { font-size: 0.95rem; }

.markdown-body ul,
.markdown-body ol { margin: 0.5rem 0; padding-left: 1.4rem; }
.markdown-body ul { list-style: disc; }
.markdown-body ol { list-style: decimal; }
.markdown-body li { margin: 0.2rem 0; }
.markdown-body li > ul,
.markdown-body li > ol { margin: 0.2rem 0; }

.markdown-body a {
  color: rgb(52 211 153);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.markdown-body a:hover { color: rgb(110 231 183); }

.markdown-body blockquote {
  border-left: 3px solid rgba(255, 255, 255, 0.15);
  padding-left: 0.9rem;
  margin: 0.6rem 0;
  color: rgba(255, 255, 255, 0.65);
}

.markdown-body hr {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
}

/* Inline code */
.markdown-body :not(pre) > code {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.375rem;
  padding: 0.1rem 0.35rem;
  font-size: 0.85em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

/* Tables */
.markdown-body table {
  border-collapse: collapse;
  margin: 0.6rem 0;
  display: block;
  overflow-x: auto;
  font-size: 0.85rem;
}
.markdown-body th,
.markdown-body td {
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.4rem 0.65rem;
  text-align: left;
}
.markdown-body th { background: rgba(255, 255, 255, 0.05); font-weight: 700; }

/* Code blocks — GPT-style card with header */
.markdown-body .code-block {
  margin: 0.7rem 0;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0d1117;
}
.markdown-body .code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.markdown-body .code-lang {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.markdown-body .code-copy {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.4rem;
  padding: 0.15rem 0.55rem;
  cursor: pointer;
  transition: all 0.15s;
}
.markdown-body .code-copy:hover {
  color: rgb(110, 231, 183);
  border-color: rgba(110, 231, 183, 0.4);
}
.markdown-body pre {
  margin: 0;
  padding: 0.85rem 1rem;
  overflow-x: auto;
  font-size: 0.82rem;
  line-height: 1.6;
}
.markdown-body pre code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: transparent;
  padding: 0;
  border: 0;
}
</style>
