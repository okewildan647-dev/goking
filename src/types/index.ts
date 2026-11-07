export type Role = 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  role: Role
  createdAt: string
}

export type SessionUser = Omit<User, 'password'>

export interface Session {
  userId: string
  createdAt: string
}

export type CourtType = 'Indoor' | 'Outdoor' | 'VIP'

export interface Court {
  id: string
  name: string
  type: CourtType
  description: string
  pricePerHour: number
  openTime: string
  closeTime: string
  isAvailable: boolean
  createdAt: string
}

export interface CourtInput {
  name: string
  type: CourtType
  description: string
  pricePerHour: number
  openTime: string
  closeTime: string
  isAvailable: boolean
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed'

export interface Booking {
  id: string
  userId: string
  courtId: string
  courtName: string
  date: string
  startTime: string
  endTime: string
  status: BookingStatus
  totalPrice: number
  createdAt: string
}

export interface BookingView extends Booking {
  user: SessionUser | null
  court: Court | null
}

export interface BookingStats {
  total: number
  pending: number
  confirmed: number
  rejected: number
  cancelled: number
  completed: number
  upcoming: number
  revenue: number
}

export interface BookingFilters {
  status: BookingStatus | 'all'
  courtId: string
  query: string
  dateFrom: string
  dateTo: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface ProfileInput {
  name: string
  email: string
  phone: string
}

export interface PasswordInput {
  currentPassword: string
  newPassword: string
}

export interface CreateBookingInput {
  userId: string
  courtId: string
  date: string
  startTime: string
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; fieldErrors?: Record<string, string> }
