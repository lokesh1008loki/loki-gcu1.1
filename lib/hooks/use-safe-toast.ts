import { useCallback } from 'react'
import { toast } from 'sonner'

export function useSafeToast() {
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    // Use setTimeout to ensure the toast is called after the render is complete
    setTimeout(() => {
      switch (type) {
        case 'success':
          toast.success(message)
          break
        case 'error':
          toast.error(message)
          break
        case 'info':
          toast.info(message)
          break
      }
    }, 0)
  }, [])

  return { showToast }
} 