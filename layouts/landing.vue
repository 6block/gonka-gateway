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

        <div class="hidden md:flex items-center gap-8">
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
          <NuxtLink
            to="/blog"
            class="text-text-muted hover:text-text-main transition-colors font-headline font-bold text-sm hover:-translate-y-0.5"
          >
            Blog
          </NuxtLink>
          <NuxtLink
            to="/feedback"
            class="text-text-muted hover:text-text-main transition-colors font-headline font-bold text-sm hover:-translate-y-0.5"
          >
            Feedback
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

          <!-- Landing pages are SWR-cached and rendered without cookies (see
               routeRules in nuxt.config.ts), so the server always emits the
               signed-out state. Resolve login state on the client only, with
               the Sign In button as the SSR/pre-hydration fallback. -->
          <ClientOnly>
            <button
              v-if="!auth.isLoggedIn"
              @click="openLogin"
              class="hidden sm:inline-flex items-center px-5 py-2 rounded-full font-headline font-bold text-xs sm:text-sm text-text-main bg-surface-container-high border border-white/10 hover:bg-white/10 transition-all whitespace-nowrap"
            >
              Sign In
            </button>
            <NuxtLink
              v-else
              to="/dashboard"
              class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full font-headline font-bold text-xs sm:text-sm text-text-main bg-surface-container-high border border-white/10 hover:bg-white/10 transition-all whitespace-nowrap"
            >
              <img
                v-if="auth.user?.avatarUrl"
                :src="auth.user.avatarUrl"
                referrerpolicy="no-referrer"
                class="w-5 h-5 rounded-full"
                alt=""
              />
              <span class="max-w-[140px] truncate">{{ auth.displayName }}</span>
            </NuxtLink>
            <template #fallback>
              <button
                @click="openLogin"
                class="hidden sm:inline-flex items-center px-5 py-2 rounded-full font-headline font-bold text-xs sm:text-sm text-text-main bg-surface-container-high border border-white/10 hover:bg-white/10 transition-all whitespace-nowrap"
              >
                Sign In
              </button>
            </template>
          </ClientOnly>

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
              to="/blog"
              @click="closeMobileMenu"
              class="block w-full text-left px-4 py-3 rounded-xl text-text-muted hover:text-text-main hover:bg-white/5 font-headline font-bold text-sm transition-all"
            >
              Blog
            </NuxtLink>
            <NuxtLink
              to="/feedback"
              @click="closeMobileMenu"
              class="block w-full text-left px-4 py-3 rounded-xl text-text-muted hover:text-text-main hover:bg-white/5 font-headline font-bold text-sm transition-all"
            >
              Feedback
            </NuxtLink>
            <button
              v-if="!auth.isLoggedIn"
              @click="openLogin"
              class="block w-full text-center text-text-main bg-surface-container-high border border-white/10 px-5 py-3 rounded-xl font-headline font-bold text-sm transition-all hover:bg-white/10 mt-2"
            >
              Sign In
            </button>
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
    <footer class="w-full bg-surface border-t border-white/5">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-8 sm:pb-10">
        <!-- Top grid -->
        <div class="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-12 pb-12 sm:pb-14 border-b border-white/5">
          <!-- Brand -->
          <div class="col-span-2 md:col-span-1">
            <span class="text-xl font-black text-primary-container font-headline tracking-tighter">GonkaRouter</span>
            <p class="text-text-muted text-xs mt-2 mb-5 font-body leading-relaxed">
              AI Model Router on the Gonka Network
            </p>
            <a
              href="mailto:contact@gonka-router.com"
              class="inline-flex items-center gap-2 text-text-muted hover:text-primary-container text-xs transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/5"
            >
              <LucideMail class="w-3.5 h-3.5 shrink-0" />
              contact@gonka-router.com
            </a>
          </div>

          <!-- MENU -->
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-5">Menu</p>
            <nav class="flex flex-col gap-3">
              <NuxtLink to="/" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Home</NuxtLink>
              <NuxtLink to="/#features" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Features</NuxtLink>
              <NuxtLink to="/docs" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Docs</NuxtLink>
              <NuxtLink to="/blog" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Blog</NuxtLink>
              <NuxtLink to="/feedback" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Feedback</NuxtLink>
              <NuxtLink to="/pricing" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Pricing</NuxtLink>
            </nav>
          </div>

          <!-- SERVICE -->
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-5">Service</p>
            <nav class="flex flex-col gap-3">
              <NuxtLink to="/dashboard" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Dashboard</NuxtLink>
              <NuxtLink to="/chat" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Chat</NuxtLink>
              <NuxtLink to="/models" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Models</NuxtLink>
              <NuxtLink to="/transactions" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Transactions</NuxtLink>
            </nav>
          </div>

          <!-- LEGAL -->
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-5">Legal</p>
            <nav class="flex flex-col gap-3">
              <NuxtLink to="/privacy-policy" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Privacy Policy</NuxtLink>
              <NuxtLink to="/terms-of-service" class="text-xs font-bold text-text-main hover:text-primary-container transition-colors">Terms of Service</NuxtLink>
            </nav>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-[11px] text-text-muted font-body order-2 sm:order-1">
            Copyright 2026 GonkaRouter. Built for the Gonka Network.
          </p>
          <div class="flex items-center gap-5 order-1 sm:order-2">
            <a
              href="https://x.com/gonka_cn?s=21"
              target="_blank"
              rel="noreferrer"
              class="text-text-muted hover:text-primary-container transition-all hover:scale-110"
              aria-label="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://t.me/gonka_cn"
              target="_blank"
              rel="noreferrer"
              class="text-text-muted hover:text-primary-container transition-all hover:scale-110"
              aria-label="Telegram"
            >
              <LucideSend class="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@GonkaRouter"
              target="_blank"
              rel="noreferrer"
              class="text-text-muted hover:text-primary-container transition-all hover:scale-110"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/carol-gao-71b158422/overlay/contact-info/"
              target="_blank"
              rel="noreferrer"
              class="text-text-muted hover:text-primary-container transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
            <a
              href="https://discord.gg/pAbxwbzbDZ"
              target="_blank"
              rel="noreferrer"
              class="text-text-muted hover:text-primary-container transition-all hover:scale-110"
              aria-label="Discord"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.947 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { LucideSun, LucideMoon, LucideSend, LucideMail, LucideMenu, LucideX } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useLoginModal } from '~/composables/useLoginModal'

const colorMode = useColorMode()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { open: openLoginModal } = useLoginModal()

const scrollProgress = ref(0)
const isMobileMenuOpen = ref(false)

const openLogin = () => {
  closeMobileMenu()
  openLoginModal()
}

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

const scrollTo = async (id) => {
  // On a non-home route the target section isn't in the DOM, so navigate home
  // first, then scroll once the home page has rendered.
  if (route.path !== '/') {
    await router.push({ path: '/', hash: `#${id}` })
    await nextTick()
    // Give the home page (with async sections) a moment to mount before scrolling.
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 350)
    return
  }
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// Close the mobile menu when navigating between routes so it never lingers.
watch(() => route.fullPath, () => closeMobileMenu())

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  // Refresh the cached profile so the logged-in chip shows the latest email/avatar.
  if (auth.isLoggedIn) auth.fetchUserInfo()
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
