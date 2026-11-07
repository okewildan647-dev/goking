import type {
  Booking,
  BookingFilters,
  BookingStats,
  BookingStatus,
  BookingView,
  CreateBookingInput,
  Result,
} from '../types'
import { addHour, generateTimeSlots, isPastSlot, todayISO } from '../utils/date'
import { createId } from '../utils/id'
import {
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../utils/storage'
import { getUsers, toSessionUser } from './auth.service'
import { getCourtById, getCourts } from './court.service'

const ACTIVE_STATUSES: BookingStatus[] = ['pending', 'confirmed']

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  rejected: [],
  cancelled: [],
  completed: [],
}

export function getBookings(): Booking[] {
  return readStorage<Booking[]>(STORAGE_KEYS.bookings, []).slice().sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  )
}

function saveBookings(bookings: Booking[]): void {
  writeStorage(STORAGE_KEYS.bookings, bookings)
}

export function getBookingViews(): BookingView[] {
  const users = getUsers()
  const courts = getCourts()
  const userMap = new Map(users.map(user => [user.id, toSessionUser(user)]))
  const courtMap = new Map(courts.map(court => [court.id, court]))

  return getBookings().map(booking => ({
    ...booking,
    user: userMap.get(booking.userId) ?? null,
    court: courtMap.get(booking.courtId) ?? null,
  }))
}

export function getBookingViewsForUser(userId: string): BookingView[] {
  return getBookingViews().filter(booking => booking.userId === userId)
}

export function getBookedSlots(courtId: string, date: string): string[] {
  return getBookings()
    .filter(
      booking =>
        booking.courtId === courtId &&
        booking.date === date &&
        ACTIVE_STATUSES.includes(booking.status),
    )
    .map(booking => booking.startTime)
}

export function hasConflict(
  courtId: string,
  date: string,
  startTime: string,
  exceptId?: string,
): boolean {
  return getBookings().some(
    booking =>
      booking.id !== exceptId &&
      booking.courtId === courtId &&
      booking.date === date &&
      booking.startTime === startTime &&
      ACTIVE_STATUSES.includes(booking.status),
  )
}

export function createBooking(input: CreateBookingInput): Result<Booking> {
  const user = getUsers().find(item => item.id === input.userId)
  if (!user) {
    return { ok: false, message: 'Sesi pengguna tidak valid. Silakan login kembali.' }
  }

  const court = getCourtById(input.courtId)
  if (!court) {
    return { ok: false, message: 'Lapangan tidak ditemukan.' }
  }

  if (!court.isAvailable) {
    return {
      ok: false,
      message: 'Lapangan sedang tidak tersedia untuk pemesanan.',
    }
  }

  if (!input.date || input.date < todayISO()) {
    return { ok: false, message: 'Tanggal booking tidak valid.' }
  }

  const slots = generateTimeSlots(court.openTime, court.closeTime)
  if (!slots.includes(input.startTime)) {
    return {
      ok: false,
      message: 'Jam yang dipilih berada di luar jam operasional lapangan.',
    }
  }

  if (isPastSlot(input.date, input.startTime)) {
    return {
      ok: false,
      message: 'Jam tersebut sudah lewat. Silakan pilih jadwal lain.',
    }
  }

  if (hasConflict(input.courtId, input.date, input.startTime)) {
    return {
      ok: false,
      message: 'Jadwal tersebut baru saja dipesan. Silakan pilih jam lain.',
    }
  }

  const booking: Booking = {
    id: createId('booking'),
    userId: user.id,
    courtId: court.id,
    courtName: court.name,
    date: input.date,
    startTime: input.startTime,
    endTime: addHour(input.startTime),
    status: 'pending',
    totalPrice: court.pricePerHour,
    createdAt: new Date().toISOString(),
  }

  saveBookings([...getBookings(), booking])
  return { ok: true, data: booking }
}

export function cancelBooking(id: string, userId: string): Result<Booking> {
  const bookings = getBookings()
  const index = bookings.findIndex(booking => booking.id === id)

  if (index === -1) {
    return { ok: false, message: 'Booking tidak ditemukan.' }
  }

  const booking = bookings[index]
  if (booking.userId !== userId) {
    return { ok: false, message: 'Anda tidak berhak membatalkan booking ini.' }
  }

  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    return {
      ok: false,
      message: 'Booking dengan status ini tidak dapat dibatalkan.',
    }
  }

  const updated: Booking = { ...booking, status: 'cancelled' }
  bookings[index] = updated
  saveBookings(bookings)
  return { ok: true, data: updated }
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Result<Booking> {
  const bookings = getBookings()
  const index = bookings.findIndex(booking => booking.id === id)

  if (index === -1) {
    return { ok: false, message: 'Booking tidak ditemukan.' }
  }

  const booking = bookings[index]
  if (!ALLOWED_TRANSITIONS[booking.status].includes(status)) {
    return {
      ok: false,
      message: 'Perubahan status tersebut tidak diizinkan.',
    }
  }

  const updated: Booking = { ...booking, status }
  bookings[index] = updated
  saveBookings(bookings)
  return { ok: true, data: updated }
}

export function deleteBooking(id: string): Result<null> {
  const bookings = getBookings()
  if (!bookings.some(booking => booking.id === id)) {
    return { ok: false, message: 'Booking tidak ditemukan.' }
  }

  saveBookings(bookings.filter(booking => booking.id !== id))
  return { ok: true, data: null }
}

export function getBookingStats(bookings: Booking[]): BookingStats {
  const today = todayISO()
  const revenueStatuses: BookingStatus[] = ['confirmed', 'completed']

  return {
    total: bookings.length,
    pending: bookings.filter(booking => booking.status === 'pending').length,
    confirmed: bookings.filter(booking => booking.status === 'confirmed').length,
    rejected: bookings.filter(booking => booking.status === 'rejected').length,
    cancelled: bookings.filter(booking => booking.status === 'cancelled').length,
    completed: bookings.filter(booking => booking.status === 'completed').length,
    upcoming: bookings.filter(
      booking =>
        ACTIVE_STATUSES.includes(booking.status) && booking.date >= today,
    ).length,
    revenue: bookings
      .filter(booking => revenueStatuses.includes(booking.status))
      .reduce((total, booking) => total + booking.totalPrice, 0),
  }
}

export function filterBookingViews(
  bookings: BookingView[],
  filters: BookingFilters,
): BookingView[] {
  const query = filters.query.trim().toLowerCase()

  return bookings.filter(booking => {
    if (filters.status !== 'all' && booking.status !== filters.status) {
      return false
    }

    if (filters.courtId !== 'all' && booking.courtId !== filters.courtId) {
      return false
    }

    if (filters.dateFrom && booking.date < filters.dateFrom) return false
    if (filters.dateTo && booking.date > filters.dateTo) return false

    if (query) {
      const haystack = [
        booking.id,
        booking.user?.name ?? '',
        booking.user?.email ?? '',
        booking.court?.name ?? booking.courtName,
        booking.date,
      ]
        .join(' ')
        .toLowerCase()

      if (!haystack.includes(query)) return false
    }

    return true
  })
}
