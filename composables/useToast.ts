interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export const useToast = () => {
  // useState scopes the ref to the current request on the server, preventing
  // toast state from leaking between concurrent SSR requests.
  const toasts = useState<Toast[]>('app:toasts', () => [])
  const toastCounter = useState<number>('app:toast-counter', () => 0)

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const addToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
    duration = 3000
  ) => {
    const id = toastCounter.value++
    toasts.value.push({ id, message, type })
    if (import.meta.client) {
      setTimeout(() => removeToast(id), duration)
    }
  }

  const success = (msg: string, duration?: number) => addToast(msg, 'success', duration)
  const error = (msg: string, duration?: number) => addToast(msg, 'error', duration)
  const info = (msg: string, duration?: number) => addToast(msg, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info
  }
}
