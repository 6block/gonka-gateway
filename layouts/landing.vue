<template>
  <div class="landing" :class="{ 'landing--home': isHome }">
    <!-- Navbar -->
    <nav class="lnav" :class="{ 'lnav--solid': !isHome || scrolled || isMobileMenuOpen }" aria-label="Main navigation">
      <div
        class="lnav__progress"
        :style="{ transform: `scaleX(${scrollProgress})` }"
        aria-hidden="true"
      ></div>
      <div class="lnav__row">
        <NuxtLink to="/" class="lnav__brand" @click="handleLogoClick">
          <img src="/gonkaIcon.png" alt="" width="28" height="28" class="lnav__mark" />
          <span class="lnav__name">GonkaRouter</span>
        </NuxtLink>

        <div class="lnav__links">
          <button type="button" class="lnav__link" @click="scrollTo('features')">Features</button>
          <button type="button" class="lnav__link" @click="scrollTo('models')">Models</button>
          <NuxtLink to="/pricing" class="lnav__link">Pricing</NuxtLink>
          <NuxtLink to="/docs" class="lnav__link">Docs</NuxtLink>
          <NuxtLink to="/blog" class="lnav__link">Blog</NuxtLink>
          <NuxtLink to="/feedback" class="lnav__link">Feedback</NuxtLink>
        </div>

        <div class="lnav__actions">
          <button
            v-if="!isHome"
            type="button"
            class="lnav__icon"
            title="Toggle theme"
            aria-label="Toggle theme"
            @click="toggleColorMode"
          >
            <LucideSun v-if="colorMode.value === 'light'" class="w-4 h-4" />
            <LucideMoon v-else class="w-4 h-4" />
          </button>

          <!-- Landing pages are SWR-cached and rendered without cookies (see
               routeRules in nuxt.config.ts), so the server always emits the
               signed-out state. Resolve login state on the client only, with
               the Sign In button as the SSR/pre-hydration fallback. -->
          <ClientOnly>
            <button v-if="!auth.isLoggedIn" type="button" class="lbtn lbtn--ghost lnav__desk" @click="openLogin">
              Sign In
            </button>
            <NuxtLink v-else to="/dashboard" class="lbtn lbtn--ghost lnav__desk">
              <img
                v-if="auth.user?.avatarUrl"
                :src="auth.user.avatarUrl"
                referrerpolicy="no-referrer"
                class="w-4 h-4 rounded-full"
                alt=""
              />
              <span class="max-w-[140px] truncate normal-case">{{ auth.displayName }}</span>
            </NuxtLink>
            <template #fallback>
              <button type="button" class="lbtn lbtn--ghost lnav__desk" @click="openLogin">Sign In</button>
            </template>
          </ClientOnly>

          <NuxtLink to="/dashboard" class="lbtn lbtn--primary lnav__desk">Get API Keys</NuxtLink>

          <button
            type="button"
            class="lnav__icon lnav__burger"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="landing-mobile-menu"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
            @click="toggleMobileMenu"
          >
            <LucideX v-if="isMobileMenuOpen" class="w-5 h-5" />
            <LucideMenu v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile menu panel -->
      <Transition name="menu-slide">
        <div v-if="isMobileMenuOpen" id="landing-mobile-menu" class="lnav__sheet">
          <button type="button" class="lnav__sheet-link" @click="onMobileNav('features')">Features</button>
          <button type="button" class="lnav__sheet-link" @click="onMobileNav('models')">Models</button>
          <NuxtLink to="/pricing" class="lnav__sheet-link" @click="closeMobileMenu">Pricing</NuxtLink>
          <NuxtLink to="/docs" class="lnav__sheet-link" @click="closeMobileMenu">Docs</NuxtLink>
          <NuxtLink to="/blog" class="lnav__sheet-link" @click="closeMobileMenu">Blog</NuxtLink>
          <NuxtLink to="/feedback" class="lnav__sheet-link" @click="closeMobileMenu">Feedback</NuxtLink>
          <div class="lnav__sheet-actions">
            <button v-if="!auth.isLoggedIn" type="button" class="lbtn lbtn--ghost" @click="openLogin">Sign In</button>
            <NuxtLink to="/dashboard" class="lbtn lbtn--primary" @click="closeMobileMenu">Get API Keys</NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Main content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="lfoot">
      <div class="lfoot__inner">
        <div class="lfoot__grid">
          <div class="lfoot__brand">
            <span class="lfoot__name">GonkaRouter</span>
            <p class="lfoot__tag">AI model router on the Gonka Network</p>
            <a href="mailto:contact@gonka-router.com" class="lfoot__mail">
              <LucideMail class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              contact@gonka-router.com
            </a>
          </div>

          <nav v-for="col in footerColumns" :key="col.label" class="lfoot__col" :aria-label="col.label">
            <h2 class="lfoot__head">[{{ col.label }}]</h2>
            <NuxtLink v-for="link in col.links" :key="link.to" :to="link.to" class="lfoot__link">
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>

        <div class="lfoot__bar">
          <p class="lfoot__copy">© 2026 GonkaRouter. Built for the Gonka Network.</p>
          <div class="lfoot__social">
            <a href="https://x.com/gonka_cn?s=21" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://t.me/gonka_cn" target="_blank" rel="noreferrer" aria-label="Telegram">
              <LucideSend class="w-4 h-4" aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/@GonkaRouter" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/carol-gao-71b158422/overlay/contact-info/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
            <a href="https://discord.gg/pAbxwbzbDZ" target="_blank" rel="noreferrer" aria-label="Discord">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
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
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { LucideSun, LucideMoon, LucideSend, LucideMail, LucideMenu, LucideX } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useLoginModal } from '~/composables/useLoginModal'

const SCROLLED_THRESHOLD_PX = 24

const colorMode = useColorMode()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { open: openLoginModal } = useLoginModal()

const isHome = computed(() => route.path === '/')
const scrollProgress = ref(0)
const scrolled = ref(false)
const isMobileMenuOpen = ref(false)

const footerColumns = [
  {
    label: 'menu',
    links: [
      { to: '/', label: 'Home' },
      { to: '/#features', label: 'Features' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/docs', label: 'Docs' },
      { to: '/blog', label: 'Blog' },
      { to: '/feedback', label: 'Feedback' }
    ]
  },
  {
    label: 'service',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/chat', label: 'Chat' },
      { to: '/models', label: 'Models' },
      { to: '/transactions', label: 'Transactions' }
    ]
  },
  {
    label: 'legal',
    links: [
      { to: '/privacy-policy', label: 'Privacy Policy' },
      { to: '/terms-of-service', label: 'Terms of Service' }
    ]
  }
]

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
  scrolled.value = window.scrollY > SCROLLED_THRESHOLD_PX
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
.landing {
  min-height: 100vh;
  background: var(--surface);
  color: var(--text-main);
  font-family: var(--font-mono);
}
.landing--home {
  background: #000;
}

/* ── Nav ──────────────────────────────────────────────────────────────────── */
.lnav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  border-bottom: 1px solid transparent;
  transition:
    background-color var(--duration-normal) var(--ease-out-expo),
    border-color var(--duration-normal) var(--ease-out-expo),
    backdrop-filter var(--duration-normal) var(--ease-out-expo);
}
.lnav--solid {
  background: color-mix(in srgb, var(--surface) 78%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom-color: var(--line);
}
.landing--home .lnav--solid {
  background: rgb(0 0 0 / 0.72);
}
.lnav__progress {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 1px;
  background: var(--primary-container);
  transform-origin: left;
}
.lnav__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 14px var(--gutter);
}
.lnav__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: var(--text-main);
}
.lnav__mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.lnav__name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.lnav__links {
  display: none;
  align-items: center;
  gap: 4px;
}
.lnav__link {
  padding: 6px 10px;
  font-size: var(--text-ui);
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--text-muted);
  border-radius: 2px;
  transition: color var(--duration-fast) ease, background-color var(--duration-fast) ease;
}
.lnav__link:hover,
.lnav__link.router-link-exact-active {
  color: var(--text-main);
}
.lnav__link:hover {
  background: var(--chip);
}
.lnav__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.lnav__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 2px;
  color: var(--text-muted);
  transition: color var(--duration-fast) ease, background-color var(--duration-fast) ease;
}
.lnav__icon:hover {
  color: var(--text-main);
  background: var(--chip);
}
.lnav__desk {
  display: none;
}
.lnav__sheet {
  display: grid;
  gap: 2px;
  padding: 8px var(--gutter) 20px;
  border-top: 1px solid var(--line);
}
.lnav__sheet-link {
  padding: 14px 0;
  text-align: left;
  font-size: 13px;
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--text-main);
  border-bottom: 1px solid var(--line);
}
.lnav__sheet-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 16px;
}

@media (min-width: 640px) {
  .lnav__desk {
    display: inline-flex;
  }
  .lnav__sheet-actions {
    display: none;
  }
}
@media (min-width: 900px) {
  .lnav__links {
    display: flex;
  }
  .lnav__burger,
  .lnav__sheet {
    display: none;
  }
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
.lfoot {
  border-top: 1px solid var(--line);
}
.lfoot__inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 64px var(--gutter) 28px;
}
.lfoot__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px 24px;
  padding-bottom: 48px;
}
.lfoot__brand {
  grid-column: 1 / -1;
}
.lfoot__name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.lfoot__tag {
  margin: 6px 0 20px;
  font-size: var(--text-ui);
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--text-muted);
}
.lfoot__mail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--text-main);
  background: var(--chip);
  border-radius: 2px;
  transition: color var(--duration-fast) ease;
}
.lfoot__mail:hover {
  color: var(--primary-container);
}
.lfoot__col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.lfoot__head {
  margin-bottom: 6px;
  font-size: var(--text-ui);
  font-weight: 500;
  letter-spacing: var(--track-ui);
  color: var(--primary-container);
}
.lfoot__link {
  width: fit-content;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 4px;
  transition: color var(--duration-fast) ease, text-decoration-color var(--duration-fast) ease;
}
.lfoot__link:hover {
  color: var(--text-main);
  text-decoration-color: currentColor;
}
.lfoot__bar {
  display: flex;
  flex-direction: column-reverse;
  gap: 20px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
.lfoot__copy {
  font-size: 11px;
  letter-spacing: var(--track-ui);
  text-transform: uppercase;
  color: var(--text-muted);
}
.lfoot__social {
  display: flex;
  align-items: center;
  gap: 20px;
}
.lfoot__social a {
  color: var(--text-muted);
  transition: color var(--duration-fast) ease;
}
.lfoot__social a:hover {
  color: var(--primary-container);
}

@media (min-width: 768px) {
  .lfoot__grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
  .lfoot__brand {
    grid-column: auto;
  }
  .lfoot__bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

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
