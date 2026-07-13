<template>
  <div class="bg-surface-container-lowest rounded-2xl border border-white/5 overflow-hidden">
    <div
      class="bg-surface-container-highest/50 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 border-b border-white/5"
    >
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0"></div>
        <span class="text-[10px] font-black uppercase tracking-widest text-text-muted font-label truncate">
          {{ activeFilename }}
        </span>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <!-- OS switcher — only rendered when this block carries per-OS variants -->
        <div v-if="hasVariants" class="flex items-center gap-1">
          <button
            v-for="variant in variants"
            :key="variant.os"
            type="button"
            @click="selectedOs = variant.os"
            class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
            :class="
              activeVariant.os === variant.os
                ? 'bg-primary-container text-primary-on'
                : 'text-text-muted hover:text-text-main'
            "
          >
            {{ variant.label }}
          </button>
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
    </div>
    <pre
      class="p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed text-secondary overflow-x-auto custom-scrollbar"
    ><code>{{ activeCode }}</code></pre>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { LucideCheck, LucideCopy } from 'lucide-vue-next'

const props = defineProps({
  filename: { type: String, default: '' },
  code: { type: String, default: '' },
  // Optional per-OS variants: [{ os, label, filename?, code }]. When provided,
  // an OS switcher renders in the header and `code`/`filename` are ignored.
  variants: { type: Array, default: null }
})

const hasVariants = computed(() => Array.isArray(props.variants) && props.variants.length > 1)

// Share the OS choice across every variant-bearing block on the page (provided by
// pages/docs.vue). Fall back to a local ref so the component works standalone.
const sharedOs = inject('docsOs', null)
const localOs = ref('unix')
const selectedOs = sharedOs || localOs

const activeVariant = computed(() => {
  if (!hasVariants.value) return null
  return props.variants.find((v) => v.os === selectedOs.value) || props.variants[0]
})

const activeCode = computed(() => (activeVariant.value ? activeVariant.value.code : props.code))
const activeFilename = computed(() =>
  activeVariant.value ? activeVariant.value.filename || props.filename : props.filename
)

const copied = ref(false)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(activeCode.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard blocked — ignore silently, value is still readable on screen
  }
}
</script>
