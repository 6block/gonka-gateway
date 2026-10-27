import {
  Color,
  Euler,
  Group,
  MathUtils,
  Matrix3,
  Matrix4,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import { DEFAULT_FLUID, FluidSim, type FluidConfig } from './fluid'
import { ParticleField } from './particles'
import type { HeroTier } from './capability'

export type { HeroTier } from './capability'

export interface ParticleHero {
  /** Pointer position in CSS px relative to the canvas. */
  pointer(x: number, y: number): void
  resize(): void
  setActive(active: boolean): void
  dispose(): void
}

export interface HeroOptions {
  canvas: HTMLCanvasElement
  tier: HeroTier
  accent: string
  /** Horizontal shift of the form's centre, as a fraction of canvas width. */
  shiftX?: number
  /** Vertical shift of the form's centre, as a fraction of canvas height (+ = up). */
  shiftY?: number
  /** Size multiplier for the form at or above `wideFrom` px of canvas width. */
  wideScale?: number
  wideFrom?: number
  onReady?: () => void
  onLost?: () => void
}

interface TierSpec {
  side: number
  dprCap: number
  pointBoost: number
  fluid: Partial<FluidConfig>
}

const TIERS: Record<HeroTier, TierSpec> = {
  high: { side: 512, dprCap: 2, pointBoost: 1, fluid: {} },
  mid: { side: 320, dprCap: 1.5, pointBoost: 1.35, fluid: { simResolution: 192, dyeResolution: 384 } },
  low: { side: 160, dprCap: 1.25, pointBoost: 2, fluid: { simResolution: 128, dyeResolution: 256 } }
}

const BASE_CAMERA = new Vector3(-1.17, 0, 6)
const GAZE_LERP = 0.05
const PREWARM_STEPS = 180
const PREWARM_PER_FRAME = 20
const SPLAT_IDLE_MS = 50
const REFERENCE_HEIGHT = 900
const SWAY_SPEED = new Vector3(0.13, 0.09, 0.07)
const SWAY_AMP = new Vector3(0.05, 0.08, 0.03)

const clampMap = (v: number, inMax: number, outMax: number) =>
  MathUtils.clamp(v / inMax, 0, 1) * outMax

export function createParticleHero(opts: HeroOptions): ParticleHero {
  const { canvas, tier } = opts
  const spec = TIERS[tier]
  const shiftX = opts.shiftX ?? 0
  const shiftY = opts.shiftY ?? 0
  const wideScale = opts.wideScale ?? 1
  const wideFrom = opts.wideFrom ?? Infinity

  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 1)

  const camera = new PerspectiveCamera(30, 1, 0.1, 1000)
  camera.position.copy(BASE_CAMERA)
  camera.lookAt(0, 0, 0)

  const scene = new Scene()
  const group = new Group()
  group.position.set(0.343, 0.16, -1)
  const BASE_ROTATION = new Euler(MathUtils.degToRad(-28.4), MathUtils.degToRad(390), MathUtils.degToRad(4.92))
  group.rotation.copy(BASE_ROTATION)
  const BASE_SCALE = new Vector3(5, 5, 6)
  group.scale.copy(BASE_SCALE)
  scene.add(group)

  const fluid = new FluidSim(renderer, { ...DEFAULT_FLUID, ...spec.fluid })
  const field = new ParticleField(renderer, spec.side, new Color(opts.accent))
  group.add(field.points)

  const viewProj = new Matrix4()
  const flowToLocal = new Matrix3()
  const groupRotInv = new Matrix4()
  const camRot = new Matrix4()
  const target = new Vector3()

  const mouse = { x: -1, y: -1, px: -1, py: -1, has: false, lastSplat: 0 }
  const from = new Vector2()
  const to = new Vector2()
  const force = new Vector2()

  let width = 1
  let height = 1
  let raf = 0
  let active = true
  let disposed = false
  let lastTime = performance.now()
  let elapsed = 0
  let prewarmed = 0

  function resize(): void {
    width = Math.max(1, canvas.clientWidth)
    height = Math.max(1, canvas.clientHeight)
    const dpr = Math.min(window.devicePixelRatio || 1, spec.dprCap)
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.setViewOffset(width, height, -shiftX * width, shiftY * height, width, height)
    camera.updateProjectionMatrix()
    fluid.aspect = width / height
    const formScale = width >= wideFrom ? wideScale : 1
    group.scale.copy(BASE_SCALE).multiplyScalar(formScale)
    field.setPointScale(dpr, (height / REFERENCE_HEIGHT) * spec.pointBoost * formScale)
  }

  function updateCamera(): void {
    const nx = mouse.has ? (mouse.x / width) * 2 - 1 : 0
    const ny = mouse.has ? (mouse.y / height) * 2 - 1 : 0
    target.set(BASE_CAMERA.x - nx, BASE_CAMERA.y + ny * 2, BASE_CAMERA.z)
    camera.position.lerp(target, GAZE_LERP)
    camera.lookAt(0, 0, 0)
    camera.updateMatrixWorld()
  }

  function feedPointer(now: number): void {
    if (!mouse.has) return
    if (mouse.px < 0) {
      mouse.px = mouse.x
      mouse.py = mouse.y
      return
    }
    const dx = mouse.x - mouse.px
    const dy = mouse.y - mouse.py
    const len = Math.hypot(dx, dy)
    if (len > 0.01) {
      const fresh = now - mouse.lastSplat > SPLAT_IDLE_MS
      const radius = clampMap(len, 5, 60) * (tier === 'low' ? 0.48 : 0.6)
      const mult = clampMap(len, 15, 10)
      to.set(mouse.x / width, 1 - mouse.y / height)
      if (fresh) from.copy(to)
      else from.set(mouse.px / width, 1 - mouse.py / height)
      force.set(dx * mult, -dy * mult)
      fluid.splat({ from, to, force, radius: radius / 200 })
      mouse.lastSplat = now
    }
    mouse.px = mouse.x
    mouse.py = mouse.y
  }

  // The whole form rocks a few degrees on long, unrelated periods, so the
  // cloud keeps breathing while the cursor is still.
  function sway(): void {
    group.rotation.set(
      BASE_ROTATION.x + Math.sin(elapsed * SWAY_SPEED.x) * SWAY_AMP.x,
      BASE_ROTATION.y + Math.sin(elapsed * SWAY_SPEED.y + 1.3) * SWAY_AMP.y,
      BASE_ROTATION.z + Math.sin(elapsed * SWAY_SPEED.z + 2.1) * SWAY_AMP.z
    )
  }

  function simulate(hz: number): void {
    viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    group.updateMatrixWorld()
    camRot.extractRotation(camera.matrixWorld)
    groupRotInv.extractRotation(group.matrixWorld).invert()
    flowToLocal.setFromMatrix4(groupRotInv.multiply(camRot))
    field.step({
      time: elapsed,
      hz,
      velocity: fluid.velocityTexture,
      density: fluid.densityTexture,
      viewProj,
      model: group.matrixWorld,
      flowToLocal
    })
  }

  function frame(now: number): void {
    if (disposed) return
    raf = requestAnimationFrame(frame)
    const dt = Math.min((now - lastTime) / 1000, 0.1)
    lastTime = now

    // Form the shape off-screen first, so the canvas fades in already composed.
    if (prewarmed < PREWARM_STEPS) {
      updateCamera()
      for (let i = 0; i < PREWARM_PER_FRAME && prewarmed < PREWARM_STEPS; i++, prewarmed++) {
        elapsed += 1 / 60
        simulate(1)
      }
      if (prewarmed >= PREWARM_STEPS) {
        field.settle()
        opts.onReady?.()
      }
      renderer.setRenderTarget(null)
      renderer.render(scene, camera)
      return
    }

    if (!active) return
    elapsed += dt
    const hz = MathUtils.clamp(dt * 60, 0.25, 3)

    feedPointer(now)
    fluid.step()
    sway()
    updateCamera()
    simulate(hz)

    renderer.setRenderTarget(null)
    renderer.render(scene, camera)
  }

  function onContextLost(e: Event): void {
    e.preventDefault()
    cancelAnimationFrame(raf)
    disposed = true
    opts.onLost?.()
  }
  canvas.addEventListener('webglcontextlost', onContextLost)

  resize()
  raf = requestAnimationFrame(frame)

  // Dev-only probe: sample settled positions so motion at rest can be measured.
  if (import.meta.dev) {
    ;(window as unknown as { __heroProbe?: () => Float32Array }).__heroProbe = () =>
      field.samplePositions(64)
  }

  return {
    pointer(x, y) {
      mouse.x = x
      mouse.y = y
      mouse.has = true
    },
    resize,
    setActive(next) {
      if (next && !active) lastTime = performance.now()
      active = next
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      fluid.dispose()
      field.dispose()
      renderer.dispose()
    }
  }
}
