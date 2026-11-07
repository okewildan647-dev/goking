import { Trophy } from 'lucide-react'
import { cn } from '../../utils/classnames'

interface LogoProps {
  tone?: 'dark' | 'light'
  compact?: boolean
  className?: string
}

export function Logo({ tone = 'dark', compact = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-2xl shadow-sm',
          tone === 'light'
            ? 'bg-white/10 text-brand-200 ring-1 ring-white/15'
            : 'bg-brand-700 text-white',
        )}
      >
        <Trophy className="size-5" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span
            className={cn(
              'block text-lg font-black tracking-tight',
              tone === 'light' ? 'text-white' : 'text-slate-900',
            )}
          >
            GOKING
          </span>
          <span
            className={cn(
              'block text-[10px] font-bold uppercase tracking-[0.18em]',
              tone === 'light' ? 'text-brand-300' : 'text-slate-400',
            )}
          >
            Go Booking Badminton
          </span>
        </span>
      )}
    </div>
  )
}
