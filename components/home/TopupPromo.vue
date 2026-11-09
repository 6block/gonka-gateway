<template>
  <section id="topup" class="home-topup relative z-[1] px-4 sm:px-6 md:px-8 py-16 sm:py-24" aria-labelledby="topup-title">
    <div v-reveal class="max-w-6xl mx-auto rounded-[2rem] border border-primary-container/20 bg-black/60 backdrop-blur-md overflow-hidden">
      <div class="grid lg:grid-cols-2 gap-10 p-6 sm:p-10 lg:p-14 items-center">
        <div>
          <h2 id="topup-title" class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-text-main tracking-tight mb-5">
            Top up, get <span class="text-primary-dim">+{{ TOPUP_BONUS_PERCENT }}%</span> credit
          </h2>
          <p class="font-body text-text-muted text-base sm:text-lg font-light leading-relaxed mb-8 max-w-lg">
            Every topped-up account also gets a higher concurrency limit, so more requests run at once
            and traffic spikes hit fewer 429 errors. Card or USDT.
          </p>
          <ul class="grid sm:grid-cols-2 gap-3 mb-8">
            <li v-for="perk in perks" :key="perk.title" class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p class="font-headline font-black text-text-main">{{ perk.title }}</p>
              <p class="text-text-muted text-sm font-body mt-1">{{ perk.detail }}</p>
            </li>
          </ul>
          <NuxtLink
            to="/deposit"
            class="inline-flex kinetic-gradient text-primary-on px-8 py-4 rounded-full font-headline font-black text-lg transition-all hover:-translate-y-0.5 hover:shadow-glow-emerald-lg active:scale-95"
          >
            Top up now
          </NuxtLink>
        </div>

        <HomeConcurrencyMeter class="rounded-2xl border border-white/10 bg-black/40 p-5 sm:p-7" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TOPUP_BONUS_PERCENT } from '~/utils/promo'

const perks = [
  { title: `+${TOPUP_BONUS_PERCENT}% bonus credit`, detail: 'Added to your balance on top-up' },
  { title: 'Higher concurrency', detail: 'Applies to every model on your API keys' },
]
</script>
