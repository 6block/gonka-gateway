<template>
  <div
    class="flex flex-col lg:flex-row h-screen bg-surface text-text-main font-body selection:bg-primary-container selection:text-primary-on relative overflow-hidden"
  >
    <!-- Left edge accent line (hidden on mobile to free up edge) -->
    <div class="hidden lg:block absolute left-0 top-0 bottom-0 w-[3px] bg-[#5b56f1] z-30"></div>

    <!-- Mobile top bar -->
    <header
      class="lg:hidden flex items-center justify-between gap-3 px-4 h-14 shrink-0 bg-surface-container-low border-b border-white/5 z-30"
    >
      <NuxtLink to="/" class="flex items-center gap-2 min-w-0" @click="closeDrawer">
        <span
          class="text-base font-black text-primary-container font-headline tracking-tighter truncate"
        >
          GonkaRouter
        </span>
      </NuxtLink>

      <div class="flex items-center gap-1.5">
        <button
          @click="toggleColorMode"
          class="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-primary-container hover:bg-white/5 transition-all"
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          <LucideSun v-if="colorMode.value === 'light'" class="w-5 h-5" />
          <LucideMoon v-else class="w-5 h-5" />
        </button>
        <button
          v-if="!auth.isLoggedIn"
          @click="openLogin"
          class="h-9 kinetic-gradient text-primary-on px-3 rounded-lg font-black text-[11px] tracking-tight flex items-center gap-1.5 shadow-lg shadow-primary-container/20"
        >
          <LucideLogIn class="w-3.5 h-3.5" />
          Sign In
        </button>
        <button
          @click="toggleDrawer"
          class="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-main hover:bg-white/5 transition-all"
          :aria-expanded="isDrawerOpen"
          aria-controls="mobile-drawer"
          aria-label="Open menu"
        >
          <LucideX v-if="isDrawerOpen" class="w-5 h-5" />
          <LucideMenu v-else class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Mobile drawer overlay -->
    <Transition name="modal-fade">
      <div
        v-if="isDrawerOpen"
        class="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        @click="closeDrawer"
        aria-hidden="true"
      ></div>
    </Transition>

    <!-- Sidebar (drawer on mobile / fixed on desktop) -->
    <aside
      id="mobile-drawer"
      class="fixed lg:static top-0 left-0 h-full w-72 max-w-[85vw] lg:w-64 bg-surface-container-low border-r border-white/5 flex flex-col p-6 z-50 lg:z-20 shrink-0 transform transition-transform duration-300 ease-out lg:translate-x-0"
      :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      aria-label="Primary navigation"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between mb-8">
        <NuxtLink to="/" class="px-2 group cursor-pointer block" @click="closeDrawer">
          <span
            class="text-xl font-black text-primary-container font-headline tracking-tighter block group-hover:scale-105 transition-transform origin-left animate-pulse-soft"
          >
            GonkaRouter
          </span>
          <p class="text-[9px] font-black text-text-muted tracking-[0.2em] mt-1 uppercase">
            AI Inference Gateway
          </p>
        </NuxtLink>
        <button
          @click="closeDrawer"
          class="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-white/5 transition-all"
          aria-label="Close menu"
        >
          <LucideX class="w-5 h-5" />
        </button>
      </div>

      <div class="h-px bg-white/5 mb-8 mx-2"></div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="closeDrawer"
          class="nav-item w-full flex items-center gap-4 px-5 py-3.5 rounded-full font-bold text-[13px] tracking-tight transition-all relative group text-text-muted hover:text-text-main hover:bg-white/5 hover:translate-x-1"
          active-class="!bg-primary-container/10 !text-primary-container"
        >
          <component :is="link.icon" class="w-5 h-5 transition-colors" />
          <span>{{ link.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Bottom section -->
      <div class="mt-auto space-y-6 pt-6">
        <template v-if="!auth.isLoggedIn">
          <div class="flex items-center gap-2">
            <button
              @click="toggleColorMode"
              class="hidden lg:flex w-11 h-11 items-center justify-center rounded-xl bg-surface-container-high text-text-muted hover:text-primary-container hover:bg-white/10 transition-all border border-white/5 shrink-0"
              title="Toggle theme"
            >
              <LucideSun v-if="colorMode.value === 'light'" class="w-5 h-5" />
              <LucideMoon v-else class="w-5 h-5" />
            </button>
            <button
              @click="openLogin"
              class="flex-1 h-11 kinetic-gradient text-primary-on px-4 rounded-xl font-black text-[13px] tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-container/20 whitespace-nowrap hover:shadow-glow-emerald"
            >
              <LucideLogIn class="w-4 h-4" />
              Sign In
            </button>
          </div>
        </template>
        <template v-else>
          <div
            class="flex items-center justify-between bg-surface-container-high p-3 rounded-2xl border border-white/5"
          >
            <div class="flex items-center gap-2.5 mr-3 min-w-0">
              <img
                v-if="auth.user?.avatarUrl"
                :src="auth.user.avatarUrl"
                alt=""
                referrerpolicy="no-referrer"
                class="w-8 h-8 rounded-full border border-white/10 object-cover shrink-0"
              />
              <div
                v-else
                class="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center text-text-muted shrink-0"
              >
                <LucideUser class="w-4 h-4" />
              </div>
              <div class="min-w-0">
                <p
                  class="text-[12px] font-black font-headline text-text-main tracking-tight truncate"
                  :title="auth.displayName"
                >
                  {{ auth.displayName }}
                </p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse"></span>
                  <p
                    class="text-[9px] font-black text-primary-container tracking-[0.1em] uppercase leading-none"
                  >
                    Signed in
                  </p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-0.5 shrink-0">
              <button
                @click="logout"
                class="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Sign out"
              >
                <LucideLogOut class="w-4 h-4" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto bg-surface relative h-full min-w-0">
      <slot />
    </main>

  </div>
</template>

<script setup>
import {
  LucideLayoutDashboard,
  LucideMessageCircle,
  LucideHistory,
  LucideCpu,
  LucideSun,
  LucideMoon,
  LucideLogOut,
  LucideLogIn,
  LucideCreditCard,
  LucideUser,
  LucideX,
  LucideMenu
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import { useLoginModal } from '~/composables/useLoginModal'

const colorMode = useColorMode()
const auth = useAuthStore()
const toast = useToast()
const route = useRoute()
const { open: openLoginModal } = useLoginModal()
const isDrawerOpen = ref(false)

const openLogin = () => {
  closeDrawer()
  openLoginModal()
}

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

// Lock body scroll while the drawer is open so the underlying page doesn't
// scroll behind the overlay on mobile.
watch(isDrawerOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

// Close the drawer whenever the route changes.
watch(
  () => route.fullPath,
  () => closeDrawer()
)

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LucideLayoutDashboard },
  { to: '/chat', label: 'Chat', icon: LucideMessageCircle },
  { to: '/models', label: 'Models', icon: LucideCpu },
  { to: '/deposit', label: 'Deposit', icon: LucideCreditCard },
  { to: '/transactions', label: 'Transactions', icon: LucideHistory }
]

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

// Refresh email/avatar/balance from the backend on load when a cookie token
// survived a reload but the in-memory profile is stale.
onMounted(() => {
  if (auth.isLoggedIn) auth.fetchUserInfo()
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

function logout() {
  auth.logout()
  toast.info('Signed out')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
