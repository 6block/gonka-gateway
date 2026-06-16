<template>
  <div ref="root" class="relative">
    <!-- Trigger -->
    <button
      :id="triggerId"
      type="button"
      role="combobox"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-controls="listId"
      :class="[
        'field field-select flex items-center justify-between w-full text-left',
        hasError ? 'field-error' : 'field-base',
        open ? 'ring-1 ring-primary-container/40 border-primary-container/40' : ''
      ]"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span :class="selectedLabel ? 'text-text-main' : 'text-text-muted'" class="truncate">
        {{ selectedLabel || placeholder }}
      </span>
      <LucideChevronDown
        class="w-4 h-4 text-text-muted shrink-0 transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-1 scale-[0.98]"
    >
      <ul
        v-if="open"
        :id="listId"
        ref="list"
        role="listbox"
        :aria-activedescendant="activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined"
        class="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-white/10 bg-surface-container-high/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/40 origin-top"
        tabindex="-1"
        @keydown="onListKeydown"
      >
        <li
          v-for="(opt, i) in options"
          :id="`${listId}-opt-${i}`"
          :key="opt"
          role="option"
          :aria-selected="opt === modelValue"
          :class="[
            'flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-body cursor-pointer transition-colors select-none',
            i === activeIndex ? 'bg-white/[0.06]' : '',
            opt === modelValue ? 'text-primary-container font-semibold' : 'text-text-main'
          ]"
          @click="select(opt)"
          @mouseenter="activeIndex = i"
        >
          <span class="truncate">{{ opt }}</span>
          <LucideCheck v-if="opt === modelValue" class="w-4 h-4 shrink-0 text-primary-container" />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { LucideChevronDown, LucideCheck } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select…' },
  hasError: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const uid = Math.random().toString(36).slice(2, 9)
const triggerId = `ui-select-trigger-${uid}`
const listId = `ui-select-list-${uid}`

const root = ref(null)
const list = ref(null)
const open = ref(false)
const activeIndex = ref(-1)

const selectedLabel = computed(() =>
  props.modelValue === '' || props.modelValue == null ? '' : String(props.modelValue)
)

const select = (opt) => {
  emit('update:modelValue', opt)
  close()
}

const openMenu = async () => {
  open.value = true
  activeIndex.value = props.options.indexOf(props.modelValue)
  if (activeIndex.value < 0) activeIndex.value = 0
  await nextTick()
  list.value?.focus()
  scrollActiveIntoView()
}

const close = () => {
  open.value = false
}

const toggle = () => (open.value ? close() : openMenu())

const scrollActiveIntoView = () => {
  const el = list.value?.querySelector(`#${listId}-opt-${activeIndex.value}`)
  el?.scrollIntoView({ block: 'nearest' })
}

const move = (delta) => {
  const len = props.options.length
  if (!len) return
  activeIndex.value = (activeIndex.value + delta + len) % len
  scrollActiveIntoView()
}

const onTriggerKeydown = (e) => {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
    e.preventDefault()
    if (!open.value) openMenu()
  }
}

const onListKeydown = (e) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      move(-1)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (activeIndex.value >= 0) select(props.options[activeIndex.value])
      break
    case 'Escape':
      e.preventDefault()
      close()
      document.getElementById(triggerId)?.focus()
      break
    case 'Tab':
      close()
      break
  }
}

const onClickOutside = (e) => {
  if (open.value && root.value && !root.value.contains(e.target)) close()
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('mousedown', onClickOutside)
  } else {
    document.removeEventListener('mousedown', onClickOutside)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
</script>

<style scoped>
.field {
  @apply w-full bg-surface-container-high rounded-xl px-4 py-3 text-sm font-body text-text-main focus:outline-none transition-colors;
}
.field-base {
  @apply border border-white/5 hover:border-white/10;
}
.field-error {
  @apply border border-red-500/50;
}
.field-select {
  @apply cursor-pointer;
}
</style>
