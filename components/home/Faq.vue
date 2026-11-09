<template>
  <section id="faq" class="relative z-[1] px-4 sm:px-6 md:px-8 py-16 sm:py-24" aria-labelledby="faq-title">
    <div class="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 lg:gap-16">
      <div v-reveal class="lg:sticky lg:top-28 self-start">
        <h2 id="faq-title" class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-text-main tracking-tight mb-5">
          Frequently asked questions
        </h2>
        <p class="text-text-muted text-sm sm:text-base font-body leading-relaxed mb-6 max-w-sm">
          The most common integration notes, condensed. The full guide is in the docs.
        </p>
        <NuxtLink to="/docs" class="text-primary-container font-headline font-black text-sm hover:underline">
          Read the docs →
        </NuxtLink>
      </div>

      <div v-reveal="120">
        <div class="space-y-3">
          <div
            v-for="(item, index) in displayedFaqs"
            :key="item.q"
            class="rounded-2xl border backdrop-blur-md transition-colors duration-200"
            :class="openIndex === index ? 'border-primary-container/60 bg-black/70' : 'border-white/[0.08] bg-black/50 hover:bg-black/65'"
          >
            <button
              type="button"
              class="w-full flex items-center justify-between gap-6 px-5 sm:px-6 py-5 text-left"
              :aria-expanded="openIndex === index"
              @click="toggle(index)"
            >
              <span class="font-body font-semibold text-base sm:text-lg leading-snug text-text-main">{{ item.q }}</span>
              <span
                class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border font-bold text-sm transition-all duration-200"
                :class="openIndex === index ? 'rotate-90 border-primary-container/70 text-primary-container' : 'border-white/10 text-text-muted'"
              >&gt;</span>
            </button>
            <Transition name="faq-slide">
              <div v-if="openIndex === index" class="px-5 sm:px-6 pb-5 overflow-hidden">
                <!-- 内容是下面写死的常量，不含用户输入 -->
                <p class="text-text-muted text-sm sm:text-base font-body leading-relaxed" v-html="item.a"></p>
              </div>
            </Transition>
          </div>
        </div>

        <button
          type="button"
          class="mt-6 inline-flex items-center gap-2 bg-black/50 ghost-border text-text-main px-6 py-3 rounded-full font-headline font-bold text-sm transition-all hover:bg-white/10"
          @click="toggleAll"
        >
          {{ showAll ? 'Show fewer FAQs ^' : 'Show more FAQs +' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface FaqItem {
  q: string
  a: string
}

const CODE = 'bg-surface-container-highest px-1.5 py-0.5 rounded text-primary-dim text-[13px]'
const FAQS: readonly FaqItem[] = [
  {
    q: 'What is GonkaRouter?',
    a: 'GonkaRouter is an AI model router built on the Gonka Network. It gives you a single, OpenAI-compatible API endpoint that routes your requests to the best available AI model — including GLM-5.3-Flash, DeepSeek-V4-Flash and MiniMax-M2.7 — with transparent per-token pricing and no monthly subscriptions.'
  },
  {
    q: 'Is GonkaRouter an OpenRouter alternative?',
    a: 'Yes. Like OpenRouter, GonkaRouter provides a unified API to access multiple large language models. The key difference is that GonkaRouter is built on the Gonka Network with crypto-native payments and <strong class="text-text-main">per-token rates that track the Gonka network price</strong>, plus 1M free tokens for new users.'
  },
  {
    q: 'How is GonkaRouter different from OpenRouter?',
    a: 'A single per-token rate that tracks the Gonka network — the same for input and output, with no model-by-model price table to worry about. Crypto-native billing on the Gonka Network: no credit card, no subscriptions. New users get 1M free tokens.'
  },
  {
    q: 'How does GonkaRouter pricing work?',
    a: 'GonkaRouter charges a <strong class="text-text-main">single per-token rate that tracks the Gonka network price</strong>, applied equally to both input and output tokens. There are no monthly fees or per-model surcharges — see the Pricing page for the current live rate. New users get 1M free tokens. After that, you top up your balance and are billed only for what you consume.'
  },
  {
    q: 'Which AI models does GonkaRouter support?',
    a: 'GonkaRouter currently supports <strong class="text-text-main">GLM-5.3-Flash</strong>, <strong class="text-text-main">DeepSeek-V4-Flash</strong> and <strong class="text-text-main">MiniMax-M2.7</strong>, with more models being added regularly. All models share the same per-token rate — which tracks the Gonka network — and are accessible through one unified API endpoint.'
  },
  {
    q: 'Is the API compatible with OpenAI SDKs?',
    a: `Yes. GonkaRouter uses an OpenAI-compatible API format. You can use the official OpenAI Python or TypeScript SDK by simply changing the <code class="${CODE}">base_url</code> to <code class="${CODE}">https://api.gonkarouter.io/v1</code> and setting your GonkaRouter API key.`
  },
  {
    q: 'Do I need a crypto wallet to use GonkaRouter?',
    a: 'No. Sign in with your email or Google account — no wallet required. A crypto wallet is only needed if you want to top up your balance with USDT (BEP-20) on the Gonka Network. You can also browse the Chat and Models pages as a guest.'
  },
  {
    q: 'How do I get started?',
    a: `Getting started takes less than a minute: sign in with email or Google on the Dashboard, copy your API key, and replace the <code class="${CODE}">base_url</code> in your existing OpenAI SDK calls. New accounts automatically receive 1M free tokens — no payment setup required to start.`
  }
]
const INITIAL_FAQ_COUNT = 5

const openIndex = ref<number | null>(null)
const showAll = ref(false)
const displayedFaqs = computed(() => (showAll.value ? FAQS : FAQS.slice(0, INITIAL_FAQ_COUNT)))

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
const toggleAll = () => {
  showAll.value = !showAll.value
  if (!showAll.value) openIndex.value = null
}
</script>

<style scoped>
/* 只动透明度和位移，不动 max-height，避免每帧重排 */
.faq-slide-enter-active {
  transition: opacity 0.25s ease, translate 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.faq-slide-leave-active {
  transition: opacity 0.12s ease;
}
.faq-slide-enter-from {
  opacity: 0;
  translate: 0 -6px;
}
.faq-slide-leave-to {
  opacity: 0;
}
</style>
