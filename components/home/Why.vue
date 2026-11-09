<template>
  <section id="features" class="relative z-[1] px-4 sm:px-6 md:px-8 py-16 sm:py-24" aria-labelledby="why-title">
    <div class="max-w-6xl mx-auto">
      <p v-reveal class="font-label text-xs tracking-widest uppercase text-primary-container font-bold mb-4">[ 03 / Why GonkaRouter ]</p>
      <h2 id="why-title" v-reveal="80" class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-text-main tracking-tight mb-10 sm:mb-14 max-w-2xl">
        Built for developers who watch the bill
      </h2>

      <div class="grid md:grid-cols-3 gap-4 sm:gap-5">
        <!-- 主卖点放大 -->
        <article v-reveal class="why-card md:col-span-2 md:row-span-2 flex flex-col justify-between min-h-[18rem]">
          <div>
            <LucideZap class="w-6 h-6 text-primary-container mb-6" />
            <h3 class="font-headline font-black text-2xl sm:text-3xl text-text-main mb-3">Cost-effective pricing</h3>
            <p class="text-text-muted font-body leading-relaxed max-w-md">
              One per-token rate that tracks the Gonka network, the same for input and output.
              No subscriptions and no per-model surcharges.
            </p>
          </div>
          <p class="mt-10">
            <span class="font-headline font-black text-5xl sm:text-7xl text-primary-dim tracking-tighter">{{ fromPer1M }}</span>
            <span class="block font-label text-xs tracking-widest uppercase text-text-muted mt-2">From / 1M tokens</span>
          </p>
        </article>

        <article v-for="(item, i) in items" :key="item.title" v-reveal="120 + i * 120" class="why-card">
          <component :is="item.icon" class="w-5 h-5 text-primary-container mb-5" />
          <h3 class="font-headline font-black text-lg text-text-main mb-2">{{ item.title }}</h3>
          <p class="text-text-muted text-sm font-body leading-relaxed">{{ item.detail }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { LucideZap, LucideShield, LucideGlobe } from 'lucide-vue-next'

const { fromPer1M } = useGonkaPricing()

const items = [
  { title: 'Crypto-native payments', detail: 'Top up with USDT or card. Pay only for the tokens you use.', icon: LucideShield },
  { title: 'Global access', detail: 'Sign in with email or Google. No wallet needed to start.', icon: LucideGlobe },
]
</script>

<style scoped>
.why-card {
  border-radius: 1.75rem;
  border: 1px solid rgb(255 255 255 / 0.08);
  background: rgb(0 0 0 / 0.55);
  backdrop-filter: blur(12px);
  padding: 1.75rem;
  transition: border-color 0.3s ease, transform 0.3s ease;
}

.why-card:hover {
  border-color: rgb(var(--primary-container-rgb) / 0.35);
  transform: translateY(-4px);
}

@media (min-width: 640px) {
  .why-card {
    padding: 2.25rem;
  }
}
</style>
