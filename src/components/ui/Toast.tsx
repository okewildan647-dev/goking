import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import type { ToastTone } from '../../context/toast-context'

const toneConfig: Record<
  ToastTone,
  { icon: typeof CheckCircle2; iconClass: string; ringClass: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-600',
    ringClass: 'ring-emerald-100',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-red-600',
    ringClass: 'ring-red-100',
  },
  info: {
    icon: Info,
    iconClass: 'text-sky-600',
    ringClass: 'ring-sky-100',
  },
}

export function ToastViewport() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:top-5 sm:items-end"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map(toast => {
        const config = toneConfig[toast.tone]
        const Icon = config.icon

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 ring-4 ${config.ringClass}`}
          >
            <Icon className={`mt-0.5 size-5 shrink-0 ${config.iconClass}`} />
            <p className="min-w-0 flex-1 text-sm font-medium leading-5 text-slate-700">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Tutup notifikasi"
              className="grid size-6 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
