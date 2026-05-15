<template>
  <div class="bg-surface-container-lowest rounded-2xl border border-white/5 overflow-hidden">
    <div
      class="bg-surface-container-highest/50 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 border-b border-white/5"
    >
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></div>
        <span class="text-[10px] font-black uppercase tracking-widest text-text-muted font-label">
          {{ filename }}
        </span>
      </div>
      <button
        type="button"
        @click="copy"
        class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary-container transition-colors"
      >
        <LucideCheck v-if="copied" class="w-3 h-3 text-primary-container" />
        <LucideCopy v-else class="w-3 h-3" />
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>
    <pre
      class="p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed text-secondary overflow-x-auto custom-scrollbar"
    ><code>{{ code }}</code></pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LucideCheck, LucideCopy } from 'lucide-vue-next'

const props = defineProps({
  filename: { type: String, required: true },
  code: { type: String, required: true }
})

const copied = ref(false)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard blocked — ignore silently, value is still readable on screen
  }
}
</script>
