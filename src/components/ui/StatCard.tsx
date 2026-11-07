import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/classnames'
import { Card } from './Card'

type StatTone = 'brand' | 'amber' | 'blue' | 'rose' | 'violet'

interface StatCardProps {
  label: string
  value: string | number
  helper?: string
  icon: LucideIcon
  tone?: StatTone
}

const toneClasses: Record<StatTone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  blue: 'bg-sky-50 text-sky-700 ring-sky-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
}

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = 'brand',
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
          {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
        </div>
        <span
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-2xl ring-1',
            toneClasses[tone],
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
    </Card>
  )
}
