import {
  Camera,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NearestFilter,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
  type IUniform
} from 'three'
import {
  ADVECT_FRAG,
  CURL_FRAG,
  DIVERGENCE_FRAG,
  FLUID_VERT,
  GRADIENT_FRAG,
  PRESSURE_FRAG,
  SCALE_FRAG,
  SPLAT_FRAG,
  VORTICITY_FRAG
} from './shaders/fluid'

export interface FluidConfig {
  simResolution: number
  dyeResolution: number
  velocityDissipation: number
  densityDissipation: number
  pressureDissipation: number
  pressureIterations: number
  curl: number
  dt: number
}

export const DEFAULT_FLUID: FluidConfig = {
  simResolution: 256,
  dyeResolution: 512,
  velocityDissipation: 0.98,
  densityDissipation: 0.97,
  pressureDissipation: 0.95,
  pressureIterations: 5,
  curl: 30,
  dt: 1 / 60
}

export interface Splat {
  from: Vector2 // UV, 0..1, y up
  to: Vector2
  force: Vector2 // velocity added along the stroke
  radius: number // UV units
}

type Filter = typeof LinearFilter | typeof NearestFilter

function halfFloatTarget(size: number, filter: Filter): WebGLRenderTarget {
  return new WebGLRenderTarget(size, size, {
    type: HalfFloatType,
    format: RGBAFormat,
    minFilter: filter,
    magFilter: filter,
    depthBuffer: false,
    stencilBuffer: false
  })
}

class DoubleTarget {
  read: WebGLRenderTarget
  write: WebGLRenderTarget

  constructor(size: number, filter: Filter) {
    this.read = halfFloatTarget(size, filter)
    this.write = halfFloatTarget(size, filter)
  }

  swap(): void {
    const t = this.read
    this.read = this.write
    this.write = t
  }

  dispose(): void {
    this.read.dispose()
    this.write.dispose()
  }
}

type Uniforms = Record<string, IUniform>

/** Screen-space GPU fluid that the cursor stirs; particles read its textures. */
export class FluidSim {
  private readonly renderer: WebGLRenderer
  private readonly cfg: FluidConfig
  private readonly scene = new Scene()
  private readonly camera = new Camera()
  private readonly quad: Mesh
  private readonly simTexel: Vector2
  private readonly dyeTexel: Vector2

  private readonly velocity: DoubleTarget
  private readonly dye: DoubleTarget
  private readonly pressure: DoubleTarget
  private readonly divergence: WebGLRenderTarget
  private readonly curlTarget: WebGLRenderTarget

  private readonly materials: ShaderMaterial[] = []
  private readonly splatMat: ShaderMaterial
  private readonly curlMat: ShaderMaterial
  private readonly vorticityMat: ShaderMaterial
  private readonly divergenceMat: ShaderMaterial
  private readonly scaleMat: ShaderMaterial
  private readonly pressureMat: ShaderMaterial
  private readonly gradientMat: ShaderMaterial
  private readonly advectMat: ShaderMaterial

  aspect = 1

  constructor(renderer: WebGLRenderer, cfg: FluidConfig) {
    this.renderer = renderer
    this.cfg = cfg
    this.simTexel = new Vector2(1 / cfg.simResolution, 1 / cfg.simResolution)
    this.dyeTexel = new Vector2(1 / cfg.dyeResolution, 1 / cfg.dyeResolution)

    this.velocity = new DoubleTarget(cfg.simResolution, LinearFilter)
    this.dye = new DoubleTarget(cfg.dyeResolution, LinearFilter)
    this.pressure = new DoubleTarget(cfg.simResolution, NearestFilter)
    this.divergence = halfFloatTarget(cfg.simResolution, NearestFilter)
    this.curlTarget = halfFloatTarget(cfg.simResolution, NearestFilter)

    this.splatMat = this.material(SPLAT_FRAG, {
      uTarget: { value: null },
      uAspect: { value: 1 },
      uColor: { value: new Vector3() },
      uFrom: { value: new Vector2() },
      uTo: { value: new Vector2() },
      uRadius: { value: 0.01 }
    })
    this.curlMat = this.material(CURL_FRAG, { uVelocity: { value: null } })
    this.vorticityMat = this.material(VORTICITY_FRAG, {
      uVelocity: { value: null },
      uCurl: { value: null },
      uCurlStrength: { value: cfg.curl },
      uDt: { value: cfg.dt }
    })
    this.divergenceMat = this.material(DIVERGENCE_FRAG, { uVelocity: { value: null } })
    this.scaleMat = this.material(SCALE_FRAG, { uTexture: { value: null }, uValue: { value: 1 } })
    this.pressureMat = this.material(PRESSURE_FRAG, {
      uPressure: { value: null },
      uDivergence: { value: null }
    })
    this.gradientMat = this.material(GRADIENT_FRAG, {
      uPressure: { value: null },
      uVelocity: { value: null }
    })
    this.advectMat = this.material(ADVECT_FRAG, {
      uVelocity: { value: null },
      uSource: { value: null },
      uDt: { value: cfg.dt },
      uDissipation: { value: 1 }
    })

    this.quad = new Mesh(new PlaneGeometry(2, 2), this.splatMat)
    this.quad.frustumCulled = false
    this.scene.add(this.quad)
  }

  get velocityTexture(): Texture {
    return this.velocity.read.texture
  }

  get densityTexture(): Texture {
    return this.dye.read.texture
  }

  splat(s: Splat): void {
    const u = this.splatMat.uniforms
    u.uAspect.value = this.aspect
    u.uFrom.value.copy(s.from)
    u.uTo.value.copy(s.to)
    u.uRadius.value = s.radius

    u.uTarget.value = this.velocity.read.texture
    u.uColor.value.set(s.force.x, s.force.y, 0)
    this.pass(this.splatMat, this.velocity.write, this.simTexel)
    this.velocity.swap()

    u.uTarget.value = this.dye.read.texture
    u.uColor.value.set(1, 1, 1)
    this.pass(this.splatMat, this.dye.write, this.dyeTexel)
    this.dye.swap()
  }

  step(): void {
    const { cfg, simTexel } = this

    this.curlMat.uniforms.uVelocity.value = this.velocity.read.texture
    this.pass(this.curlMat, this.curlTarget, simTexel)

    this.vorticityMat.uniforms.uVelocity.value = this.velocity.read.texture
    this.vorticityMat.uniforms.uCurl.value = this.curlTarget.texture
    this.pass(this.vorticityMat, this.velocity.write, simTexel)
    this.velocity.swap()

    this.divergenceMat.uniforms.uVelocity.value = this.velocity.read.texture
    this.pass(this.divergenceMat, this.divergence, simTexel)

    this.scaleMat.uniforms.uTexture.value = this.pressure.read.texture
    this.scaleMat.uniforms.uValue.value = cfg.pressureDissipation
    this.pass(this.scaleMat, this.pressure.write, simTexel)
    this.pressure.swap()

    this.pressureMat.uniforms.uDivergence.value = this.divergence.texture
    for (let i = 0; i < cfg.pressureIterations; i++) {
      this.pressureMat.uniforms.uPressure.value = this.pressure.read.texture
      this.pass(this.pressureMat, this.pressure.write, simTexel)
      this.pressure.swap()
    }

    this.gradientMat.uniforms.uPressure.value = this.pressure.read.texture
    this.gradientMat.uniforms.uVelocity.value = this.velocity.read.texture
    this.pass(this.gradientMat, this.velocity.write, simTexel)
    this.velocity.swap()

    const adv = this.advectMat.uniforms
    adv.uVelocity.value = this.velocity.read.texture
    adv.uSource.value = this.velocity.read.texture
    adv.uDissipation.value = cfg.velocityDissipation
    this.pass(this.advectMat, this.velocity.write, simTexel)
    this.velocity.swap()

    adv.uVelocity.value = this.velocity.read.texture
    adv.uSource.value = this.dye.read.texture
    adv.uDissipation.value = cfg.densityDissipation
    this.pass(this.advectMat, this.dye.write, simTexel)
    this.dye.swap()
  }

  dispose(): void {
    this.velocity.dispose()
    this.dye.dispose()
    this.pressure.dispose()
    this.divergence.dispose()
    this.curlTarget.dispose()
    this.materials.forEach((m) => m.dispose())
    this.quad.geometry.dispose()
  }

  private material(fragmentShader: string, uniforms: Uniforms): ShaderMaterial {
    const mat = new ShaderMaterial({
      vertexShader: FLUID_VERT,
      fragmentShader,
      uniforms: { ...uniforms, uTexel: { value: new Vector2() } },
      depthTest: false,
      depthWrite: false
    })
    this.materials.push(mat)
    return mat
  }

  private pass(mat: ShaderMaterial, target: WebGLRenderTarget, texel: Vector2): void {
    mat.uniforms.uTexel.value.copy(texel)
    this.quad.material = mat
    this.renderer.setRenderTarget(target)
    this.renderer.render(this.scene, this.camera)
  }
}
