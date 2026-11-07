import { useState } from 'react'
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Hourglass,
  MapPinned,
  TrendingUp,
  Users,
} from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { StatusBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { LinkButton } from '../components/ui/LinkButton'
import { StatCard } from '../components/ui/StatCard'
import { getUsers } from '../services/auth.service'
import {
  getBookingStats,
  getBookingViews,
} from '../services/booking.service'
import { getCourts } from '../services/court.service'
import { formatCurrency } from '../utils/currency'
import {
  formatShortDate,
  humanTimeRange,
  relativeDayLabel,
  todayISO,
} from '../utils/date'
import { STATUS_LABELS } from '../utils/constants'

const LAST_UPDATED_LABEL = formatShortDate(todayISO())

export default function AdminDashboardPage() {
  const [bookings] = useState(getBookingViews)
  const [courts] = useState(getCourts)
  const [userCount] = useState(
    () => getUsers().filter(user => user.role === 'user').length,
  )

  const stats = getBookingStats(bookings)
  const recent = bookings.slice(0, 5)
  const statusRows = [
    { key: 'pending' as const, color: 'bg-amber-500' },
    { key: 'confirmed' as const, color: 'bg-emerald-500' },
    { key: 'completed' as const, color: 'bg-sky-500' },
    { key: 'rejected' as const, color: 'bg-rose-500' },
    { key: 'cancelled' as const, color: 'bg-slate-400' },
  ]

  const courtCounts = courts
    .map(court => ({
      court,
      count: bookings.filter(booking => booking.courtId === court.id).length,
    }))
    .sort((a, b) => b.count - a.count)
  const maxCourtCount = courtCounts[0]?.count ?? 0

  return (
    <AppShell
      active="admin"
      title="Dashboard Admin"
      subtitle="Ringkasan operasional booking, lapangan, dan pengguna Goking."
      actions={
        <>
          <LinkButton
            href="admin-bookings.html"
            variant="secondary"
            leftIcon={<ClipboardList className="size-4" />}
          >
            Kelola Booking
          </LinkButton>
          <LinkButton
            href="admin-courts.html"
            leftIcon={<MapPinned className="size-4" />}
          >
            Kelola Lapangan
          </LinkButton>
        </>
      }
    >
      {stats.pending > 0 && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <Hourglass className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-amber-900">
                {stats.pending} booking menunggu konfirmasi
              </p>
              <p className="mt-0.5 text-xs text-amber-700">
                Proses sekarang agar pengguna mendapat kepastian jadwal.
              </p>
            </div>
          </div>
          <LinkButton
            href="admin-bookings.html"
            size="sm"
            variant="secondary"
            className="border-amber-200 bg-white text-amber-800 hover:bg-amber-100"
            rightIcon={<ArrowRight className="size-3.5" />}
          >
            Proses Booking
          </LinkButton>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Booking"
          value={stats.total}
          helper="Seluruh data pemesanan"
          icon={CalendarDays}
        />
        <StatCard
          label="Pendapatan"
          value={formatCurrency(stats.revenue)}
          helper="Diterima + selesai"
          icon={Banknote}
          tone="blue"
        />
        <StatCard
          label="Booking Aktif"
          value={stats.upcoming}
          helper="Menunggu atau diterima"
          icon={TrendingUp}
          tone="amber"
        />
        <StatCard
          label="Lapangan"
          value={`${courts.filter(court => court.isAvailable).length}/${courts.length}`}
          helper={`${userCount} pengguna terdaftar`}
          icon={MapPinned}
          tone="violet"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-extrabold text-slate-900">Pemesanan terbaru</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Lima booking yang terakhir masuk ke sistem.
              </p>
            </div>
            <a
              href="admin-bookings.html"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
            >
              Lihat semua
              <ChevronRight className="size-4" />
            </a>
          </div>

          {recent.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Belum ada booking yang masuk.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map(booking => (
                <a
                  key={booking.id}
                  href="admin-bookings.html"
                  className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50 sm:px-5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <CalendarDays className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {booking.user?.name ?? 'Pengguna dihapus'}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {booking.court?.name ?? booking.courtName} &middot;{' '}
                      {relativeDayLabel(booking.date)},{' '}
                      {humanTimeRange(booking.startTime, booking.endTime)}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-bold text-slate-700">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                    <div className="mt-1 flex justify-end">
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                  <div className="sm:hidden">
                    <StatusBadge status={booking.status} />
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-slate-300" />
                </a>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-slate-900">Distribusi status</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Kondisi seluruh booking.
              </p>
            </div>
            <ClipboardList className="size-5 text-brand-600" />
          </div>

          <div className="mt-5 space-y-3.5">
            {statusRows.map(item => {
              const value = stats[item.key]
              const percent =
                stats.total > 0 ? Math.round((value / stats.total) * 100) : 0

              return (
                <div key={item.key}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">
                      {STATUS_LABELS[item.key]}
                    </span>
                    <span className="font-bold text-slate-800">
                      {value} <span className="font-medium text-slate-400">({percent}%)</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-brand-50 p-3">
              <CheckCircle2 className="size-4 text-brand-700" />
              <p className="mt-2 text-lg font-extrabold text-brand-900">
                {stats.completed}
              </p>
              <p className="text-[10px] text-brand-700">Selesai</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <Users className="size-4 text-slate-600" />
              <p className="mt-2 text-lg font-extrabold text-slate-900">{userCount}</p>
              <p className="text-[10px] text-slate-500">Pengguna</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-slate-900">Lapangan terpopuler</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Berdasarkan jumlah seluruh booking.
              </p>
            </div>
            <TrendingUp className="size-5 text-brand-600" />
          </div>

          <div className="mt-5 space-y-4">
            {courtCounts.map(({ court, count }) => {
              const percent = maxCourtCount > 0 ? Math.round((count / maxCourtCount) * 100) : 0
              return (
                <div key={court.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {court.name}{' '}
                      <span className="font-medium text-slate-400">
                        &middot; {court.type}
                      </span>
                    </span>
                    <span className="font-bold text-slate-800">{count} booking</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-slate-900">Akses cepat</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Kelola operasional Goking dari satu tempat.
              </p>
            </div>
            <MapPinned className="size-5 text-brand-600" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href="admin-bookings.html"
              className="group rounded-2xl border border-slate-200 p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <ClipboardList className="size-5" />
              </span>
              <p className="mt-3 font-bold text-slate-800">Kelola booking</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Terima, tolak, selesaikan, dan hapus pemesanan.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                Buka halaman
                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </a>

            <a
              href="admin-courts.html"
              className="group rounded-2xl border border-slate-200 p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-700">
                <MapPinned className="size-5" />
              </span>
              <p className="mt-3 font-bold text-slate-800">Kelola lapangan</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Atur harga, jadwal operasional, dan ketersediaan.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                Buka halaman
                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>

          <div className="mt-4 rounded-2xl bg-brand-950 p-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-300">
              Laporan pemesanan
            </p>
            <p className="mt-1 text-sm font-semibold">
              Unduh data booking lengkap dalam format CSV.
            </p>
            <LinkButton
              href="admin-bookings.html"
              size="sm"
              className="mt-3 bg-white text-brand-950 hover:bg-brand-50"
              rightIcon={<ArrowRight className="size-3.5" />}
            >
              Buka Laporan
            </LinkButton>
          </div>
        </Card>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Data terakhir dimuat dari localStorage. Terakhir diperbarui:{' '}
        {LAST_UPDATED_LABEL}.
      </p>
    </AppShell>
  )
}
