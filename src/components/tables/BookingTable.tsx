import type { ReactNode } from 'react'
import {
  Ban,
  CalendarClock,
  Check,
  CheckCheck,
  Trash2,
  X,
  XCircle,
} from 'lucide-react'
import type { BookingStatus, BookingView } from '../../types'
import { formatCurrency } from '../../utils/currency'
import { formatDate, formatShortDate, humanTimeRange } from '../../utils/date'
import { StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

interface BookingTableProps {
  bookings: BookingView[]
  variant: 'user' | 'admin'
  onCancel?: (booking: BookingView) => void
  onUpdateStatus?: (booking: BookingView, status: BookingStatus) => void
  onDelete?: (booking: BookingView) => void
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
}

function CourtInfo({ booking }: { booking: BookingView }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-semibold text-slate-800">
        {booking.court?.name ?? booking.courtName}
      </p>
      <p className="truncate text-xs text-slate-500">
        {booking.court?.type ?? 'Lapangan'}
      </p>
    </div>
  )
}

function ScheduleInfo({ booking }: { booking: BookingView }) {
  return (
    <div>
      <p className="font-semibold text-slate-800">{formatShortDate(booking.date)}</p>
      <p className="text-xs text-slate-500">
        {humanTimeRange(booking.startTime, booking.endTime)}
      </p>
    </div>
  )
}

function Actions({
  booking,
  variant,
  onCancel,
  onUpdateStatus,
  onDelete,
}: {
  booking: BookingView
  variant: 'user' | 'admin'
  onCancel?: (booking: BookingView) => void
  onUpdateStatus?: (booking: BookingView, status: BookingStatus) => void
  onDelete?: (booking: BookingView) => void
}) {
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'

  if (variant === 'user') {
    if (!canCancel || !onCancel) {
      return <span className="text-xs text-slate-400">Tidak ada aksi</span>
    }

    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onCancel(booking)}
        leftIcon={<Ban className="size-3.5" />}
        className="text-red-600 hover:border-red-200 hover:bg-red-50"
      >
        Batalkan
      </Button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {booking.status === 'pending' && onUpdateStatus && (
        <>
          <Button
            size="sm"
            variant="success"
            onClick={() => onUpdateStatus(booking, 'confirmed')}
            leftIcon={<Check className="size-3.5" />}
          >
            Terima
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onUpdateStatus(booking, 'rejected')}
            leftIcon={<X className="size-3.5" />}
            className="text-red-600 hover:border-red-200 hover:bg-red-50"
          >
            Tolak
          </Button>
        </>
      )}

      {booking.status === 'confirmed' && onUpdateStatus && (
        <>
          <Button
            size="sm"
            variant="success"
            onClick={() => onUpdateStatus(booking, 'completed')}
            leftIcon={<CheckCheck className="size-3.5" />}
          >
            Selesai
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onUpdateStatus(booking, 'cancelled')}
            leftIcon={<XCircle className="size-3.5" />}
          >
            Batalkan
          </Button>
        </>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(booking)}
          aria-label={`Hapus booking ${booking.id}`}
          title="Hapus booking"
          className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  )
}

export function BookingTable({
  bookings,
  variant,
  onCancel,
  onUpdateStatus,
  onDelete,
  emptyTitle = 'Belum ada booking',
  emptyDescription = 'Booking yang Anda buat akan muncul di sini.',
  emptyAction,
}: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={CalendarClock}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {bookings.map(booking => (
          <Card key={booking.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900">
                  {booking.court?.name ?? booking.courtName}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {formatDate(booking.date)}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Jam
                </p>
                <p className="font-semibold text-slate-700">
                  {humanTimeRange(booking.startTime, booking.endTime)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Total
                </p>
                <p className="font-semibold text-slate-700">
                  {formatCurrency(booking.totalPrice)}
                </p>
              </div>
              {variant === 'admin' && (
                <div className="col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Pengguna
                  </p>
                  <p className="truncate font-semibold text-slate-700">
                    {booking.user?.name ?? 'Pengguna dihapus'}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {booking.user?.email}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-3">
              <Actions
                booking={booking}
                variant={variant}
                onCancel={onCancel}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            </div>
          </Card>
        ))}
      </div>

      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50/90">
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                {variant === 'admin' && <th className="px-5 py-3.5 font-bold">Pengguna</th>}
                <th className="px-5 py-3.5 font-bold">Lapangan</th>
                <th className="px-5 py-3.5 font-bold">Jadwal</th>
                <th className="px-5 py-3.5 font-bold">Total</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(booking => (
                <tr key={booking.id} className="transition hover:bg-slate-50/70">
                  {variant === 'admin' && (
                    <td className="px-5 py-4">
                      <p className="max-w-44 truncate font-semibold text-slate-800">
                        {booking.user?.name ?? 'Pengguna dihapus'}
                      </p>
                      <p className="max-w-44 truncate text-xs text-slate-500">
                        {booking.user?.email ?? '-'}
                      </p>
                    </td>
                  )}
                  <td className="px-5 py-4">
                    <CourtInfo booking={booking} />
                  </td>
                  <td className="px-5 py-4">
                    <ScheduleInfo booking={booking} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                    {formatCurrency(booking.totalPrice)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-5 py-4">
                    <Actions
                      booking={booking}
                      variant={variant}
                      onCancel={onCancel}
                      onUpdateStatus={onUpdateStatus}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
