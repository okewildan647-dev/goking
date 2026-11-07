import { useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { PageHeader } from './PageHeader'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const CURRENT_YEAR = new Date().getFullYear()

interface AppShellProps {
  active: string
  title: string
  subtitle: string
  actions?: ReactNode
  children: ReactNode
}

export function AppShell({
  active,
  title,
  subtitle,
  actions,
  children,
}: AppShellProps) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar
        role={user.role}
        active={active}
        onLogout={() => setLogoutOpen(true)}
        className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen"
      />

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="animate-slide-in absolute inset-y-0 left-0 w-72 shadow-2xl">
            <Sidebar
              role={user.role}
              active={active}
              onClose={() => setMenuOpen(false)}
              onNavigate={() => setMenuOpen(false)}
              onLogout={() => {
                setMenuOpen(false)
                setLogoutOpen(true)
              }}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onMenuOpen={() => setMenuOpen(true)} />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <PageHeader title={title} subtitle={subtitle} actions={actions} />
          {children}
        </main>

        <footer className="px-4 pb-6 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
          Goking &copy; {CURRENT_YEAR} &middot; Booking lapangan badminton jadi lebih mudah.
        </footer>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={logout}
        title="Keluar dari akun?"
        description="Anda akan diarahkan ke halaman login. Data booking tetap tersimpan di perangkat ini."
        confirmLabel="Ya, keluar"
        cancelLabel="Tetap di sini"
      />
    </div>
  )
}
