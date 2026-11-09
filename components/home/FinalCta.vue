<template>
  <section class="relative z-[1] px-4 sm:px-6 md:px-8 py-24 sm:py-32 text-center" aria-labelledby="final-cta-title">
    <div v-reveal class="max-w-3xl mx-auto">
      <h2 id="final-cta-title" class="font-headline text-4xl sm:text-5xl md:text-6xl font-black text-text-main tracking-tighter mb-6">
        Start with <span class="text-primary-dim">1M free tokens</span>
      </h2>
      <p class="font-body text-text-muted text-base sm:text-lg font-light leading-relaxed mb-10">
        Sign in, copy your API key, and point your OpenAI SDK at GonkaRouter. It takes about a minute.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <NuxtLink
          to="/dashboard"
          class="kinetic-gradient text-primary-on px-8 py-4 rounded-full font-headline font-black text-lg transition-all hover:-translate-y-0.5 hover:shadow-glow-emerald-lg active:scale-95"
        >
          Get API Keys
        </NuxtLink>
        <NuxtLink
          to="/docs"
          class="bg-black/50 text-text-main ghost-border px-8 py-4 rounded-full font-headline font-bold text-lg transition-all hover:bg-white/10 hover:-translate-y-0.5"
        >
          Read the docs
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
