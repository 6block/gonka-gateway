<template>
  <div class="min-h-screen bg-surface text-text-main selection:bg-primary-container selection:text-primary-on">
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 glass-nav">
      <div
        class="absolute bottom-0 left-0 h-[2px] bg-primary-container origin-left"
        :style="{ transform: `scaleX(${scrollProgress})` }"
      ></div>
      <div class="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-8 py-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 cursor-pointer group"
          @click="scrollTo('hero')"
        >
          <span
            class="text-2xl font-black text-primary-container font-headline tracking-tighter transition-all group-hover:scale-105 animate-pulse-soft"
          >
            GonkaRouter
          </span>
        </NuxtLink>

        <div class="hidden md:flex items-center gap-10">
          <button
            @click="scrollTo('features')"
            class="text-text-muted hover:text-text-main transition-colors font-headline font-bold text-sm hover:-translate-y-0.5"
          >
            Features
          </button>
          <button
            @click="scrollTo('models')"
            class="text-text-muted hover:text-text-main transition-colors font-headline font-bold text-sm hover:-translate-y-0.5"
          >
            Models
          </button>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="toggleColorMode"
            class="p-2 rounded-full text-text-muted hover:text-primary-container hover:bg-white/5 transition-all"
            title="Toggle theme"
          >
            <LucideSun v-if="colorMode.value === 'light'" class="w-5 h-5" />
            <LucideMoon v-else class="w-5 h-5" />
          </button>

          <NuxtLink
            to="/dashboard"
            class="kinetic-gradient text-primary-on px-6 py-2 rounded-full font-headline font-bold text-sm transition-all active:scale-95 hover:shadow-glow-emerald"
          >
            Get API Keys
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="w-full pt-32 pb-16 bg-surface border-t border-white/5">
      <div
        class="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10"
      >
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="flex flex-col md:flex-row items-baseline gap-4">
            <span
              class="text-2xl font-black text-primary-container font-headline tracking-tighter"
            >
              GonkaRouter
            </span>
            <span class="text-xs font-bold text-text-muted tracking-tight">
              AI Model Router on the Gonka Network
            </span>
          </div>
        </div>

        <div class="flex flex-col items-center md:items-end gap-5">
          <div class="flex items-center gap-6">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              class="text-text-muted hover:text-primary-container transition-all hover:scale-110"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
            <a
              href="https://t.me/gonkarouter"
              target="_blank"
              rel="noreferrer"
              class="text-text-muted hover:text-primary-container transition-all hover:scale-110"
            >
              <LucideSend class="w-5 h-5" />
            </a>
          </div>

          <a
            href="mailto:contact@gonkarouter.com"
            class="text-text-muted hover:text-primary-container transition-all flex items-center gap-2 text-sm font-medium bg-white/5 px-4 py-1.5 rounded-full border border-white/5"
          >
            <LucideMail class="w-4 h-4 opacity-60" />
            contact@gonkarouter.com
          </a>

          <div class="flex items-center gap-6 text-xs font-bold text-text-muted">
            <NuxtLink
              to="/privacy-policy"
              class="hover:text-primary-container transition-colors"
            >
              Privacy Policy
            </NuxtLink>
            <div class="w-1 h-1 rounded-full bg-white/10"></div>
            <NuxtLink
              to="/terms-of-service"
              class="hover:text-primary-container transition-colors"
            >
              Terms of Service
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { LucideSun, LucideMoon, LucideSend, LucideMail } from 'lucide-vue-next'

const colorMode = useColorMode()
const scrollProgress = ref(0)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

const handleScroll = () => {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight
  if (totalHeight <= 0) {
    scrollProgress.value = 0
    return
  }
  scrollProgress.value = window.scrollY / totalHeight
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

