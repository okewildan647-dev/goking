import { LogOut, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import type { Role } from '../../types'
import { cn } from '../../utils/classnames'
import { ROLE_LABELS } from '../../utils/constants'
import { Avatar } from '../ui/Avatar'
import { Logo } from '../ui/Logo'
import { getHomeHref, getNavigation, getSectionLabel } from './navigation'

interface SidebarProps {
  role: Role
  active: string
  className?: string
  onClose?: () => void
  onNavigate?: () => void
  onLogout: () => void
}

export function Sidebar({
  role,
  active,
  className,
  onClose,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const { user } = useAuth()
  const items = getNavigation(role)

  return (
    <aside
      className={cn(
        'flex h-full w-72 shrink-0 flex-col bg-brand-950 p-5 text-white',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <a
          href={getHomeHref(role)}
          className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          aria-label="Kembali ke dashboard"
        >
          <Logo tone="light" />
        </a>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="grid size-9 place-items-center rounded-xl text-brand-200 transition hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">
          {getSectionLabel(role)}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-white">
          {user?.name ?? 'Pengguna'}
        </p>
      </div>

      <nav className="mt-6 flex-1 space-y-1.5 overflow-y-auto" aria-label="Navigasi utama">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-400">
          Menu utama
        </p>
        {items.map(item => {
          const Icon = item.icon
          const isActive = item.key === active

          return (
            <a
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                isActive
                  ? 'bg-white text-brand-950 shadow-sm'
                  : 'text-brand-100/80 hover:bg-white/8 hover:text-white',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'size-[18px] shrink-0',
                  isActive
                    ? 'text-brand-700'
                    : 'text-brand-300 group-hover:text-brand-200',
                )}
              />
              <span className="truncate">{item.label}</span>
            </a>
          )
        })}
      </nav>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-2xl px-1 py-2">
          <Avatar name={user?.name ?? 'Goking User'} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user?.name}</p>
            <p className="truncate text-xs text-brand-300">
              {user ? ROLE_LABELS[user.role] : 'Pengguna'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-brand-100 transition hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-200"
        >
          <LogOut className="size-4" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
