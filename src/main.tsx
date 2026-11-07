import { StrictMode } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthGuard } from './components/layout/AuthGuard'
import { AuthProvider } from './context/AuthProvider'
import { ToastProvider } from './context/ToastProvider'
import { ensureSeeded } from './utils/seed'
import './index.css'

export type AccessLevel = 'public' | 'user' | 'admin' | 'any'

export function mountPage(element: ReactNode, access: AccessLevel = 'public') {
  ensureSeeded()

  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Elemen #root tidak ditemukan.')
  }

  const content =
    access === 'public' ? (
      element
    ) : (
      <AuthGuard role={access}>{element}</AuthGuard>
    )

  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <ToastProvider>{content}</ToastProvider>
      </AuthProvider>
    </StrictMode>,
  )
}
