<template>
  <div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none">
    <TransitionGroup
      name="toast"
      tag="div"
      class="flex flex-col gap-2.5"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-2xl border text-sm font-medium animate-slide-up"
        :class="{
          'bg-white/90 dark:bg-[#0c0c1d]/90 border-gray-200/50 dark:border-white/[0.06] text-gray-900 dark:text-white': toast.type === 'info',
          'bg-accent-emerald/10 dark:bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald': toast.type === 'success',
          'bg-red-500/10 dark:bg-red-500/10 border-red-500/20 text-red-500': toast.type === 'error'
        }"
      >
        <LucideCheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4 text-accent-emerald" />
        <LucideXCircle v-else-if="toast.type === 'error'" class="w-4 h-4 text-red-500" />
        <LucideInfo v-else class="w-4 h-4 text-primary-400" />

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
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
</style>
