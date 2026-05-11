<template>
  <div
    class="fixed z-[200] flex flex-col gap-2.5 pointer-events-none top-[calc(env(safe-area-inset-top,0px)+0.75rem)] left-3 right-3 items-center sm:top-auto sm:bottom-6 sm:left-auto sm:right-6 sm:items-stretch"
  >
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2.5 w-full sm:w-auto items-center sm:items-stretch">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-card backdrop-blur-2xl border text-sm font-bold font-body max-w-[calc(100vw-1.5rem)] sm:max-w-md"
        :class="{
          'bg-surface-container-high border-white/5 text-text-main': toast.type === 'info',
          'bg-primary-container/10 border-primary-container/25 text-primary-container':
            toast.type === 'success',
          'bg-red-500/10 border-red-500/25 text-red-400': toast.type === 'error'
        }"
      >
        <LucideCheckCircle2
          v-if="toast.type === 'success'"
          class="w-4 h-4 text-primary-container"
        />
        <LucideXCircle
          v-else-if="toast.type === 'error'"
          class="w-4 h-4 text-red-400"
        />
        <LucideInfo v-else class="w-4 h-4 text-primary-container" />

        <span>{{ toast.message }}</span>

        <button
          @click="removeToast(toast.id)"
          class="ml-2 opacity-40 hover:opacity-100 transition-opacity"
        >
          <LucideX class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { LucideCheckCircle2, LucideXCircle, LucideInfo, LucideX } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}
@media (min-width: 640px) {
  .toast-enter-from,
  .toast-leave-to {
    transform: translateX(30px) scale(0.9);
  }
}
</style>
