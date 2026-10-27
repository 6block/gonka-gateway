// Decides, without loading three, whether this device should run the particle
// hero and at what size. Anything that fails a check keeps the static poster.

export type HeroTier = 'high' | 'mid' | 'low'

const MIN_WIDTH = 768
const HIGH_CORES = 8

export function detectHeroTier(force = false): HeroTier | null {
  if (typeof window === 'undefined') return null
  const mq = (q: string) => window.matchMedia(q).matches

  if (!force) {
    if (mq('(prefers-reduced-motion: reduce)')) return null
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return null
    if (window.innerWidth < MIN_WIDTH) return null
  }

  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2')
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) return null
  gl.getExtension('WEBGL_lose_context')?.loseContext()

  const finePointer = mq('(pointer: fine)')
  if (!finePointer) return 'low'
  const cores = navigator.hardwareConcurrency || 4
  return cores >= HIGH_CORES ? 'high' : 'mid'
}
