import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { LoadingScreen } from './LoadingScreen'

type GuardRole = 'user' | 'admin' | 'any'

export function AuthGuard({
  role,
  children,
}: {
  role: GuardRole
  children: ReactNode
}) {
  const { user } = useAuth()

  const redirectTo = !user
    ? 'index.html'
    : role === 'admin' && user.role !== 'admin'
      ? 'dashboard.html'
      : role === 'user' && user.role !== 'user'
        ? 'admin.html'
        : null

  useEffect(() => {
    if (redirectTo) window.location.replace(redirectTo)
  }, [redirectTo])

  if (redirectTo || !user) {
    return <LoadingScreen message="Mengalihkan ke halaman yang sesuai..." />
  }

  return <>{children}</>
}
