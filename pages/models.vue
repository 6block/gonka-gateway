<template>
  <div class="p-8 lg:p-12 max-w-6xl mx-auto space-y-8 animate-fade-in">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-black font-headline tracking-tight leading-none">
        Models List
      </h1>
      <p class="text-text-muted mt-2 font-body text-sm">
        Explore and evaluate high-performance neural models.
      </p>
    </div>

    <!-- Detail view -->
    <template v-if="selectedModel">
      <div class="flex items-center gap-4">
        <button
          @click="selectedModel = null"
          class="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-text-main"
        >
          <LucideChevronLeft class="w-6 h-6" />
        </button>
        <h2 class="text-2xl font-black font-headline tracking-tight">Tutorial</h2>
      </div>

      <div class="space-y-8">
        <!-- Hero -->
        <div
          class="bg-surface-container-high p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-8 items-center"
        >
          <img src="@/assets/img/qwen-icon.png" alt="Qwen3-235b" class="w-14 h-14">
          <div class="flex-1 text-center md:text-left space-y-2">
            <h3 class="text-3xl font-black font-headline tracking-tight">
              {{ modelData.name }}
            </h3>
            <p class="text-text-muted font-body leading-relaxed max-w-2xl">
              {{ modelData.description }}
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
            class="bg-surface-container-lowest rounded-3xl border border-white/5 overflow-hidden"
          >
            <div
              class="bg-surface-container-highest/50 px-6 py-3 border-b border-white/5 flex flex-wrap justify-between items-center gap-4"
            >
              <div class="flex bg-surface-container-lowest p-1 rounded-xl border border-white/5">
                <button
                  v-for="langId in languageTabs"
                  :key="langId"
                  @click="activeLang = langId"
                  class="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
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
              class="p-8 text-sm font-mono leading-relaxed text-primary-dim overflow-x-auto min-h-[300px]"
            ><code>{{ modelData.codeExamples[activeLang] }}</code></pre>
          </div>
        </div>
      </div>
    </template>

    <!-- List view -->
    <template v-else>
      <div
        @click="selectedModel = 'qwen3-235b'"
        class="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden hover:border-primary-container/30 transition-all group cursor-pointer"
      >
        <div class="p-6 md:p-8 space-y-8">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <img src="@/assets/img/qwen-icon.png" alt="Qwen3-235b" class="w-12 h-12">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-black font-headline tracking-tight">
                    {{ modelData.name }}
                  </h3>
                  <div class="flex items-center gap-1 opacity-60">
                    <LucideMessageCircle class="w-4 h-4" />
                    <span class="text-xs font-black">AI</span>
                  </div>
                </div>
                <p class="text-xs font-mono text-text-muted mt-1">{{ modelData.id }}</p>
              </div>
            </div>
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white"
            >
              <LucideZap class="w-4 h-4" />
            </div>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap items-start gap-x-12 gap-y-6">
            <div class="space-y-1.5">
              <p
                class="text-[10px] font-bold text-text-muted uppercase tracking-widest"
              >
                Max Output
              </p>
              <p class="text-lg font-black font-headline tracking-tight">
                {{ modelData.maxOutput }}
              </p>
            </div>
            <div class="space-y-1.5">
              <p
                class="text-[10px] font-bold text-text-muted uppercase tracking-widest"
              >
                Price
              </p>
              <div class="flex items-baseline gap-1.5">
                <span class="text-lg font-black font-headline tracking-tight">
                  {{ modelData.price.amount }}
                </span>
                <span class="text-xs font-black font-headline tracking-tight">
                  / {{ modelData.price.unit }}
                </span>
              </div>
              <p class="text-[11px] text-text-muted leading-snug">
                {{ modelData.price.note }}
              </p>
            </div>
          </div>

          <!-- Tags -->
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-white/5"
          >
            <div class="flex flex-wrap gap-2">
              <div
                v-for="tag in modelData.tags"
                :key="tag.label"
                class="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black tracking-tight"
                :class="tag.color"
              >
                <component v-if="tag.icon" :is="tag.icon" class="w-3 h-3" />
                {{ tag.label }}
              </div>
            </div>
            <span class="text-[10px] font-mono text-text-muted">{{ modelData.date }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  LucideCpu,
  LucideZap,
  LucideTerminal,
  LucideCopy,
  LucideChevronLeft,
  LucideMessageCircle,
  LucideEye,
  LucideDatabase,
  LucideVideo,
  LucideTag
} from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

const toast = useToast()

const selectedModel = ref(null)
const activeLang = ref('python')
const languageTabs = ['python', 'typescript', 'javascript', 'curl']

const modelData = {
  name: 'Qwen3-235b-a22b-instruct-2507-fp8',
  id: 'bailian/qwen3-235b-a22b-instruct-2507-fp8',
  description:
    'A large-scale, instruction-tuned Mixture-of-Experts language model optimized for high-quality general-purpose text generation, strong reasoning ability, and long-context understanding, with efficient FP8 deployment.',
  maxOutput: '262K',
  price: {
    amount: '$0.001',
    unit: '1M tokens',
    note: 'Same rate for input and output tokens'
  },
  tags: [
    {
      label: 'chat',
      color: 'bg-red-500/10 text-red-400 border-red-500/20'
    },
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
      label: 'Video',
      icon: LucideVideo,
      color: 'bg-surface-container-highest text-text-muted border-white/5'
    }
  ],
  date: '2026-04-02',
  pricing: {
    input: '$0.5 / 1M',
    output: '$3 / 1M',
    cacheRead: '$0.05 / 1M',
    cacheWrite: '$0.625 / 1M'
  },
  codeExamples: {
    python: `import gonka_router

client = gonka_router.Client(api_key="GR_BETA_...0x")
response = client.complete(
    model="bailian/qwen3-235b-a22b-instruct-2507-fp8",
    prompt="Optimize this neural circuit.",
    latency_profile="ultra-low"
)`,
    typescript: `import { GonkaClient } from '@gonka/sdk';

const client = new GonkaClient({ apiKey: 'GR_BETA_...0x' });

async function run() {
  const response = await client.complete({
    model: 'bailian/qwen3-235b-a22b-instruct-2507-fp8',
    prompt: 'Optimize this neural circuit.',
    latencyProfile: 'ultra-low'
  });
  console.log(response.text);
}`,
    javascript: `const { GonkaClient } = require('@gonka/sdk');

const client = new GonkaClient({ apiKey: 'GR_BETA_...0x' });

async function run() {
  const response = await client.complete({
    model: 'bailian/qwen3-235b-a22b-instruct-2507-fp8',
    prompt: 'Optimize this neural circuit.',
    latencyProfile: 'ultra-low'
  });
  console.log(response.text);
}`,
    curl: `curl https://api.gonkarouter.com/v1/complete \\
  -H "Authorization: Bearer GR_BETA_...0x" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "bailian/qwen3-235b-a22b-instruct-2507-fp8",
    "prompt": "Optimize this neural circuit.",
    "latency_profile": "ultra-low"
  }'`
  }
}

const pricingRows = computed(() => [
  { label: 'Input', value: modelData.pricing.input },
  { label: 'Output', value: modelData.pricing.output },
  { label: 'Cache Read', value: modelData.pricing.cacheRead },
  { label: 'Cache Write', value: modelData.pricing.cacheWrite }
])

async function copyCode() {
  try {
    await navigator.clipboard.writeText(modelData.codeExamples[activeLang.value])
    toast.success('Code copied to clipboard')
  } catch (err) {
    toast.error('Failed to copy code')
  }
}
</script>
