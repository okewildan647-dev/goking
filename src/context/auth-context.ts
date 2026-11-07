import { createContext } from 'react'
import type {
  PasswordInput,
  ProfileInput,
  RegisterInput,
  Result,
  SessionUser,
} from '../types'

export interface AuthContextValue {
  user: SessionUser | null
  login: (email: string, password: string) => Result<SessionUser>
  register: (input: RegisterInput) => Result<SessionUser>
  logout: () => void
  updateProfile: (input: ProfileInput) => Result<SessionUser>
  updatePassword: (input: PasswordInput) => Result<SessionUser>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
