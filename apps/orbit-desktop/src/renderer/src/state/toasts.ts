import { reactive } from 'vue'

export type ToastVariant = 'default' | 'error'

export interface ToastOptions {
  title: string
  message?: string
  variant?: ToastVariant
  actionLabel?: string
  onAction?: () => void
  duration?: number
}

export interface Toast {
  id: number
  title: string
  message?: string
  variant: ToastVariant
  actionLabel?: string
  onAction?: () => void
  leaving: boolean
}

const DEFAULT_DURATION_MS = 6000

export const toasts = reactive<Toast[]>([])

let nextId = 1
const dismissTimers = new Map<number, ReturnType<typeof setTimeout>>()

export function showToast(options: ToastOptions): number {
  const id = nextId++
  toasts.push({
    id,
    title: options.title,
    message: options.message,
    variant: options.variant ?? 'default',
    actionLabel: options.actionLabel,
    onAction: options.onAction,
    leaving: false
  })
  dismissTimers.set(
    id,
    setTimeout(() => dismissToast(id), options.duration ?? DEFAULT_DURATION_MS)
  )
  return id
}

export function dismissToast(id: number): void {
  const toast = toasts.find((t) => t.id === id)
  if (!toast || toast.leaving) return

  clearTimeout(dismissTimers.get(id))
  dismissTimers.delete(id)
  toast.leaving = true
}

export function removeToast(id: number): void {
  const index = toasts.findIndex((t) => t.id === id)
  if (index !== -1) toasts.splice(index, 1)
}
