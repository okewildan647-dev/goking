import type {
  PasswordInput,
  ProfileInput,
  RegisterInput,
  Result,
  Session,
  SessionUser,
  User,
} from '../types'
import { createId } from '../utils/id'
import {
  readStorage,
  removeStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../utils/storage'
import { isValidEmail } from '../utils/validators'

export function getUsers(): User[] {
  return readStorage<User[]>(STORAGE_KEYS.users, [])
}

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  }
}

function saveUsers(users: User[]): void {
  writeStorage(STORAGE_KEYS.users, users)
}

function saveSession(user: User): void {
  const session: Session = {
    userId: user.id,
    createdAt: new Date().toISOString(),
  }
  writeStorage(STORAGE_KEYS.session, session)
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getSessionUser(): SessionUser | null {
  const session = readStorage<Session | null>(STORAGE_KEYS.session, null)
  if (!session) return null

  const user = getUsers().find(item => item.id === session.userId)
  return user ? toSessionUser(user) : null
}

export function login(email: string, password: string): Result<SessionUser> {
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail || !password) {
    return {
      ok: false,
      message: 'Email dan password wajib diisi.',
      fieldErrors: {
        email: !normalizedEmail ? 'Email wajib diisi.' : '',
        password: !password ? 'Password wajib diisi.' : '',
      },
    }
  }

  if (!isValidEmail(normalizedEmail)) {
    return {
      ok: false,
      message: 'Format email tidak valid.',
      fieldErrors: { email: 'Gunakan format email yang benar.' },
    }
  }

  const user = getUsers().find(
    item => normalizeEmail(item.email) === normalizedEmail && item.password === password,
  )

  if (!user) {
    return {
      ok: false,
      message: 'Email atau password salah.',
      fieldErrors: { password: 'Email atau password tidak cocok.' },
    }
  }

  saveSession(user)
  return { ok: true, data: toSessionUser(user) }
}

export function register(input: RegisterInput): Result<SessionUser> {
  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const password = input.password
  const fieldErrors: Record<string, string> = {}

  if (name.length < 3) fieldErrors.name = 'Nama minimal 3 karakter.'
  if (!isValidEmail(email)) fieldErrors.email = 'Gunakan format email yang benar.'
  if (password.length < 6) fieldErrors.password = 'Password minimal 6 karakter.'

  const users = getUsers()
  if (users.some(item => normalizeEmail(item.email) === email)) {
    fieldErrors.email = 'Email sudah terdaftar. Silakan masuk.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: 'Periksa kembali data pendaftaran Anda.',
      fieldErrors,
    }
  }

  const user: User = {
    id: createId('user'),
    name,
    email,
    password,
    phone: '',
    role: 'user',
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, user])
  saveSession(user)
  return { ok: true, data: toSessionUser(user) }
}

export function logout(): void {
  removeStorage(STORAGE_KEYS.session)
}

export function updateProfile(
  userId: string,
  input: ProfileInput,
): Result<SessionUser> {
  const users = getUsers()
  const index = users.findIndex(item => item.id === userId)

  if (index === -1) {
    return { ok: false, message: 'Akun tidak ditemukan. Silakan login kembali.' }
  }

  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const phone = input.phone.trim()
  const fieldErrors: Record<string, string> = {}

  if (name.length < 3) fieldErrors.name = 'Nama minimal 3 karakter.'
  if (!isValidEmail(email)) fieldErrors.email = 'Gunakan format email yang benar.'
  if (
    users.some(
      item => item.id !== userId && normalizeEmail(item.email) === email,
    )
  ) {
    fieldErrors.email = 'Email sudah digunakan akun lain.'
  }
  if (phone && phone.length < 8) {
    fieldErrors.phone = 'Nomor telepon minimal 8 karakter.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: 'Periksa kembali informasi profil Anda.',
      fieldErrors,
    }
  }

  const updated: User = {
    ...users[index],
    name,
    email,
    phone,
  }

  users[index] = updated
  saveUsers(users)
  return { ok: true, data: toSessionUser(updated) }
}

export function updatePassword(
  userId: string,
  input: PasswordInput,
): Result<SessionUser> {
  const users = getUsers()
  const index = users.findIndex(item => item.id === userId)

  if (index === -1) {
    return { ok: false, message: 'Akun tidak ditemukan. Silakan login kembali.' }
  }

  const fieldErrors: Record<string, string> = {}

  if (!input.currentPassword) {
    fieldErrors.currentPassword = 'Password saat ini wajib diisi.'
  } else if (users[index].password !== input.currentPassword) {
    fieldErrors.currentPassword = 'Password saat ini tidak sesuai.'
  }

  if (input.newPassword.length < 6) {
    fieldErrors.newPassword = 'Password baru minimal 6 karakter.'
  } else if (input.newPassword === input.currentPassword) {
    fieldErrors.newPassword = 'Password baru harus berbeda dari password lama.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: 'Password belum dapat diperbarui.',
      fieldErrors,
    }
  }

  const updated: User = {
    ...users[index],
    password: input.newPassword,
  }

  users[index] = updated
  saveUsers(users)
  return { ok: true, data: toSessionUser(updated) }
}

export function isEmailTaken(email: string, exceptUserId?: string): boolean {
  const normalizedEmail = normalizeEmail(email)
  return getUsers().some(
    item =>
      item.id !== exceptUserId &&
      normalizeEmail(item.email) === normalizedEmail,
  )
}
