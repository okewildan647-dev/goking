import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  PasswordInput,
  ProfileInput,
  RegisterInput,
  Result,
  SessionUser,
} from '../types'
import * as authService from '../services/auth.service'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() =>
    authService.getSessionUser(),
  )

  const login = useCallback((email: string, password: string) => {
    const result = authService.login(email, password)
    if (result.ok) setUser(result.data)
    return result
  }, [])

  const register = useCallback((input: RegisterInput) => {
    const result = authService.register(input)
    if (result.ok) setUser(result.data)
    return result
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    window.location.href = 'index.html'
  }, [])

  const updateProfile = useCallback(
    (input: ProfileInput): Result<SessionUser> => {
      if (!user) {
        return { ok: false, message: 'Sesi pengguna tidak ditemukan.' }
      }

      const result = authService.updateProfile(user.id, input)
      if (result.ok) setUser(result.data)
      return result
    },
    [user],
  )

  const updatePassword = useCallback(
    (input: PasswordInput): Result<SessionUser> => {
      if (!user) {
        return { ok: false, message: 'Sesi pengguna tidak ditemukan.' }
      }

      const result = authService.updatePassword(user.id, input)
      if (result.ok) setUser(result.data)
      return result
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      updateProfile,
      updatePassword,
    }),
    [user, login, register, logout, updateProfile, updatePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
