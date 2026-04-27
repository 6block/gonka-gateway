import { ref } from 'vue'

// Shared module-scoped state so any page can drive the login modal
// that is rendered inside the default layout.
const isOpen = ref(false)

export const useLoginModal = () => {
  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    open,
    close,
    toggle
  }
}
