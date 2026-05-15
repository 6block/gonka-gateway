<template>
  <div class="min-h-screen bg-surface text-text-main selection:bg-primary-container selection:text-primary-on">
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 glass-nav">
      <div
        class="absolute bottom-0 left-0 h-[2px] bg-primary-container origin-left"
        :style="{ transform: `scaleX(${scrollProgress})` }"
      ></div>
      <div class="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 cursor-pointer group min-w-0"
          @click="handleLogoClick"
        >
          <span
            class="text-xl sm:text-2xl font-black text-primary-container font-headline tracking-tighter transition-all group-hover:scale-105 animate-pulse-soft truncate"
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
          <NuxtLink
            to="/docs"
            class="text-text-muted hover:text-text-main transition-colors font-headline font-bold text-sm hover:-translate-y-0.5"
          >
            Docs
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <button
            @click="toggleColorMode"
            class="p-2 rounded-full text-text-muted hover:text-primary-container hover:bg-white/5 transition-all"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <LucideSun v-if="colorMode.value === 'light'" class="w-5 h-5" />
            <LucideMoon v-else class="w-5 h-5" />
          </button>

          <NuxtLink
            to="/dashboard"
            class="hidden sm:inline-flex kinetic-gradient text-primary-on px-5 sm:px-6 py-2 rounded-full font-headline font-bold text-xs sm:text-sm transition-all active:scale-95 hover:shadow-glow-emerald whitespace-nowrap"
          >
            Get API Keys
          </NuxtLink>

          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-full text-text-muted hover:text-text-main hover:bg-white/5 transition-all"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="landing-mobile-menu"
            aria-label="Open menu"
          >
            <LucideX v-if="isMobileMenuOpen" class="w-5 h-5" />
            <LucideMenu v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile menu panel -->
      <Transition name="menu-slide">
        <div
          v-if="isMobileMenuOpen"
          id="landing-mobile-menu"
          class="md:hidden border-t border-white/5 bg-surface-container-low/95 backdrop-blur-xl"
        >
          <div class="px-4 py-4 space-y-1 max-w-7xl mx-auto">
            <button
              @click="onMobileNav('features')"
              class="w-full text-left px-4 py-3 rounded-xl text-text-muted hover:text-text-main hover:bg-white/5 font-headline font-bold text-sm transition-all"
            >
              Features
            </button>
            <button
              @click="onMobileNav('models')"
              class="w-full text-left px-4 py-3 rounded-xl text-text-muted hover:text-text-main hover:bg-white/5 font-headline font-bold text-sm transition-all"
            >
              Models
            </button>
            <NuxtLink
              to="/docs"
              @click="closeMobileMenu"
              class="block w-full text-left px-4 py-3 rounded-xl text-text-muted hover:text-text-main hover:bg-white/5 font-headline font-bold text-sm transition-all"
            >
              Docs
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              @click="closeMobileMenu"
              class="block w-full text-center kinetic-gradient text-primary-on px-5 py-3 rounded-xl font-headline font-bold text-sm transition-all active:scale-95 hover:shadow-glow-emerald mt-2"
            >
              Get API Keys
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Main content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="w-full pt-20 sm:pt-32 pb-12 sm:pb-16 bg-surface border-t border-white/5">
      <div
        class="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left"
      >
        <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div class="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4">
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
              href="https://x.com/gonka_cn?s=21"
              target="_blank"
              rel="noreferrer"
              class="text-text-muted hover:text-primary-container transition-all hover:scale-110"
              aria-label="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
            <a
              href="https://t.me/gonka_cn"
              target="_blank"
              rel="noreferrer"
              class="text-text-muted hover:text-primary-container transition-all hover:scale-110"
              aria-label="Telegram"
            >
              <LucideSend class="w-5 h-5" />
            </a>
          </div>

          <a
            href="mailto:contact@gonka-router.com"
            class="text-text-muted hover:text-primary-container transition-all inline-flex items-center gap-2 text-xs sm:text-sm font-medium bg-white/5 px-3 sm:px-4 py-1.5 rounded-full border border-white/5 max-w-full truncate"
          >
            <LucideMail class="w-4 h-4 opacity-60 shrink-0" />
            <span class="truncate">contact@gonka-router.com</span>
          </a>

          <div class="flex items-center gap-4 sm:gap-6 text-xs font-bold text-text-muted">
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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { LucideSun, LucideMoon, LucideSend, LucideMail, LucideMenu, LucideX } from 'lucide-vue-next'

const colorMode = useColorMode()
const route = useRoute()
const scrollProgress = ref(0)
const isMobileMenuOpen = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const onMobileNav = (id) => {
  closeMobileMenu()
  // Allow the menu collapse transition to start before we trigger the scroll,
  // otherwise the navbar height changes mid-scroll and the target lands offset.
  setTimeout(() => scrollTo(id), 50)
}

const handleLogoClick = () => {
  closeMobileMenu()
  if (route.path === '/') scrollTo('hero')
}

const handleScroll = () => {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight
  if (totalHeight <= 0) {
    scrollProgress.value = 0
    return
  }
  // Clamp to [0, 1] so iOS rubber-banding can't push scaleX above 1 and flash.
  const raw = window.scrollY / totalHeight
  scrollProgress.value = Math.max(0, Math.min(1, raw))
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// Close the mobile menu when navigating between routes so it never lingers.
watch(() => route.fullPath, () => closeMobileMenu())

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  overflow: hidden;
}
.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
