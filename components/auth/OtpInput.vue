<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{ length?: number; disabled?: boolean }>(), {
  length: 6,
  disabled: false
})
const emit = defineEmits<{
  (e: 'complete', code: string): void
  (e: 'change', code: string): void
}>()

const digits = ref<string[]>(Array(props.length).fill(''))
const inputs = ref<HTMLInputElement[]>([])
const code = computed(() => digits.value.join(''))

function reset() {
  digits.value = Array(props.length).fill('')
  inputs.value[0]?.focus()
}
function focus() {
  inputs.value[0]?.focus()
}
defineExpose({ reset, focus })

function emitState() {
  emit('change', code.value)
  if (code.value.length === props.length) emit('complete', code.value)
}

function onInput(i: number, ev: Event) {
  const raw = (ev.target as HTMLInputElement).value.replace(/\D/g, '')
  const next = [...digits.value]
  next[i] = raw ? raw[raw.length - 1] : ''
  digits.value = next
  if (raw && i < props.length - 1) inputs.value[i + 1]?.focus()
  emitState()
}

function onKeydown(i: number, ev: KeyboardEvent) {
  if (ev.key === 'Backspace' && !digits.value[i] && i > 0) inputs.value[i - 1]?.focus()
}

function onPaste(ev: ClipboardEvent) {
  const text = (ev.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, props.length)
  if (!text) return
  ev.preventDefault()
  const next = Array(props.length).fill('')
  for (let k = 0; k < text.length; k++) next[k] = text[k]
  digits.value = next
  inputs.value[Math.min(text.length, props.length - 1)]?.focus()
  emitState()
}
</script>

<template>
  <div class="flex justify-center gap-2 sm:gap-3" @paste="onPaste">
    <input
      v-for="(d, i) in digits"
      :key="i"
      :ref="(el) => { if (el) inputs[i] = el }"
      :value="d"
      :disabled="disabled"
      type="text"
      inputmode="numeric"
      maxlength="1"
      autocomplete="one-time-code"
      class="h-14 w-12 rounded-xl border border-white/10 bg-surface-container-high text-center text-2xl font-black text-text-main outline-none transition-colors focus:border-primary-container disabled:opacity-60 sm:h-16 sm:w-14"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
    />
  </div>
</template>
