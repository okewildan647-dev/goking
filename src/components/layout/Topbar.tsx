import { CalendarDays, Menu } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_LABELS } from '../../utils/constants'
import { formatDate, todayISO } from '../../utils/date'
import { Avatar } from '../ui/Avatar'

interface TopbarProps {
  title: string
  onMenuOpen: () => void
}

export function Topbar({ title, onMenuOpen }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Buka menu navigasi"
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="min-w-0 flex-1 lg:hidden">
        <p className="truncate text-sm font-bold text-slate-900">{title}</p>
      </div>

      <div className="hidden flex-1 items-center gap-2 text-sm text-slate-500 lg:flex">
        <CalendarDays className="size-4 text-brand-600" />
        <span>{formatDate(todayISO())}</span>
      </div>

      {user && (
        <a
          href="profile.html"
          className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-brand-200 hover:bg-brand-50/40"
        >
          <Avatar name={user.name} size="sm" />
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-40 truncate text-xs font-bold text-slate-800">
              {user.name}
            </span>
            <span className="block text-[10px] font-medium text-slate-400">
              {ROLE_LABELS[user.role]}
            </span>
          </span>
        </a>
      )}
    </header>
  )
}
