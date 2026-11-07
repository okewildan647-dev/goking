import { useState } from 'react'
import {
  Banknote,
  ClipboardList,
  Clock3,
  Download,
  RotateCcw,
  Search,
} from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { BookingTable } from '../components/tables/BookingTable'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { StatCard } from '../components/ui/StatCard'
import { useToast } from '../hooks/useToast'
import {
  deleteBooking,
  filterBookingViews,
  getBookingStats,
  getBookingViews,
  updateBookingStatus,
} from '../services/booking.service'
import { getCourts } from '../services/court.service'
import type {
  BookingFilters,
  BookingStatus,
  BookingView,
} from '../types'
import { STATUS_LABELS, STATUS_ORDER } from '../utils/constants'
import { downloadCsv } from '../utils/csv'
import { formatCurrency } from '../utils/currency'
import { formatDate, humanTimeRange, todayISO } from '../utils/date'

const defaultFilters: BookingFilters = {
  status: 'all',
  courtId: 'all',
  query: '',
  dateFrom: '',
  dateTo: '',
}

export default function AdminBookingsPage() {
  const { notify } = useToast()
  const [bookings, setBookings] = useState<BookingView[]>(getBookingViews)
  const [courts] = useState(getCourts)
  const [filters, setFilters] = useState<BookingFilters>(defaultFilters)
  const [deleteTarget, setDeleteTarget] = useState<BookingView | null>(null)

  const filtered = filterBookingViews(bookings, filters)
  const stats = getBookingStats(filtered)
  const totalValue = filtered.reduce(
    (total, booking) => total + booking.totalPrice,
    0,
  )
  const isFiltering =
    filters.status !== 'all' ||
    filters.courtId !== 'all' ||
    filters.query.trim() !== '' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== ''

  const updateFilters = (patch: Partial<BookingFilters>) => {
    setFilters(current => ({ ...current, ...patch }))
  }

  const refresh = () => setBookings(getBookingViews())

  const handleStatusChange = (booking: BookingView, status: BookingStatus) => {
    const result = updateBookingStatus(booking.id, status)
    if (!result.ok) {
      notify(result.message, 'error')
      refresh()
      return
    }

    notify(
      `Status booking ${booking.court?.name ?? booking.courtName} menjadi ${STATUS_LABELS[status]}.`,
      'success',
    )
    refresh()
  }

  const handleDelete = () => {
    if (!deleteTarget) return

    const result = deleteBooking(deleteTarget.id)
    if (!result.ok) {
      notify(result.message, 'error')
      setDeleteTarget(null)
      refresh()
      return
    }

    notify(
      `Booking ${deleteTarget.court?.name ?? deleteTarget.courtName} berhasil dihapus.`,
      'success',
    )
    setDeleteTarget(null)
    refresh()
  }

  const handleExport = () => {
    if (filtered.length === 0) {
      notify('Tidak ada data booking untuk diekspor.', 'error')
      return
    }

    const rows: Array<Array<string | number>> = [
      [
        'ID Booking',
        'Pengguna',
        'Email',
        'Lapangan',
        'Tanggal',
        'Jam Mulai',
        'Jam Selesai',
        'Status',
        'Total',
        'Dibuat',
      ],
      ...filtered.map(booking => [
        booking.id,
        booking.user?.name ?? 'Pengguna dihapus',
        booking.user?.email ?? '-',
        booking.court?.name ?? booking.courtName,
        booking.date,
        booking.startTime,
        booking.endTime,
        STATUS_LABELS[booking.status],
        booking.totalPrice,
        booking.createdAt,
      ]),
    ]

    downloadCsv(`laporan-booking-goking-${todayISO()}.csv`, rows)
    notify(`Laporan ${filtered.length} booking berhasil diunduh.`, 'success')
  }

  const deleteDescription = deleteTarget
    ? `Booking ${deleteTarget.user?.name ?? 'pengguna'} untuk ${
        deleteTarget.court?.name ?? deleteTarget.courtName
      } pada ${formatDate(deleteTarget.date)} pukul ${humanTimeRange(
        deleteTarget.startTime,
        deleteTarget.endTime,
      )} akan dihapus permanen.`
    : ''

  return (
    <AppShell
      active="admin-bookings"
      title="Kelola Booking"
      subtitle="Proses pemesanan, perbarui status, dan unduh laporan booking."
      actions={
        <Button
          onClick={handleExport}
          leftIcon={<Download className="size-4" />}
        >
          Ekspor Laporan CSV
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={isFiltering ? 'Data Terfilter' : 'Total Booking'}
          value={stats.total}
          helper={`${filtered.length} baris ditampilkan`}
          icon={ClipboardList}
        />
        <StatCard
          label="Menunggu Konfirmasi"
          value={stats.pending}
          helper="Perlu segera diproses"
          icon={Clock3}
          tone="amber"
        />
        <StatCard
          label="Pendapatan"
          value={formatCurrency(stats.revenue)}
          helper="Status diterima + selesai"
          icon={Banknote}
          tone="blue"
        />
        <StatCard
          label="Nilai Booking"
          value={formatCurrency(totalValue)}
          helper="Seluruh status pada filter"
          icon={Banknote}
          tone="violet"
        />
      </div>

      <Card className="mt-5 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Input
            containerClassName="xl:col-span-2"
            label="Cari booking"
            placeholder="Nama pengguna, email, lapangan, atau ID..."
            value={filters.query}
            onChange={event => updateFilters({ query: event.target.value })}
            leftIcon={<Search className="size-4" />}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={event =>
              updateFilters({
                status: event.target.value as BookingStatus | 'all',
              })
            }
          >
            <option value="all">Semua status</option>
            {STATUS_ORDER.map(status => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
          <Select
            label="Lapangan"
            value={filters.courtId}
            onChange={event => updateFilters({ courtId: event.target.value })}
          >
            <option value="all">Semua lapangan</option>
            {courts.map(court => (
              <option key={court.id} value={court.id}>
                {court.name}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-2 md:col-span-2 xl:col-span-1">
            <Input
              label="Dari tanggal"
              type="date"
              value={filters.dateFrom}
              onChange={event => updateFilters({ dateFrom: event.target.value })}
            />
            <Input
              label="Sampai tanggal"
              type="date"
              value={filters.dateTo}
              onChange={event => updateFilters({ dateTo: event.target.value })}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Menampilkan <strong className="text-slate-800">{filtered.length}</strong>{' '}
            dari {bookings.length} booking. Nilai filter:{' '}
            <strong className="text-slate-800">{formatCurrency(totalValue)}</strong>
          </p>
          <Button
            variant="secondary"
            size="sm"
            disabled={!isFiltering}
            onClick={() => setFilters(defaultFilters)}
            leftIcon={<RotateCcw className="size-4" />}
          >
            Reset Filter
          </Button>
        </div>
      </Card>

      <div className="mt-5">
        <BookingTable
          bookings={filtered}
          variant="admin"
          onUpdateStatus={handleStatusChange}
          onDelete={setDeleteTarget}
          emptyTitle={
            isFiltering ? 'Booking tidak ditemukan' : 'Belum ada data booking'
          }
          emptyDescription={
            isFiltering
              ? 'Ubah kata kunci atau filter untuk menemukan data booking.'
              : 'Booking dari pengguna akan tampil di sini setelah dibuat.'
          }
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus data booking?"
        description={deleteDescription}
        confirmLabel="Ya, hapus permanen"
        cancelLabel="Batal"
      />
    </AppShell>
  )
}
