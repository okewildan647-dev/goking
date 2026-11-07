import { createContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  tone: ToastTone
}

export interface ToastContextValue {
  toasts: ToastItem[]
  notify: (message: string, tone?: ToastTone) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
