import { useState } from 'react'
import {
  CalendarCheck2,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Hourglass,
  RotateCcw,
  Search,
} from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { BookingTable } from '../components/tables/BookingTable'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Input } from '../components/ui/Input'
import { LinkButton } from '../components/ui/LinkButton'
import { Select } from '../components/ui/Select'
import { StatCard } from '../components/ui/StatCard'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import {
  cancelBooking,
  getBookingStats,
  getBookingViewsForUser,
} from '../services/booking.service'
import type { BookingStatus, BookingView } from '../types'
import { STATUS_LABELS, STATUS_ORDER } from '../utils/constants'
import { formatDate, humanTimeRange } from '../utils/date'

export default function MyBookingsPage() {
  const { user } = useAuth()
  const { notify } = useToast()
  const [bookings, setBookings] = useState<BookingView[]>(() =>
    user ? getBookingViewsForUser(user.id) : [],
  )
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [cancelTarget, setCancelTarget] = useState<BookingView | null>(null)

  if (!user) return null

  const stats = getBookingStats(bookings)
  const sorted = [...bookings].sort((a, b) =>
    `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`),
  )
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = sorted.filter(booking => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false
    if (!normalizedQuery) return true

    return [
      booking.court?.name ?? booking.courtName,
      booking.date,
      booking.startTime,
      STATUS_LABELS[booking.status],
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  })

  const refresh = () => {
    setBookings(getBookingViewsForUser(user.id))
  }

  const handleCancel = () => {
    if (!cancelTarget) return

    const result = cancelBooking(cancelTarget.id, user.id)
    if (!result.ok) {
      notify(result.message, 'error')
      refresh()
      setCancelTarget(null)
      return
    }

    notify(
      `Booking ${cancelTarget.court?.name ?? cancelTarget.courtName} berhasil dibatalkan.`,
      'success',
    )
    setCancelTarget(null)
    refresh()
  }

  const isFiltering = statusFilter !== 'all' || query.trim() !== ''

  const cancelDescription = cancelTarget
    ? `Booking ${cancelTarget.court?.name ?? cancelTarget.courtName} pada ${formatDate(
        cancelTarget.date,
      )} pukul ${humanTimeRange(
        cancelTarget.startTime,
        cancelTarget.endTime,
      )} akan dibatalkan. Tindakan ini tidak dapat diubah.`
    : ''

  return (
    <AppShell
      active="bookings"
      title="Booking Saya"
      subtitle="Lihat seluruh riwayat pemesanan dan batalkan jadwal yang tidak jadi dipakai."
      actions={
        <LinkButton
          href="schedule.html"
          leftIcon={<CalendarPlus className="size-4" />}
        >
          Booking Baru
        </LinkButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Booking"
          value={stats.total}
          helper="Seluruh riwayat"
          icon={CalendarCheck2}
        />
        <StatCard
          label="Booking Aktif"
          value={stats.upcoming}
          helper="Menunggu atau diterima"
          icon={Hourglass}
          tone="amber"
        />
        <StatCard
          label="Menunggu Konfirmasi"
          value={stats.pending}
          helper="Belum diproses admin"
          icon={Clock3}
          tone="violet"
        />
        <StatCard
          label="Selesai"
          value={stats.completed}
          helper="Booking tuntas"
          icon={CheckCircle2}
          tone="blue"
        />
      </div>

      <Card className="mt-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            containerClassName="flex-1"
            placeholder="Cari lapangan, tanggal, atau status..."
            value={query}
            onChange={event => setQuery(event.target.value)}
            leftIcon={<Search className="size-4" />}
            aria-label="Cari booking"
          />
          <Select
            containerClassName="sm:w-48"
            value={statusFilter}
            onChange={event =>
              setStatusFilter(event.target.value as BookingStatus | 'all')
            }
            aria-label="Filter status booking"
          >
            <option value="all">Semua status</option>
            {STATUS_ORDER.map(status => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
          <Button
            variant="secondary"
            onClick={() => {
              setStatusFilter('all')
              setQuery('')
            }}
            disabled={!isFiltering}
            leftIcon={<RotateCcw className="size-4" />}
          >
            Reset
          </Button>
        </div>
      </Card>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Menampilkan <strong className="text-slate-800">{filtered.length}</strong>{' '}
            dari {bookings.length} booking
          </p>
        </div>

        <BookingTable
          bookings={filtered}
          variant="user"
          onCancel={setCancelTarget}
          emptyTitle={isFiltering ? 'Booking tidak ditemukan' : 'Belum ada booking'}
          emptyDescription={
            isFiltering
              ? 'Coba ubah kata kunci atau filter status yang dipakai.'
              : 'Pilih lapangan favoritmu dan buat booking pertama sekarang.'
          }
          emptyAction={
            <LinkButton href="schedule.html" size="sm">
              Cari Jadwal Lapangan
            </LinkButton>
          }
        />
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Batalkan booking?"
        description={cancelDescription}
        confirmLabel="Ya, batalkan"
        cancelLabel="Tidak, kembali"
      />
    </AppShell>
  )
}
