<template>
  <canvas ref="canvasRef" class="particle-field" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
// 星空穿越式粒子：光点从画面中心（瞳孔）生成，向镜头飞来、向四周散开；滚动越快飞得越快、拖尾越长
interface Particle {
  x: number
  y: number
  z: number
  size: number
  /** 上一帧的屏幕坐标，用来画拖尾；NaN 表示刚生成 */
  px: number
  py: number
}

const PX_PER_PARTICLE = 9000 // 每个粒子占的屏幕面积（CSS px²）
const MIN_PARTICLES = 40
const MAX_PARTICLES = 160
const SPREAD = 0.5 // 刚生成时分布在画面中间一半的范围内
const Z_NEAR = 0.05
const BASE_SPEED = 0.00012 // 静止时每毫秒的 z 前进量，约 8 秒飞完一程
const SCROLL_BOOST = 0.0004 // 每 px/ms 滚动速度带来的加速
const MAX_BOOST = 0.0016
const BOOST_EASE = 0.1
const MAX_ALPHA = 0.85
const MIN_DT = 1
const MAX_DT = 48
const MAX_DPR = 1.5
const FALLBACK_RGB = '0, 255, 163'

const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let width = 0
let height = 0
let dpr = 1
let rgb = FALLBACK_RGB
let rafId = 0
let lastTime = 0
let lastScrollY = 0
let boost = 0

const newParticle = (z: number): Particle => ({
  x: (Math.random() * 2 - 1) * SPREAD,
  y: (Math.random() * 2 - 1) * SPREAD,
  z,
  size: 0.6 + Math.random() * 1.4,
  px: Number.NaN,
  py: Number.NaN,
})

const resize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
  width = Math.round(canvas.clientWidth * dpr)
  height = Math.round(canvas.clientHeight * dpr)
  canvas.width = width
  canvas.height = height
  // 改尺寸会重置 2D 上下文的状态，每次都要重新设置
  if (ctx) {
    ctx.globalCompositeOperation = 'lighter'
    ctx.lineCap = 'round'
  }
  const area = canvas.clientWidth * canvas.clientHeight
  const count = Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, Math.round(area / PX_PER_PARTICLE)))
  particles = Array.from({ length: count }, () => newParticle(Z_NEAR + Math.random() * (1 - Z_NEAR)))
}

const readBrandColor = () => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--primary-container-rgb').trim()
  const parts = raw.split(/[\s,]+/).filter(Boolean)
  rgb = parts.length === 3 ? parts.join(', ') : FALLBACK_RGB
}

// 每帧原地更新粒子数组（动画循环里避免每帧分配新对象）
const drawFrame = (dz: number) => {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  const cx = width / 2
  const cy = height / 2
  const scale = Math.max(width, height) / 2
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    p.z -= dz
    const sx = cx + (p.x / p.z) * scale
    const sy = cy + (p.y / p.z) * scale
    const isOut = !Number.isFinite(sx) || !Number.isFinite(sy) || sx < 0 || sx > width || sy < 0 || sy > height
    if (p.z <= Z_NEAR || isOut) {
      particles[i] = newParticle(1)
      continue
    }
    const near = 1 - p.z
    ctx.strokeStyle = `rgba(${rgb}, ${(near * MAX_ALPHA).toFixed(3)})`
    ctx.lineWidth = p.size * dpr * (0.4 + near * 1.6)
    ctx.beginPath()
    ctx.moveTo(Number.isNaN(p.px) ? sx : p.px, Number.isNaN(p.py) ? sy : p.py)
    ctx.lineTo(sx, sy)
    ctx.stroke()
    p.px = sx
    p.py = sy
  }
}

const tick = (time: number) => {
  // 两帧时间戳相同时 dt 会是 0，滚动速度变成 NaN 并污染所有粒子坐标，所以下限取 1ms
  const dt = Math.min(MAX_DT, Math.max(MIN_DT, lastTime ? time - lastTime : 16))
  lastTime = time
  const y = window.scrollY
  const scrollSpeed = Math.abs(y - lastScrollY) / dt
  lastScrollY = y
  boost += (Math.min(MAX_BOOST, scrollSpeed * SCROLL_BOOST) - boost) * BOOST_EASE
  if (!Number.isFinite(boost)) boost = 0
  drawFrame((BASE_SPEED + boost) * dt)
  rafId = requestAnimationFrame(tick)
}

const startLoop = () => {
  if (rafId) return
  lastTime = 0
  lastScrollY = window.scrollY
  rafId = requestAnimationFrame(tick)
}

const stopLoop = () => {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

// 切到后台标签页时暂停，回来再继续
const onVisibilityChange = () => (document.hidden ? stopLoop() : startLoop())

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  ctx = canvasRef.value?.getContext('2d') ?? null
  if (!ctx) return
  readBrandColor()
  resize()
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
  startLoop()
})

onBeforeUnmount(() => {
  stopLoop()
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<style scoped>
.particle-field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
