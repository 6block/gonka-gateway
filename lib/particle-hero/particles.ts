import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Camera,
  CanvasTexture,
  Color,
  DataTexture,
  FloatType,
  Matrix3,
  Matrix4,
  Mesh,
  NearestFilter,
  PlaneGeometry,
  Points,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  WebGLRenderTarget,
  WebGLRenderer
} from 'three'
import { FULLSCREEN_VERT, POINTS_FRAG, POINTS_VERT, SIM_FRAG } from './shaders/particles'

const SETTLED_SPRING = 0.025

export interface FieldInputs {
  time: number
  hz: number
  velocity: Texture
  density: Texture
  viewProj: Matrix4
  model: Matrix4
  flowToLocal: Matrix3
}

function randomCube(count: number): Float32Array {
  const data = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    data[i * 4] = Math.random() * 2 - 1
    data[i * 4 + 1] = Math.random() * 2 - 1
    data[i * 4 + 2] = Math.random() * 2 - 1
    data[i * 4 + 3] = 1
  }
  return data
}

function floatTarget(size: number): WebGLRenderTarget {
  return new WebGLRenderTarget(size, size, {
    type: FloatType,
    format: RGBAFormat,
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    depthBuffer: false,
    stencilBuffer: false
  })
}

// A soft grey sphere, drawn once. Stands in for a 64×64 matcap PNG.
function makeMatcap(): Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const g = ctx.createRadialGradient(size * 0.36, size * 0.32, 2, size / 2, size / 2, size / 2)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.35, '#b8b8b8')
    g.addColorStop(0.8, '#3a3a3a')
    g.addColorStop(1, '#141414')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  return tex
}

/** GPU particle positions (ping-pong float texture) plus the Points that draw them. */
export class ParticleField {
  readonly points: Points
  private readonly renderer: WebGLRenderer
  private readonly simScene = new Scene()
  private readonly simCamera = new Camera()
  private readonly simMesh: Mesh
  private readonly simMat: ShaderMaterial
  private readonly drawMat: ShaderMaterial
  private readonly origin: DataTexture
  private readonly matcap: Texture
  private read: WebGLRenderTarget
  private write: WebGLRenderTarget
  private home: WebGLRenderTarget | null = null
  private readonly side: number
  private seeded = false

  constructor(renderer: WebGLRenderer, side: number, accent: Color) {
    this.renderer = renderer
    this.side = side
    const count = side * side

    this.origin = new DataTexture(randomCube(count), side, side, RGBAFormat, FloatType)
    this.origin.needsUpdate = true
    this.read = floatTarget(side)
    this.write = floatTarget(side)

    this.simMat = new ShaderMaterial({
      vertexShader: FULLSCREEN_VERT,
      fragmentShader: SIM_FRAG,
      uniforms: {
        uPositions: { value: this.origin },
        uOrigin: { value: this.origin },
        uVelocity: { value: null },
        uDensity: { value: null },
        uTime: { value: 0 },
        uHz: { value: 1 },
        // Spec value is 0.4 for a 0.7-unit form; ours is about half that size
        // and the flow is not scaled into local space, so it runs much lower.
        uMouseStrength: { value: 0.14 },
        // Settled-phase spring to home: ~0.7 s time constant at 60 fps, so a
        // stirred region heals within a second or two of the fluid dying down.
        uSpring: { value: SETTLED_SPRING },
        uSettled: { value: 0 },
        uHome: { value: null },
        uViewProj: { value: new Matrix4() },
        uModel: { value: new Matrix4() },
        uFlowToLocal: { value: new Matrix3() }
      },
      depthTest: false,
      depthWrite: false
    })
    this.simMesh = new Mesh(new PlaneGeometry(2, 2), this.simMat)
    this.simMesh.frustumCulled = false
    this.simScene.add(this.simMesh)

    const refs = new Float32Array(count * 2)
    const randoms = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      refs[i * 2] = ((i % side) + 0.5) / side
      refs[i * 2 + 1] = (Math.floor(i / side) + 0.5) / side
      for (let k = 0; k < 4; k++) randoms[i * 4 + k] = Math.random()
    }
    const geometry = new BufferGeometry()
    // `position` is unused by the shader but three needs it to size the draw.
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))
    geometry.setAttribute('aRef', new BufferAttribute(refs, 2))
    geometry.setAttribute('aRandom', new BufferAttribute(randoms, 4))

    this.matcap = makeMatcap()
    this.drawMat = new ShaderMaterial({
      vertexShader: POINTS_VERT,
      fragmentShader: POINTS_FRAG,
      uniforms: {
        uPositions: { value: this.origin },
        uMatcap: { value: this.matcap },
        uTime: { value: 0 },
        uDpr: { value: 1 },
        uSizeScale: { value: 1 },
        uAccent: { value: accent }
      },
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: AdditiveBlending
    })
    this.points = new Points(geometry, this.drawMat)
    this.points.frustumCulled = false
  }

  setPointScale(dpr: number, sizeScale: number): void {
    this.drawMat.uniforms.uDpr.value = dpr
    this.drawMat.uniforms.uSizeScale.value = sizeScale
  }

  step(inputs: FieldInputs): void {
    const u = this.simMat.uniforms
    u.uPositions.value = this.seeded ? this.read.texture : this.origin
    u.uTime.value = inputs.time
    u.uHz.value = inputs.hz
    u.uVelocity.value = inputs.velocity
    u.uDensity.value = inputs.density
    u.uViewProj.value.copy(inputs.viewProj)
    u.uModel.value.copy(inputs.model)
    u.uFlowToLocal.value.copy(inputs.flowToLocal)

    this.renderer.setRenderTarget(this.write)
    this.renderer.render(this.simScene, this.simCamera)
    const t = this.read
    this.read = this.write
    this.write = t
    this.seeded = true

    this.drawMat.uniforms.uPositions.value = this.read.texture
    this.drawMat.uniforms.uTime.value = inputs.time
  }

  /**
   * Freeze the formed cloud as each particle's home and switch the simulation
   * to the settled phase. The current read target becomes the home texture and
   * is never written again; a fresh target joins the ping-pong pair.
   */
  settle(): void {
    if (this.home) return
    this.home = this.read
    this.read = floatTarget(this.side)
    const u = this.simMat.uniforms
    u.uHome.value = this.home.texture
    u.uSettled.value = 1
    // Seed the new read target with the home positions in one settled pass.
    u.uPositions.value = this.home.texture
    u.uSpring.value = 1
    this.renderer.setRenderTarget(this.read)
    this.renderer.render(this.simScene, this.simCamera)
    u.uSpring.value = SETTLED_SPRING
    this.drawMat.uniforms.uPositions.value = this.read.texture
  }

  /** Dev diagnostics: read back the first `n`×`n` simulated positions. */
  samplePositions(n: number): Float32Array {
    const out = new Float32Array(n * n * 4)
    this.renderer.readRenderTargetPixels(this.read, 0, 0, n, n, out)
    return out
  }

  dispose(): void {
    this.read.dispose()
    this.write.dispose()
    this.home?.dispose()
    this.origin.dispose()
    this.matcap.dispose()
    this.simMat.dispose()
    this.drawMat.dispose()
    this.simMesh.geometry.dispose()
    this.points.geometry.dispose()
  }
}
