<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  LucideX,
  LucideCalendarDays,
  LucideMapPin,
  LucideArrowUpRight
} from 'lucide-vue-next'
import { useEventPromo, EVENT_PROMO_CAMPAIGN } from '~/composables/useEventPromo'
import { useLoginModal } from '~/composables/useLoginModal'
import { useAnalytics } from '~/composables/useAnalytics'

const EVENT_URL = 'https://luma.com/d66o016k'

// Long enough for the page to paint and settle before the modal takes over,
// short enough that it still reads as part of the arrival experience.
const SHOW_DELAY_MS = 1200

const promo = useEventPromo()
const { isOpen: loginModalOpen } = useLoginModal()
const { track } = useAnalytics()

const isVisible = ref(false)
const daysLeft = ref(0)

const countdownLabel = computed(() => {
  if (daysLeft.value === 0) return 'Happening today'
  if (daysLeft.value === 1) return 'Tomorrow'
  return `In ${daysLeft.value} days`
})

let showTimer: ReturnType<typeof setTimeout> | null = null
let previousOverflow = ''

function open() {
  // The login and account-upgrade modals own the screen when they are up; a
  // marketing prompt must never stack on top of an auth flow in progress.
  if (loginModalOpen.value) return
  daysLeft.value = promo.daysUntil()
  isVisible.value = true
  lockScroll()
  track('promo_view', { campaign: EVENT_PROMO_CAMPAIGN })
}

// Agenda times come from the event page; showing them turns a flat chip row
// into something that reads like a real programme.
const AGENDA = [
  { time: '14:10', title: 'Gonka & GonkaRouter', highlight: true },
  { time: '14:40', title: 'AI video creation, end to end', highlight: false },
  { time: '15:40', title: 'Roundtable: AGI, compute & decentralization', highlight: false }
]

// Both exit paths are a dismissal: the modal is shown once per browser, so
// closing it — via the X or by heading to the event page — retires the
// campaign for this user.
function close(action: 'dismiss' | 'cta') {
  if (!isVisible.value) return
  isVisible.value = false
  unlockScroll()
  promo.dismiss()
  track(action === 'cta' ? 'promo_click' : 'promo_dismiss', {
    campaign: EVENT_PROMO_CAMPAIGN
  })
}

function openEvent() {
  window.open(EVENT_URL, '_blank', 'noopener,noreferrer')
  close('cta')
}

function lockScroll() {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}
function unlockScroll() {
  document.body.style.overflow = previousOverflow
}

onMounted(() => {
  if (!promo.isEligible()) return
  showTimer = setTimeout(open, SHOW_DELAY_MS)
})

onUnmounted(() => {
  if (showTimer) clearTimeout(showTimer)
  if (isVisible.value) unlockScroll()
})
</script>

<template>
  <Transition name="promo-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[85] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-promo-title"
    >
      <!-- Backdrop is intentionally inert: the X is the only way out, so a
           stray click on the page behind can't silently retire the campaign. -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-xl"></div>

      <div
        class="promo-card relative w-full max-w-[520px] overflow-hidden rounded-3xl border border-outline-variant/25 bg-surface-container-low shadow-2xl animate-scale-in"
      >
        <button
          class="absolute right-3 top-3 z-20 rounded-full bg-black/30 p-2 text-white/60 backdrop-blur transition-all hover:bg-black/50 hover:text-white"
          aria-label="Close"
          @click="close('dismiss')"
        >
          <LucideX class="h-4 w-4" />
        </button>

        <!-- ===== Poster band — deliberately dark in both themes ===== -->
        <div class="promo-poster relative overflow-hidden px-6 pb-6 pt-7 sm:px-8 sm:pb-7">
          <div class="promo-grid pointer-events-none absolute inset-0"></div>
          <div
            class="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#00ffa3]/20 blur-3xl"
          ></div>
          <div
            class="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-[#72dcff]/10 blur-3xl"
          ></div>

          <!-- Oversized date bleeding off the right edge (grid-breaking accent) -->
          <span
            class="pointer-events-none absolute -bottom-4 -right-2 select-none font-headline text-[64px] font-black leading-none tracking-tighter text-white/[0.06] tabular-nums sm:-bottom-5 sm:right-2 sm:text-[104px]"
            aria-hidden="true"
          >
            09.21
          </span>

          <div class="relative z-10">
            <span
              class="inline-flex items-center gap-2 rounded-full border border-[#00ffa3]/30 bg-[#00ffa3]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#00ffa3]"
            >
              <span class="relative flex h-1.5 w-1.5">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ffa3] opacity-75"
                ></span>
                <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00ffa3]"></span>
              </span>
              Shanghai Blockchain Week
            </span>

            <h2
              id="event-promo-title"
              class="mt-4 font-headline text-[34px] font-black leading-[1.05] tracking-tight text-white sm:text-[40px]"
            >
              AI Builders<br />
              <span class="promo-title-accent">Day</span>
            </h2>

            <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              AI &times; Compute &times; Web3
            </p>
          </div>
        </div>

        <!-- ===== Details ===== -->
        <div class="relative border-t border-white/5 px-6 py-6 sm:px-8">
          <div class="flex flex-wrap items-start gap-x-8 gap-y-4">
            <div class="flex items-start gap-3">
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-container/10 text-primary-container"
              >
                <LucideCalendarDays class="h-4 w-4" />
              </span>
              <div>
                <p class="text-[14px] font-bold leading-tight text-text-main">Sep 21, 2026</p>
                <p class="mt-0.5 text-[12.5px] text-text-muted">13:30 – 17:00 (GMT+8)</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-container/10 text-primary-container"
              >
                <LucideMapPin class="h-4 w-4" />
              </span>
              <div>
                <p class="text-[14px] font-bold leading-tight text-text-main">Shanghai</p>
                <p class="mt-0.5 text-[12.5px] text-text-muted">Guotou Building, 15F</p>
              </div>
            </div>
          </div>

          <div class="my-5 h-px bg-outline-variant/20"></div>

          <p class="mb-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
            On stage
          </p>
          <ul class="space-y-2.5">
            <li
              v-for="item in AGENDA"
              :key="item.time"
              class="flex items-baseline gap-3.5 border-l-2 pl-3.5"
              :class="item.highlight ? 'border-primary-container' : 'border-outline-variant/25'"
            >
              <span
                class="w-[38px] shrink-0 font-mono text-[11.5px] tabular-nums"
                :class="item.highlight ? 'text-primary-container' : 'text-text-muted'"
              >
                {{ item.time }}
              </span>
              <span
                class="text-[13px] leading-snug"
                :class="item.highlight ? 'font-bold text-text-main' : 'text-text-muted'"
              >
                {{ item.title }}
              </span>
            </li>
          </ul>

          <p class="mt-5 text-[12.5px] leading-relaxed text-text-muted">
            Hosted by <span class="font-bold text-text-main">6Block</span>, co-hosted by Techub
            News. Around 100 builders, founders and investors on site &mdash; seats are limited.
          </p>

          <button
            class="promo-cta group mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-black text-primary-on transition-all kinetic-gradient hover:scale-[1.01] active:scale-[0.99]"
            @click="openEvent()"
          >
            <span>Reserve your seat</span>
            <LucideArrowUpRight
              class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>

          <p class="mt-3 text-center text-[11px] text-text-muted">
            Free to attend &middot; {{ countdownLabel }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.promo-fade-enter-active,
.promo-fade-leave-active {
  transition: opacity 0.25s ease;
}
.promo-fade-enter-from,
.promo-fade-leave-to {
  opacity: 0;
}

/* The poster keeps a single dark identity in both themes — it is artwork, not
   chrome, so it should not invert with the surface tokens. */
.promo-poster {
  background: radial-gradient(120% 140% at 15% 0%, #10231b 0%, #080b0a 55%, #060707 100%);
}

.promo-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(90% 80% at 20% 10%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(90% 80% at 20% 10%, #000 0%, transparent 75%);
}

.promo-title-accent {
  background: linear-gradient(135deg, #00ef99 0%, #00ffa3 45%, #72dcff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.promo-cta {
  box-shadow: 0 8px 30px rgba(0, 255, 163, 0.18);
}
.promo-cta:hover {
  box-shadow: 0 10px 38px rgba(0, 255, 163, 0.28);
}

@media (prefers-reduced-motion: reduce) {
  .promo-card {
    animation: none;
  }
  .promo-cta,
  .promo-cta:hover {
    transform: none;
  }
}
</style>
