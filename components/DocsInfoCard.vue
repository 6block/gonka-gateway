<template>
  <div
    class="bg-surface-container-lowest/60 rounded-2xl px-4 py-3 border border-white/5 flex items-start justify-between gap-3"
  >
    <div class="min-w-0">
      <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">
        {{ label }}
      </p>
      <code class="text-xs sm:text-sm font-mono text-primary-container break-all">
        {{ value }}
      </code>
    </div>
    <button
      type="button"
      @click="copy"
      class="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-primary-container hover:bg-white/5 transition-colors"
      :aria-label="copied ? 'Copied' : 'Copy'"
    >
      <LucideCheck v-if="copied" class="w-4 h-4 text-primary-container" />
      <LucideCopy v-else class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LucideCheck, LucideCopy } from 'lucide-vue-next'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true }
})

const copied = ref(false)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard blocked — ignore silently, value is still readable on screen
  }
}
</script>
