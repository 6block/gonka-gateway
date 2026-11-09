import type { Ref } from 'vue'

// 和 eye-hero.css 里的媒体查询保持一致：桌面端 + 未开启减少动态效果才播放帧序列
const MOTION_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

interface NetworkInformationLike {
  saveData?: boolean
}

/** 判断是否播放滚动帧序列；手机、减少动态效果、省流量模式只显示静态海报 */
export function useHeroMotion(): { isMotionEnabled: Ref<boolean> } {
  const isMotionEnabled = ref(false)
  onMounted(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
    isMotionEnabled.value = window.matchMedia(MOTION_QUERY).matches && connection?.saveData !== true
  })
  return { isMotionEnabled }
}
