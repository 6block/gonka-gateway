import type { Ref } from 'vue'

// 先加载首帧和稀疏关键帧，保证快速滚动时总有相近的帧可画，再补齐其余帧
const KEYFRAME_STRIDE = 8
const MAX_CONCURRENT_LOADS = 6
const MIN_BLEND = 0.01

export function useEyeFrames(canvasRef: Ref<HTMLCanvasElement | null>, frameUrls: readonly string[]) {
  const frameCount = frameUrls.length
  const images: (HTMLImageElement | null)[] = Array.from({ length: frameCount }, () => null)
  const loadedCount = ref(0)
  let currentPosition = 0
  let hasDrawn = false
  let isStarted = false
  let disposed = false

  const loadOrder = (): number[] => {
    const sparse = Array.from({ length: Math.ceil(frameCount / KEYFRAME_STRIDE) }, (_, i) => i * KEYFRAME_STRIDE)
    const rest = Array.from({ length: frameCount }, (_, i) => i).filter((i) => i % KEYFRAME_STRIDE !== 0)
    return [...sparse, ...rest]
  }

  const loadFrame = (index: number) =>
    new Promise<void>((resolve) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (disposed) return resolve()
        images[index] = img
        loadedCount.value += 1
        if (!hasDrawn || Math.abs(index - currentPosition) <= 1) drawFrame(currentPosition)
        resolve()
      }
      img.onerror = () => {
        console.error(`[EyeScrollHero] 帧加载失败: ${frameUrls[index]}`)
        resolve()
      }
      img.src = frameUrls[index]
    })

  const loadAll = async () => {
    const queue = loadOrder()
    const worker = async () => {
      while (queue.length && !disposed) await loadFrame(queue.shift()!)
    }
    await Promise.all(Array.from({ length: MAX_CONCURRENT_LOADS }, worker))
  }

  const nearestLoaded = (index: number): HTMLImageElement | null => {
    for (let d = 0; d < frameCount; d++) {
      const img = images[index - d] ?? images[index + d]
      if (img) return img
    }
    return null
  }

  const resizeCanvas = (canvas: HTMLCanvasElement) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(canvas.clientWidth * dpr)
    const h = Math.round(canvas.clientHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
  }

  /** 按 object-fit: cover 绘制 */
  const drawCover = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
  }

  /**
   * position 可以是小数：先画 floor 帧，再按小数部分的透明度叠上下一帧。
   * 帧数抽稀后靠这个交叉淡化保持滚动顺滑；缺帧时退回最近的已加载帧。
   */
  function drawFrame(position: number) {
    currentPosition = position
    const canvas = canvasRef.value
    const base = Math.floor(position)
    const baseImg = nearestLoaded(base)
    if (!canvas || !baseImg) return
    resizeCanvas(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.globalAlpha = 1
    drawCover(ctx, canvas, baseImg)
    const blend = position - base
    const nextImg = images[base + 1]
    if (blend > MIN_BLEND && nextImg) {
      ctx.globalAlpha = blend
      drawCover(ctx, canvas, nextImg)
      ctx.globalAlpha = 1
    }
    hasDrawn = true
  }

  /** 只在需要动效的设备上调用，其余设备不下载任何帧 */
  function start() {
    if (isStarted) return
    isStarted = true
    loadAll()
  }

  onBeforeUnmount(() => {
    disposed = true
  })

  return { drawFrame, start, loadedCount }
}
