import type { Booking, Court, User } from '../types'
import { addDaysISO } from './date'
import { hasStorage, STORAGE_KEYS, writeStorage } from './storage'

const seedUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Administrator Goking',
    email: 'admin@goking.test',
    password: 'admin123',
    phone: '0812-0000-0001',
    role: 'admin',
    createdAt: '2026-01-05T02:00:00.000Z',
  },
  {
    id: 'user-demo',
    name: 'Rizky Pratama',
    email: 'user@goking.test',
    password: 'user123',
    phone: '0812-3456-7890',
    role: 'user',
    createdAt: '2026-02-14T04:30:00.000Z',
  },
  {
    id: 'user-budi',
    name: 'Budi Santoso',
    email: 'budi@goking.test',
    password: 'budi123',
    phone: '0813-7788-9900',
    role: 'user',
    createdAt: '2026-03-02T06:15:00.000Z',
  },
]

const seedCourts: Court[] = [
  {
    id: 'court-1',
    name: 'Lapangan 1',
    type: 'Indoor',
    description: 'Lapangan indoor standar BWF dengan karpet vinyl dan pencahayaan LED.',
    pricePerHour: 75000,
    openTime: '08:00',
    closeTime: '22:00',
    isAvailable: true,
    createdAt: '2026-01-05T02:10:00.000Z',
  },
  {
    id: 'court-2',
    name: 'Lapangan 2',
    type: 'Indoor',
    description: 'Lapangan indoor nyaman untuk latihan rutin dan pertandingan komunitas.',
    pricePerHour: 90000,
    openTime: '08:00',
    closeTime: '22:00',
    isAvailable: true,
    createdAt: '2026-01-05T02:11:00.000Z',
  },
  {
    id: 'court-3',
    name: 'Lapangan 3',
    type: 'Outdoor',
    description: 'Lapangan outdoor dengan sirkulasi udara terbuka dan tribun kecil.',
    pricePerHour: 60000,
    openTime: '07:00',
    closeTime: '21:00',
    isAvailable: true,
    createdAt: '2026-01-05T02:12:00.000Z',
  },
  {
    id: 'court-4',
    name: 'Lapangan VIP',
    type: 'VIP',
    description: 'Lapangan premium dengan area tunggu ber-AC dan tribun privat.',
    pricePerHour: 120000,
    openTime: '07:00',
    closeTime: '23:00',
    isAvailable: true,
    createdAt: '2026-01-05T02:13:00.000Z',
  },
]

function buildSeedBookings(): Booking[] {
  const now = new Date().toISOString()

  return [
    {
      id: 'booking-seed-1',
      userId: 'user-demo',
      courtId: 'court-1',
      courtName: 'Lapangan 1',
      date: addDaysISO(2),
      startTime: '18:00',
      endTime: '19:00',
      status: 'confirmed',
      totalPrice: 75000,
      createdAt: now,
    },
    {
      id: 'booking-seed-2',
      userId: 'user-demo',
      courtId: 'court-2',
      courtName: 'Lapangan 2',
      date: addDaysISO(5),
      startTime: '19:00',
      endTime: '20:00',
      status: 'pending',
      totalPrice: 90000,
      createdAt: now,
    },
    {
      id: 'booking-seed-3',
      userId: 'user-budi',
      courtId: 'court-3',
      courtName: 'Lapangan 3',
      date: addDaysISO(3),
      startTime: '17:00',
      endTime: '18:00',
      status: 'pending',
      totalPrice: 60000,
      createdAt: now,
    },
    {
      id: 'booking-seed-4',
      userId: 'user-budi',
      courtId: 'court-1',
      courtName: 'Lapangan 1',
      date: addDaysISO(-4),
      startTime: '20:00',
      endTime: '21:00',
      status: 'completed',
      totalPrice: 75000,
      createdAt: now,
    },
    {
      id: 'booking-seed-5',
      userId: 'user-budi',
      courtId: 'court-4',
      courtName: 'Lapangan VIP',
      date: addDaysISO(1),
      startTime: '09:00',
      endTime: '10:00',
      status: 'rejected',
      totalPrice: 120000,
      createdAt: now,
    },
    {
      id: 'booking-seed-6',
      userId: 'user-demo',
      courtId: 'court-4',
      courtName: 'Lapangan VIP',
      date: addDaysISO(-2),
      startTime: '19:00',
      endTime: '20:00',
      status: 'completed',
      totalPrice: 120000,
      createdAt: now,
    },
  ]
}

export function ensureSeeded(): void {
  if (!hasStorage(STORAGE_KEYS.users)) {
    writeStorage(STORAGE_KEYS.users, seedUsers)
  }

  if (!hasStorage(STORAGE_KEYS.courts)) {
    writeStorage(STORAGE_KEYS.courts, seedCourts)
  }

  if (!hasStorage(STORAGE_KEYS.bookings)) {
    writeStorage(STORAGE_KEYS.bookings, buildSeedBookings())
  }
}
