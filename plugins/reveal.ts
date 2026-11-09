import type { Directive } from 'vue'

// v-reveal：元素进入视口时淡入上移，离开视口时淡出；v-reveal="120" 表示淡入延迟 120ms，用于同组元素错开出现。
// 隐藏状态只在客户端挂载后（html 加上 reveal-ready）才生效，服务端渲染和 JS 未加载时内容照常可见。
const REVEALED_CLASS = 'is-revealed'
const READY_CLASS = 'reveal-ready'
const OBSERVER_OPTIONS: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }

export default defineNuxtPlugin((nuxtApp) => {
  const isReducedMotion = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let observer: IntersectionObserver | null = null

  const getObserver = (): IntersectionObserver => {
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) entry.target.classList.toggle(REVEALED_CLASS, entry.isIntersecting)
      }, OBSERVER_OPTIONS)
    }
    return observer
  }

  const reveal: Directive<HTMLElement, number | undefined> = {
    getSSRProps: () => ({ 'data-reveal': '' }),
    mounted(el, binding) {
      el.dataset.reveal = ''
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      if (!isReducedMotion) getObserver().observe(el)
    },
    unmounted(el) {
      observer?.unobserve(el)
    },
  }

  nuxtApp.vueApp.directive('reveal', reveal)

  if (import.meta.client && !isReducedMotion) {
    nuxtApp.hook('app:mounted', () => document.documentElement.classList.add(READY_CLASS))
  }
})
