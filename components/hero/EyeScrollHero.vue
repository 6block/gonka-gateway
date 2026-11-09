<template>
  <!-- 整页固定背景：滚到 eyeEndAnchor 区块之前播眼睛推进，之后播隧道；无动效设备只显示海报 -->
  <div class="eye-backdrop" aria-hidden="true">
    <picture>
      <source media="(min-width: 768px)" :srcset="POSTER_DESKTOP" />
      <img
        :src="POSTER_MOBILE"
        class="eye-backdrop__poster"
        :class="{ 'is-hidden': hasCanvasFrame }"
        alt=""
        width="1920"
        height="1080"
        fetchpriority="high"
        decoding="async"
      />
    </picture>
    <canvas v-if="isMotionEnabled" ref="canvasRef" class="eye-backdrop__canvas"></canvas>
    <HeroParticleField />
    <div class="eye-backdrop__vignette"></div>
    <div class="eye-backdrop__dim" :style="{ opacity: dimOpacity }"></div>
  </div>

  <!-- 首屏只占一屏，跟页面一起自然滚走 -->
  <section v-bind="$attrs" class="eye-hero" aria-labelledby="eye-hero-heading">
    <div class="eye-hero__container">
      <div class="eye-hero__intro" :style="introStyle">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
const props = defineProps<{
  /** 眼睛推进在这个区块的顶部到达视口顶部时播完，之后进入隧道 */
  eyeEndAnchor: string
}>()

const EYE_FRAMES = 86
const TUNNEL_FRAMES = 81
const POSTER_DESKTOP = '/hero/eye-poster-desktop.webp'
const POSTER_MOBILE = '/hero/eye-poster-mobile.webp'
const pad = (i: number) => String(i).padStart(3, '0')
const FRAME_URLS = [
  ...Array.from({ length: EYE_FRAMES }, (_, i) => `/hero/eye/${pad(i)}.webp`),
  ...Array.from({ length: TUNNEL_FRAMES }, (_, i) => `/hero/tunnel/${pad(i)}.webp`),
]
// 眼睛原片推进先慢后快，用幂函数把滚动进度映射到帧号，让手感接近匀速；隧道本身匀速，线性映射
const SCRUB_EXPONENT = 0.6
// 背景压暗：滚完首屏时到 EYE_DIM，进入隧道后到 TUNNEL_DIM，保证上面的文字可读
const EYE_DIM = 0.45
const TUNNEL_DIM = 0.6
// 找不到锚点区块时，眼睛推进占 3 屏
const FALLBACK_EYE_SCREENS = 3

// 首屏文案在向下滚动 INTRO_FADE_SCREENS 屏的过程中淡出并上移
const INTRO_FADE_SCREENS = 0.6
const INTRO_FADE_DISTANCE = 40

const canvasRef = ref<HTMLCanvasElement | null>(null)
const dimOpacity = ref(0)
const introFade = ref(0)
let isReducedMotion = false

const introStyle = computed(() =>
  introFade.value === 0
    ? undefined
    : { opacity: 1 - introFade.value, translate: `0 ${-introFade.value * INTRO_FADE_DISTANCE}px` },
)

const { isMotionEnabled } = useHeroMotion()
const { drawFrame, start, loadedCount } = useEyeFrames(canvasRef, FRAME_URLS)
const hasCanvasFrame = computed(() => isMotionEnabled.value && loadedCount.value > 0)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

const eyeEndScroll = (vh: number) => {
  const anchor = document.getElementById(props.eyeEndAnchor)
  return anchor ? anchor.getBoundingClientRect().top + window.scrollY : vh * FALLBACK_EYE_SCREENS
}

let rafId = 0
const update = () => {
  rafId = 0
  const vh = window.innerHeight
  const y = window.scrollY
  const eyeEnd = Math.max(vh, eyeEndScroll(vh))
  const pageEnd = Math.max(eyeEnd + 1, document.documentElement.scrollHeight - vh)

  const inEye = y < eyeEnd
  const tunnelProgress = clamp01((y - eyeEnd) / (pageEnd - eyeEnd))
  dimOpacity.value = inEye
    ? clamp01(y / vh) * EYE_DIM
    : EYE_DIM + (TUNNEL_DIM - EYE_DIM) * clamp01((y - eyeEnd) / vh)

  introFade.value = isReducedMotion ? 0 : clamp01(y / (vh * INTRO_FADE_SCREENS))

  if (!isMotionEnabled.value) return
  const position = inEye
    ? Math.pow(y / eyeEnd, SCRUB_EXPONENT) * (EYE_FRAMES - 1)
    : EYE_FRAMES + tunnelProgress * (TUNNEL_FRAMES - 1)
  drawFrame(position)
}
const onScroll = () => {
  if (!rafId) rafId = requestAnimationFrame(update)
}

watch(isMotionEnabled, async (enabled) => {
  if (!enabled) return
  await nextTick()
  start()
  update()
})

onMounted(() => {
  isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped src="./eye-hero.css"></style>
