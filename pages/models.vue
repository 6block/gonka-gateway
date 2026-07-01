<template>
  <div class="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
    <!-- Header -->
    <div>
      <h1 class="text-xl sm:text-2xl font-black font-headline tracking-tight leading-none">
        Models List
      </h1>
      <p class="text-text-muted mt-2 font-body text-sm">
        Explore and evaluate high-performance neural models.
      </p>
    </div>

    <!-- Detail view -->
    <template v-if="activeModel">
      <div class="flex items-center gap-3 sm:gap-4">
        <button
          @click="selectedModelId = null"
          class="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-text-main"
          aria-label="Back to model list"
        >
          <LucideChevronLeft class="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h2 class="text-xl sm:text-2xl font-black font-headline tracking-tight">Tutorial</h2>
      </div>

      <div class="space-y-6 sm:space-y-8">
        <!-- Hero -->
        <div
          class="bg-surface-container-high p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 flex flex-col md:flex-row gap-5 md:gap-8 items-center"
        >
          <component :is="activeModel.iconComponent" />
          <div class="flex-1 text-center md:text-left space-y-2 min-w-0">
            <h3 class="text-xl sm:text-2xl md:text-3xl font-black font-headline tracking-tight break-all md:break-normal">
              {{ activeModel.name }}
            </h3>
            <p class="text-text-muted text-sm sm:text-base font-body leading-relaxed max-w-2xl">
              {{ activeModel.description }}
            </p>
          </div>
        </div>

        <!-- Code example -->
        <div class="space-y-4">
          <h4
            class="text-sm font-black font-headline uppercase tracking-widest text-text-muted flex items-center gap-2"
          >
            <LucideTerminal class="w-4 h-4" />
            Code Example
          </h4>
          <div
            class="bg-surface-container-lowest rounded-2xl sm:rounded-3xl border border-white/5 overflow-hidden"
          >
            <div
              class="bg-surface-container-highest/50 px-4 sm:px-6 py-3 border-b border-white/5 flex flex-wrap justify-between items-center gap-3 sm:gap-4"
            >
              <div class="flex bg-surface-container-lowest p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
                <button
                  v-for="langId in languageTabs"
                  :key="langId"
                  @click="activeLang = langId"
                  class="px-3 sm:px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
                  :class="
                    activeLang === langId
                      ? 'bg-primary-container text-primary-on shadow-lg shadow-primary-container/20'
                      : 'text-text-muted hover:text-text-main'
                  "
                >
                  {{ langId }}
                </button>
              </div>
              <button
                @click="copyCode"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-white/5 text-[10px] font-black text-text-muted hover:text-primary-container hover:border-primary-container/30 transition-all uppercase tracking-widest"
              >
                <LucideCopy class="w-3 h-3" />
                Copy
              </button>
            </div>
            <pre
              class="p-4 sm:p-6 md:p-8 text-xs sm:text-sm font-mono leading-relaxed text-primary-dim overflow-x-auto min-h-[240px] sm:min-h-[300px] custom-scrollbar"
            ><code>{{ activeCodeExamples[activeLang] }}</code></pre>
          </div>
        </div>
      </div>
    </template>

    <!-- List view -->
    <template v-else>
      <div class="space-y-4 sm:space-y-6">
        <div
          v-for="model in models"
          :key="model.id"
          @click="selectedModelId = model.id"
          class="bg-surface-container-low border border-white/5 rounded-2xl hover:border-primary-container/30 transition-all group cursor-pointer"
        >
          <div class="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <component :is="model.iconComponent" />
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-base sm:text-xl font-black font-headline tracking-tight break-all">
                      {{ model.name }}
                    </h3>
                    <div class="flex items-center gap-1 opacity-60">
                      <LucideMessageCircle class="w-4 h-4" />
                      <span class="text-xs font-black">AI</span>
                    </div>
                  </div>
                  <p class="text-[11px] sm:text-xs font-mono text-text-muted mt-1 break-all">{{ model.id }}</p>
                </div>
              </div>
              <div
                class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white shrink-0"
              >
                <LucideZap class="w-4 h-4" />
              </div>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap items-start gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-6">
              <div class="space-y-1.5">
                <p
                  class="text-[10px] font-bold text-text-muted uppercase tracking-widest"
                >
                  Max Output
                </p>
                <p class="text-lg font-black font-headline tracking-tight">
                  {{ model.maxOutput }}
                </p>
              </div>
              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <p
                    class="text-[10px] font-bold text-text-muted uppercase tracking-widest"
                  >
                    Price
                  </p>
                  <span
                    class="relative inline-flex items-center"
                    @click.stop
                  >
                    <button
                      type="button"
                      class="peer text-text-muted hover:text-primary-container focus-visible:text-primary-container transition-colors focus:outline-none"
                      aria-label="Pricing details"
                    >
                      <LucideHelpCircle class="w-3.5 h-3.5" />
                    </button>
                    <!-- Tooltip: centered above the ? icon. The card no longer
                         clips overflow, so the full panel renders even when it
                         extends past the card's top edge. -->
                    <span
                      class="pointer-events-none absolute bottom-full left-1/2 mb-3 z-20 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 opacity-0 translate-y-1 transition-all duration-150 peer-hover:opacity-100 peer-hover:translate-y-0 peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0"
                      role="tooltip"
                    >
                      <span
                        class="relative block bg-[#0a0a0a]/95 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-4 sm:p-5 text-left font-body"
                      >
                        <span
                          class="grid grid-cols-[auto_1fr] gap-x-3 sm:gap-x-4 gap-y-2.5 sm:gap-y-3 text-[12px] sm:text-[13px] leading-snug"
                        >
                          <span class="text-red-400 whitespace-nowrap">
                            Utilization &gt; 60%
                          </span>
                          <span class="text-red-400">
                            →&nbsp; increase the model’s token price
                          </span>

                          <span class="text-primary-container whitespace-nowrap">
                            Utilization &lt; 40%
                          </span>
                          <span class="text-primary-container">
                            →&nbsp; reduce the model’s token price
                          </span>

                          <span class="text-text-muted whitespace-nowrap">
                            Utilization between 40%–60%
                          </span>
                          <span class="text-text-muted">
                            →&nbsp; keep the token price unchanged
                          </span>
                        </span>
                        <!-- Caret centered under the tooltip, aligned with the ? icon -->
                        <span
                          class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0a0a0a]/95 border-r border-b border-white/10 rotate-45"
                        ></span>
                      </span>
                    </span>
                  </span>
                </div>
                <div class="flex items-baseline gap-1.5">
                  <span class="text-lg font-black font-headline tracking-tight">
                    {{ model.price.amount }}
                  </span>
                  <span class="text-xs font-black font-headline tracking-tight">
                    / {{ model.price.unit }}
                  </span>
                </div>
                <p class="text-[11px] text-text-muted leading-snug">
                  {{ model.price.note }}
                </p>
              </div>
            </div>

            <!-- Dynamic pricing note -->
            <div
              class="border-l-2 border-primary-container/40 pl-3 text-[11px] text-primary-container/90 font-medium leading-snug"
            >
              Token prices are dynamically adjusted based on utilization of the Gonka network
            </div>

            <!-- Tags -->
            <div
              class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-white/5"
            >
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="tag in model.tags"
                  :key="tag.label"
                  class="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black tracking-tight"
                  :class="tag.color"
                >
                  <component v-if="tag.icon" :is="tag.icon" class="w-3 h-3" />
                  {{ tag.label }}
                </div>
              </div>
              <span class="text-[10px] font-mono text-text-muted">{{ model.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import {
  LucideZap,
  LucideTerminal,
  LucideCopy,
  LucideChevronLeft,
  LucideMessageCircle,
  LucideDatabase,
  LucideEye,
  LucideSearch,
  LucideHelpCircle
} from 'lucide-vue-next'
import qwenIcon from '@/assets/img/qwen-icon.png'
import { useToast } from '~/composables/useToast'

const modelsConfig = useRuntimeConfig()
const modelsSiteUrl = modelsConfig.public.siteUrl || 'https://gonkarouter.io'
useSeoMeta({
  title: 'Supported AI Models',
  description:
    'Browse all AI models available on GonkaRouter — Kimi-K2, Qwen, DeepSeek, and more. One unified API, transparent pricing at $0.0004 per 1M tokens.',
  ogTitle: 'Supported AI Models | GonkaRouter',
  ogDescription:
    'All AI models available on GonkaRouter through one unified API on the Gonka Network.',
  ogUrl: `${modelsSiteUrl}/models`,
  twitterTitle: 'Supported AI Models | GonkaRouter',
  twitterDescription:
    'All AI models available on GonkaRouter through one unified API.'
})
useHead({ link: [{ rel: 'canonical', href: `${modelsSiteUrl}/models` }] })

const toast = useToast()
const config = useRuntimeConfig()

const selectedModelId = ref(null)
const activeLang = ref('python')
const languageTabs = ['python', 'typescript', 'javascript', 'curl']

// Inline icons. Kimi has no asset yet, so render a styled "K" tile that
// matches the design until a real PNG is added under assets/img/.
const QwenIconImg = () =>
  h('img', { src: qwenIcon, alt: 'Qwen3-235b', class: 'w-12 h-12 shrink-0' })

const KimiIconImg = () =>
  h(
    'div',
    {
      class:
        'relative w-12 h-12 shrink-0 rounded-xl bg-black flex items-center justify-center border border-white/10',
      'aria-label': 'Kimi-K2.6'
    },
    [
      h('span', { class: 'text-white font-black text-2xl font-headline leading-none' }, 'K'),
      h('span', {
        class: 'absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400'
      })
    ]
  )

const MiniMaxIconImg = () =>
  h(
    'div',
    {
      class:
        'relative w-12 h-12 shrink-0 rounded-xl bg-black flex items-center justify-center border border-white/10',
      'aria-label': 'MiniMax-M2.7'
    },
    [
      h('span', { class: 'text-white font-black text-2xl font-headline leading-none' }, 'M'),
      h('span', {
        class: 'absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-400'
      })
    ]
  )

// TEMP 2026-06-25: Qwen3-235B carries `hidden: true` while upstream Gonka takes
// it offline for adjustment. The full card data is kept intact; to restore it
// simply remove its `hidden: true` line.
const allModels = [
  {
    id: 'qwen3-235b',
    hidden: true,
    name: 'Qwen3-235B-A22B-Instruct-2507-FP8',
    apiId: 'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8',
    iconComponent: QwenIconImg,
    description:
      'A large-scale, instruction-tuned Mixture-of-Experts language model optimized for high-quality general-purpose text generation, strong reasoning ability, and long-context understanding, with efficient FP8 deployment.',
    maxOutput: '262K',
    price: {
      amount: '$0.0004',
      unit: '1M tokens',
      note: 'Same rate for input and output tokens'
    },
    tags: [
      { label: 'chat', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
      {
        label: 'Function',
        icon: LucideTerminal,
        color: 'bg-surface-container-highest text-text-muted border-white/5'
      },
      {
        label: 'Reasoning',
        icon: LucideZap,
        color: 'bg-surface-container-highest text-text-muted border-white/5'
      },
      {
        label: 'Cache',
        icon: LucideDatabase,
        color: 'bg-primary-container/10 text-primary-container border-primary-container/20'
      }
    ],
    date: '2026-04-02'
  },
  {
    id: 'kimi-k2-6',
    name: 'Kimi-K2.6',
    apiId: 'moonshotai/Kimi-K2.6',
    iconComponent: KimiIconImg,
    description:
      'A large language model developed by Moonshot AI, designed for advanced reasoning, long-context understanding, and code-intensive tasks. It significantly improves performance in software engineering, document processing, and multi-step task execution, while supporting very long context windows and agent-like capabilities for complex workflow automation.',
    maxOutput: '262K',
    price: {
      amount: '$0.0004',
      unit: '1M tokens',
      note: 'Same rate for input and output tokens'
    },
    tags: [
      { label: 'chat', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
      {
        label: 'Vision',
        icon: LucideEye,
        color: 'bg-surface-container-highest text-text-muted border-white/5'
      },
      {
        label: 'Function',
        icon: LucideTerminal,
        color: 'bg-surface-container-highest text-text-muted border-white/5'
      },
      {
        label: 'Reasoning',
        icon: LucideZap,
        color: 'bg-surface-container-highest text-text-muted border-white/5'
      },
      {
        label: 'Cache',
        icon: LucideDatabase,
        color: 'bg-primary-container/10 text-primary-container border-primary-container/20'
      },
      {
        label: 'Search',
        icon: LucideSearch,
        color: 'bg-surface-container-highest text-text-muted border-white/5'
      }
    ],
    date: '2026-05-09'
  },
  {
    id: 'minimax-m2-7',
    name: 'MiniMax-M2.7',
    apiId: 'MiniMaxAI/MiniMax-M2.7',
    iconComponent: MiniMaxIconImg,
    description:
      'An agent-native model from MiniMax, positioned as their first model to deeply participate in its own evolution. It excels at complex agent harnesses and real-world software engineering — end-to-end project delivery, log analysis, bug troubleshooting, code security, and machine-learning workflows — with strong planning, stable long-chain tool calling, and reasoning, plus high-fidelity office-document editing across Excel, PPT, and Word.',
    maxOutput: '192K',
    price: {
      amount: '$0.0004',
      unit: '1M tokens',
      note: 'Same rate for input and output tokens'
    },
    tags: [
      { label: 'chat', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
      {
        label: 'Function',
        icon: LucideTerminal,
        color: 'bg-surface-container-highest text-text-muted border-white/5'
      },
      {
        label: 'Reasoning',
        icon: LucideZap,
        color: 'bg-surface-container-highest text-text-muted border-white/5'
      },
      {
        label: 'Cache',
        icon: LucideDatabase,
        color: 'bg-primary-container/10 text-primary-container border-primary-container/20'
      }
    ],
    date: '2026-05-29'
  }
]

// Only non-hidden models are surfaced anywhere (cards, structured data, modal).
const models = allModels.filter((m) => !m.hidden)

// ItemList schema backed by the visible model cards. Each model is exposed as a
// SoftwareApplication with its transparent per-token Offer, enabling rich results.
useStructuredData({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AI models supported by GonkaRouter',
  numberOfItems: models.length,
  itemListElement: models.map((m, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: m.name,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      description: m.description,
      url: `${modelsSiteUrl}/models`,
      offers: {
        '@type': 'Offer',
        price: '0.0004',
        priceCurrency: 'USD',
        description: `${m.price.amount} per ${m.price.unit}`
      }
    }
  }))
})

const activeModel = computed(
  () => models.find((m) => m.id === selectedModelId.value) ?? null
)

// Code examples are rendered against the runtime apiBase and the active
// model's apiId so users can copy-paste a snippet that immediately works.
const baseUrl = computed(() => `${config.public.apiBase}/v1`)

const activeCodeExamples = computed(() => {
  const m = activeModel.value
  if (!m) return { python: '', typescript: '', javascript: '', curl: '' }
  return {
    python: `# pip install openai
from openai import OpenAI

client = OpenAI(
    api_key="sk-xxxxxx",
    base_url="${baseUrl.value}",
)

response = client.chat.completions.create(
    model="${m.apiId}",
    messages=[
        {"role": "user", "content": "Hello!"},
    ],
)

print(response.choices[0].message.content)`,

    typescript: `// npm install openai
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: 'sk-xxxxxx',
  baseURL: '${baseUrl.value}',
})

const response = await client.chat.completions.create({
  model: '${m.apiId}',
  messages: [
    { role: 'user', content: 'Hello!' },
  ],
})

console.log(response.choices[0].message.content)`,

    javascript: `// npm install openai
const OpenAI = require('openai')

const client = new OpenAI({
  apiKey: 'sk-xxxxxx',
  baseURL: '${baseUrl.value}',
})

;(async () => {
  const response = await client.chat.completions.create({
    model: '${m.apiId}',
    messages: [
      { role: 'user', content: 'Hello!' },
    ],
  })
  console.log(response.choices[0].message.content)
})()`,

    curl: `curl -X POST ${baseUrl.value}/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-xxxxxx" \\
  -d '{
    "model": "${m.apiId}",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`
  }
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(activeCodeExamples.value[activeLang.value])
    toast.success('Code copied to clipboard')
  } catch (err) {
    toast.error('Failed to copy code')
  }
}
</script>
