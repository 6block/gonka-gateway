<template>
  <div>
    <!-- Hero -->
    <section
      id="hero"
      class="relative asymmetric-padding px-4 sm:px-6 md:px-8 overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center text-center"
    >
      <!-- Floating particles -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <span
          v-for="p in particles"
          :key="p.id"
          class="absolute w-1 h-1 rounded-full bg-primary-container opacity-20 particle"
          :style="p.style"
        ></span>
      </div>

      <div class="relative z-10 max-w-6xl animate-fade-in">
        <div class="flex flex-col items-center gap-4 mb-10">
          <div
            class="inline-flex items-center gap-2 bg-surface-container-high ghost-border px-5 py-2 rounded-full"
          >
            <span class="flex h-2 w-2 rounded-full bg-primary-container animate-pulse"></span>
            <span
              class="font-label text-xs tracking-widest uppercase text-secondary font-bold"
            >
              Now Supporting Kimi-K2.6
            </span>
          </div>
        </div>

        <h1
          class="font-headline text-[2.25rem] leading-[1.08] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-5 sm:mb-6 sm:leading-[1.05] animate-float"
        >
          <span class="text-primary-dim">AI Model Router</span><br />
          <span class="text-text-main">on the Gonka Network</span>
        </h1>

        <div
          class="inline-flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 px-5 py-2 rounded-full mb-12 animate-scale-in"
        >
          <LucideZap class="w-4 h-4 text-primary-container" />
          <span class="text-xs sm:text-sm font-bold tracking-wide text-primary-container">
            New users get $20 daily credits for 7 days after sign-up
          </span>
        </div>

        <p
          class="font-body text-text-muted text-base sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 sm:mb-16 leading-relaxed font-light whitespace-pre-line"
        >
          {{ heroDescription }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <NuxtLink
            to="/dashboard"
            class="w-full sm:w-auto kinetic-gradient text-primary-on px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-headline font-black text-base sm:text-lg transition-all hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 hover:shadow-glow-emerald-lg"
          >
            Get API Keys
          </NuxtLink>
          <button
            @click="scrollToModels"
            class="w-full sm:w-auto bg-surface-container-highest text-text-main ghost-border px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-headline font-bold text-base sm:text-lg hover:bg-surface-container-high transition-all hover:-translate-y-0.5"
          >
            Explore Models
          </button>
        </div>

      </div>
    </section>

    <!-- Why Choose -->
    <section
      id="features"
      class="pt-10 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8 bg-surface relative overflow-hidden"
    >
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8 sm:mb-12">
          <h2
            class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-text-main tracking-tight"
          >
            Why Choose GonkaRouter
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="item in whyItems"
            :key="item.title"
            class="bg-surface-container-high p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-white/5 hover:border-primary-container/30 transition-all group hover:-translate-y-1.5 duration-300"
          >
            <div
              class="w-11 h-11 sm:w-12 sm:h-12 bg-primary-container/10 rounded-2xl flex items-center justify-center text-primary-container mb-4 sm:mb-6 group-hover:scale-110 transition-transform"
            >
              <component :is="item.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 class="font-headline font-black text-lg sm:text-xl text-text-main leading-tight">
              {{ item.title }}
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Model -->
    <section
      id="models"
      class="asymmetric-padding px-4 sm:px-6 md:px-8 bg-surface relative overflow-hidden"
    >
      <div class="max-w-5xl mx-auto text-center relative z-10">
        <!-- Model toggle -->
        <div class="flex justify-center mb-10">
          <div
            class="inline-flex bg-surface-container-high p-1 rounded-full border border-white/5"
            role="tablist"
            aria-label="Featured model selector"
          >
            <button
              v-for="model in featuredModels"
              :key="model.id"
              type="button"
              role="tab"
              :aria-selected="featuredModel === model.id"
              @click="featuredModel = model.id"
              class="px-5 py-2 rounded-full text-xs font-black tracking-tight transition-all"
              :class="
                featuredModel === model.id
                  ? 'bg-primary-container text-primary-on shadow-lg shadow-primary-container/20'
                  : 'text-text-muted hover:text-text-main'
              "
            >
              {{ model.label }}
            </button>
          </div>
        </div>

        <h2
          class="font-headline text-3xl sm:text-5xl md:text-6xl font-black text-text-main mb-6 sm:mb-8 tracking-tight"
        >
          Featured Model: {{ activeFeatured.label }}
        </h2>
        <p class="font-body text-text-muted text-base sm:text-xl mb-12 sm:mb-20 max-w-3xl mx-auto font-light leading-relaxed">
          {{ activeFeatured.tagline }}
        </p>

        <div class="flex flex-col gap-10 sm:gap-16 items-center">
          <div class="flex flex-wrap justify-center gap-3 sm:gap-6">
            <div
              v-for="feature in features"
              :key="feature.label"
              class="flex items-center gap-2 sm:gap-3 bg-surface-container-high px-5 sm:px-8 py-3 sm:py-4 rounded-full ghost-border hover:border-primary-container/30 hover:bg-surface-container-highest transition-all cursor-default hover:scale-105 duration-300"
            >
              <component :is="feature.icon" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-container" />
              <span class="font-label text-xs sm:text-sm font-bold text-text-main tracking-wide">
                {{ feature.label }}
              </span>
            </div>
          </div>

          <!-- Code preview -->
          <div
            class="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden text-left relative z-10 shadow-xl shadow-black/30 hover:-translate-y-1 transition-transform duration-500"
          >
            <div
              class="bg-surface-container-high px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 border-b border-white/5"
            >
              <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500/40"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/40"></div>
              </div>
              <span
                class="text-[10px] sm:text-xs text-text-muted font-label ml-3 sm:ml-6 font-bold tracking-widest uppercase"
              >
                inference.py
              </span>
              <div class="ml-auto flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></div>
                <span
                  class="text-[10px] font-black text-primary-container uppercase tracking-tighter"
                >
                  Live
                </span>
              </div>
            </div>
            <div class="p-5 sm:p-8 md:p-10 font-mono text-xs sm:text-sm md:text-base leading-relaxed overflow-x-auto custom-scrollbar">
              <pre class="text-secondary"><code><span class="text-text-muted"># pip install openai</span>
<span class="text-primary-dim">from</span> openai <span class="text-primary-dim">import</span> OpenAI

client = OpenAI(
    api_key=<span class="text-tertiary">"sk-xxxxxx"</span>,
    base_url=<span class="text-tertiary">"{{ baseUrl }}"</span>,
)

response = client.chat.completions.create(
    model=<span class="text-tertiary">"{{ activeFeatured.apiId }}"</span>,
    messages=[
        {<span class="text-tertiary">"role"</span>: <span class="text-tertiary">"user"</span>, <span class="text-tertiary">"content"</span>: <span class="text-tertiary">"Hello!"</span>},
    ],
)

print(response.choices[<span class="text-tertiary">0</span>].message.content)<span class="inline-block w-2 h-5 bg-primary-container ml-1 align-middle animate-pulse"></span></code></pre>
            </div>
          </div>

          <NuxtLink
            to="/dashboard"
            class="kinetic-gradient text-primary-on px-8 py-4 rounded-full font-headline font-black text-lg transition-all active:scale-95 hover:shadow-glow-emerald-lg hover:-translate-y-0.5"
          >
            Get API Keys
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import {
  LucideZap,
  LucideShield,
  LucideGlobe,
  LucideDatabase,
  LucideTerminal
} from 'lucide-vue-next'

definePageMeta({ layout: 'landing' })

const config = useRuntimeConfig()
const baseUrl = computed(() => `${config.public.apiBase}/v1`)

const siteUrl = config.public.siteUrl || 'https://router.gonkascan.com'
useSeoMeta({
  title: 'AI Model Router on the Gonka Network',
  description:
    'One API for all AI models. OpenAI/Anthropic compatible, $0.001 per 1M tokens, with $20 daily credits for 7 days for new users.',
  ogTitle: 'GonkaRouter — AI Model Router on the Gonka Network',
  ogDescription:
    'One API for all AI models. OpenAI/Anthropic compatible, $0.001 per 1M tokens.',
  ogUrl: siteUrl,
  twitterTitle: 'GonkaRouter — AI Model Router on the Gonka Network',
  twitterDescription:
    'One API for all AI models. OpenAI/Anthropic compatible, $0.001 per 1M tokens.'
})
useHead({ link: [{ rel: 'canonical', href: siteUrl }] })

const heroDescription =
  'One API for All AI Models\nDevelopers first\nAt $0.001 per 1M tokens'

const whyItems = [
  { title: 'Cost-Effective Pricing', icon: LucideZap },
  { title: 'Crypto-Native Payments', icon: LucideShield },
  { title: 'Global Access', icon: LucideGlobe },
  { title: 'Integration with Web3 Ecosystems', icon: LucideDatabase }
]

const features = [
  { label: '262k Context Window', icon: LucideZap },
  { label: 'Function Calling Ready', icon: LucideTerminal },
  { label: 'Private VPC Deployment', icon: LucideShield }
]

const featuredModels = [
  {
    id: 'kimi',
    label: 'Kimi-K2.6',
    apiId: 'moonshotai/Kimi-K2.6',
    tagline:
      'Optimized Kimi-K2.6: Superior long-context reasoning with enhanced throughput on the Gonka pipeline.'
  },
  {
    id: 'qwen',
    label: 'Qwen3-235B',
    apiId: 'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8',
    tagline:
      'Optimized Qwen3-235B: Industry-leading reasoning performance with 40% faster Time to First Token (TTFT).'
  }
]
const featuredModel = ref(featuredModels[0].id)
const activeFeatured = computed(
  () => featuredModels.find((m) => m.id === featuredModel.value) ?? featuredModels[0]
)

function scrollToModels() {
  const el = document.getElementById('models')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// Particles must be generated client-only — Math.random() during SSR vs.
// hydration would produce a Vue hydration mismatch warning.
const particles = ref([])
onMounted(() => {
  particles.value = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    style: `left:${Math.random() * 100}%; top:${Math.random() * 100}%; animation-delay:${
      Math.random() * 10
    }s; animation-duration:${10 + Math.random() * 20}s;`
  }))
})
</script>

<style scoped>
.particle {
  animation-name: particleFloat;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes particleFloat {
  0% {
    transform: translateY(20%);
    opacity: 0;
  }
  30% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-120vh);
    opacity: 0;
  }
}
</style>
