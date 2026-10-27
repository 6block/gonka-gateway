<template>
  <div ref="root" class="hero-particles" aria-hidden="true">
    <picture class="hero-particles__poster" :class="{ 'is-hidden': ready }">
      <source media="(max-width: 767px)" :srcset="POSTER_MOBILE" type="image/webp" />
      <img
        :src="POSTER_DESKTOP"
        alt=""
        width="1585"
        height="1000"
        fetchpriority="high"
        decoding="async"
      />
    </picture>
    <canvas v-if="tier" ref="canvas" class="hero-particles__canvas" :class="{ 'is-ready': ready }" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, nextTick } from 'vue'
import { detectHeroTier, type HeroTier } from '~/lib/particle-hero/capability'
import type { ParticleHero } from '~/lib/particle-hero'

const props = withDefaults(
  defineProps<{ accent?: string; shiftX?: number; shiftY?: number; wideScale?: number; wideFrom?: number }>(),
  { accent: '#00ffa3', shiftX: 0, shiftY: 0, wideScale: 1, wideFrom: Infinity }
)

// Served from /public; bound (not literal) so Vite leaves the paths alone.
const POSTER_DESKTOP = '/hero/particles-desktop.webp'
const POSTER_MOBILE = '/hero/particles-mobile.webp'

const root = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const tier = ref<HeroTier | null>(null)
const ready = ref(false)
const hero = shallowRef<ParticleHero | null>(null)

let observer: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
let idleHandle = 0
let inView = true

function feed(clientX: number, clientY: number): void {
  const el = canvas.value
  if (!el || !hero.value) return
  const r = el.getBoundingClientRect()
  if (clientY < r.top || clientY > r.bottom) return
  hero.value.pointer(clientX - r.left, clientY - r.top)
}

const onPointerMove = (e: PointerEvent) => feed(e.clientX, e.clientY)
const onTouch = (e: TouchEvent) => {
  const t = e.touches[0]
  if (t) feed(t.clientX, t.clientY)
}
const syncActive = () => hero.value?.setActive(inView && document.visibilityState === 'visible')

function fallback(): void {
  hero.value?.dispose()
  hero.value = null
  ready.value = false
  tier.value = null
}

async function boot(): Promise<void> {
  await nextTick()
  const el = canvas.value
  if (!el || !tier.value) return
  try {
    const { createParticleHero } = await import('~/lib/particle-hero')
    hero.value = createParticleHero({
      canvas: el,
      tier: tier.value,
      accent: props.accent,
      shiftX: props.shiftX,
      shiftY: props.shiftY,
      wideScale: props.wideScale,
      wideFrom: props.wideFrom,
      onReady: () => (ready.value = true),
      onLost: fallback
    })
  } catch {
    // Shader compile or context failure: the poster already covers the hero.
    fallback()
    return
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('touchstart', onTouch, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })
  document.addEventListener('visibilitychange', syncActive)

  resizeObserver = new ResizeObserver(() => hero.value?.resize())
  resizeObserver.observe(el)
  observer = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? true
    syncActive()
  })
  if (root.value) observer.observe(root.value)
}

onMounted(() => {
  const force = import.meta.dev && new URLSearchParams(location.search).has('hero-force')
  tier.value = detectHeroTier(force)
  if (!tier.value) return
  const start = () => void boot()
  idleHandle =
    'requestIdleCallback' in window
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 200)
})

onBeforeUnmount(() => {
  if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle)
  else clearTimeout(idleHandle)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('touchstart', onTouch)
  window.removeEventListener('touchmove', onTouch)
  document.removeEventListener('visibilitychange', syncActive)
  observer?.disconnect()
  resizeObserver?.disconnect()
  hero.value?.dispose()
})
</script>

<style scoped>
.hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #000;
}

.hero-particles__poster,
.hero-particles__poster img,
.hero-particles__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-particles__poster img {
  object-fit: cover;
  object-position: 62% 50%;
}

.hero-particles__poster {
  transition: opacity 1.2s var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
}
.hero-particles__poster.is-hidden {
  opacity: 0;
}

.hero-particles__canvas {
  display: block;
  opacity: 0;
  transition: opacity 1.2s var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
}
.hero-particles__canvas.is-ready {
  opacity: 1;
}
</style>
