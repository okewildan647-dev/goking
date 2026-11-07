export const STORAGE_KEYS = {
  users: 'goking_users_v1',
  session: 'goking_session_v1',
  courts: 'goking_courts_v1',
  bookings: 'goking_bookings_v1',
} as const

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function hasStorage(key: string): boolean {
  return localStorage.getItem(key) !== null
}

export function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorage(key: string): void {
  localStorage.removeItem(key)
}
