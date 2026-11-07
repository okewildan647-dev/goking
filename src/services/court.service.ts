import type { Booking, Court, CourtInput, CourtType, Result } from '../types'
import { COURT_TYPES } from '../utils/constants'
import { toMinutes, todayISO } from '../utils/date'
import { createId } from '../utils/id'
import {
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../utils/storage'

export function getCourts(): Court[] {
  return readStorage<Court[]>(STORAGE_KEYS.courts, [])
}

export function getCourtById(id: string): Court | null {
  return getCourts().find(court => court.id === id) ?? null
}

function normalizeInput(input: CourtInput): CourtInput {
  return {
    name: input.name.trim(),
    type: input.type,
    description: input.description.trim(),
    pricePerHour: Number(input.pricePerHour),
    openTime: input.openTime,
    closeTime: input.closeTime,
    isAvailable: Boolean(input.isAvailable),
  }
}

function validateInput(
  input: CourtInput,
  courts: Court[],
  exceptId?: string,
): Record<string, string> {
  const errors: Record<string, string> = {}

  if (input.name.length < 3) {
    errors.name = 'Nama lapangan minimal 3 karakter.'
  } else if (
    courts.some(
      court =>
        court.id !== exceptId &&
        court.name.toLowerCase() === input.name.toLowerCase(),
    )
  ) {
    errors.name = 'Nama lapangan sudah digunakan.'
  }

  if (!COURT_TYPES.includes(input.type as CourtType)) {
    errors.type = 'Tipe lapangan tidak valid.'
  }

  if (!Number.isFinite(input.pricePerHour) || input.pricePerHour <= 0) {
    errors.pricePerHour = 'Harga per jam harus lebih dari 0.'
  }

  if (
    toMinutes(input.openTime) >= toMinutes(input.closeTime) ||
    !input.openTime ||
    !input.closeTime
  ) {
    errors.closeTime = 'Jam tutup harus lebih besar dari jam buka.'
  }

  return errors
}

export function createCourt(input: CourtInput): Result<Court> {
  const courts = getCourts()
  const normalized = normalizeInput(input)
  const errors = validateInput(normalized, courts)

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: 'Periksa kembali informasi lapangan.',
      fieldErrors: errors,
    }
  }

  const court: Court = {
    ...normalized,
    id: createId('court'),
    createdAt: new Date().toISOString(),
  }

  writeStorage(STORAGE_KEYS.courts, [...courts, court])
  return { ok: true, data: court }
}

export function updateCourt(id: string, input: CourtInput): Result<Court> {
  const courts = getCourts()
  const index = courts.findIndex(court => court.id === id)

  if (index === -1) {
    return { ok: false, message: 'Lapangan tidak ditemukan.' }
  }

  const normalized = normalizeInput(input)
  const errors = validateInput(normalized, courts, id)

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: 'Periksa kembali informasi lapangan.',
      fieldErrors: errors,
    }
  }

  const updated: Court = { ...courts[index], ...normalized }
  courts[index] = updated
  writeStorage(STORAGE_KEYS.courts, courts)
  return { ok: true, data: updated }
}

export function deleteCourt(id: string): Result<null> {
  const courts = getCourts()
  const court = courts.find(item => item.id === id)

  if (!court) {
    return { ok: false, message: 'Lapangan tidak ditemukan.' }
  }

  const bookings = readStorage<Booking[]>(STORAGE_KEYS.bookings, [])
  const hasActiveBookings = bookings.some(
    booking =>
      booking.courtId === id &&
      (booking.status === 'pending' || booking.status === 'confirmed') &&
      booking.date >= todayISO(),
  )

  if (hasActiveBookings) {
    return {
      ok: false,
      message:
        'Lapangan masih memiliki booking aktif. Selesaikan atau batalkan booking tersebut terlebih dahulu.',
    }
  }

  writeStorage(
    STORAGE_KEYS.courts,
    courts.filter(item => item.id !== id),
  )
  return { ok: true, data: null }
}

export function setCourtAvailability(
  id: string,
  isAvailable: boolean,
): Result<Court> {
  const courts = getCourts()
  const index = courts.findIndex(court => court.id === id)

  if (index === -1) {
    return { ok: false, message: 'Lapangan tidak ditemukan.' }
  }

  const updated: Court = { ...courts[index], isAvailable }
  courts[index] = updated
  writeStorage(STORAGE_KEYS.courts, courts)
  return { ok: true, data: updated }
}

export function countActiveBookings(courtId: string): number {
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.bookings, [])
  return bookings.filter(
    booking =>
      booking.courtId === courtId &&
      (booking.status === 'pending' || booking.status === 'confirmed') &&
      booking.date >= todayISO(),
  ).length
}
