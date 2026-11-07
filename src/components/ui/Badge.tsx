import type { ReactNode } from 'react'
import type { BookingStatus } from '../../types'
import { STATUS_LABELS } from '../../utils/constants'
import { cn } from '../../utils/classnames'

type BadgeTone = 'brand' | 'amber' | 'rose' | 'slate' | 'blue' | 'violet'

const toneClasses: Record<BadgeTone, string> = {
  brand: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  blue: 'bg-sky-50 text-sky-700 ring-sky-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
}

export function Badge({
  children,
  tone = 'slate',
  className,
}: {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

const statusTones: Record<BookingStatus, BadgeTone> = {
  pending: 'amber',
  confirmed: 'brand',
  rejected: 'rose',
  cancelled: 'slate',
  completed: 'blue',
}

const statusDots: Record<BookingStatus, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-emerald-500',
  rejected: 'bg-rose-500',
  cancelled: 'bg-slate-400',
  completed: 'bg-sky-500',
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge tone={statusTones[status]}>
      <span className={cn('size-1.5 rounded-full', statusDots[status])} />
      {STATUS_LABELS[status]}
    </Badge>
  )
}
