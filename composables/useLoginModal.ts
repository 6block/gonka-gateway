// Per-request shared state for the on-demand login modal that lives in
// the default layout. useState ensures the modal flag is isolated to the
// current SSR request, not shared across all concurrent server requests.
export const useLoginModal = () => {
  const isOpen = useState<boolean>('app:login-modal-open', () => false)

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
