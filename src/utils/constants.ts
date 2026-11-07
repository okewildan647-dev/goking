import type { BookingStatus, CourtType, Role } from '../types'

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Menunggu',
  confirmed: 'Diterima',
  rejected: 'Ditolak',
  cancelled: 'Dibatalkan',
  completed: 'Selesai',
}

export const STATUS_ORDER: BookingStatus[] = [
  'pending',
  'confirmed',
  'completed',
  'rejected',
  'cancelled',
]

export const COURT_TYPES: CourtType[] = ['Indoor', 'Outdoor', 'VIP']

export const ROLE_LABELS: Record<Role, string> = {
  user: 'Pengguna',
  admin: 'Administrator',
}

export const APP_NAME = 'Goking'
export const APP_TAGLINE = 'Go Booking Badminton'
