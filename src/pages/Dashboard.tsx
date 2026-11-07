import { useState } from 'react'
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  CalendarPlus,
  ChevronRight,
  Clock3,
  Hourglass,
  MapPin,
  MapPinned,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { StatusBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { LinkButton } from '../components/ui/LinkButton'
import { StatCard } from '../components/ui/StatCard'
import { useAuth } from '../hooks/useAuth'
import {
  getBookingStats,
  getBookingViewsForUser,
} from '../services/booking.service'
import { getCourts } from '../services/court.service'
import { formatCurrency } from '../utils/currency'
import {
  formatShortDate,
  humanTimeRange,
  relativeDayLabel,
  todayISO,
} from '../utils/date'

export default function DashboardPage() {
  const { user } = useAuth()
  const [bookings] = useState(() =>
    user ? getBookingViewsForUser(user.id) : [],
  )
  const [courts] = useState(getCourts)

  if (!user) return null

  const stats = getBookingStats(bookings)
  const today = todayISO()
  const upcoming = bookings
    .filter(
      booking =>
        (booking.status === 'pending' || booking.status === 'confirmed') &&
        booking.date >= today,
    )
    .sort((a, b) =>
      `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`),
    )[0]

  const recent = bookings.slice(0, 5)
  const availableCourts = courts.filter(court => court.isAvailable)
  const statusRows = [
    { label: 'Menunggu', value: stats.pending, color: 'bg-amber-500' },
    { label: 'Diterima', value: stats.confirmed, color: 'bg-emerald-500' },
    { label: 'Selesai', value: stats.completed, color: 'bg-sky-500' },
    {
      label: 'Dibatalkan / ditolak',
      value: stats.cancelled + stats.rejected,
      color: 'bg-slate-400',
    },
  ]

  return (
    <AppShell
      active="dashboard"
      title={`Halo, ${user.name.split(' ')[0]}!`}
      subtitle="Pantau jadwal, status booking, dan lapangan yang siap dipesan."
      actions={
        <LinkButton
          href="schedule.html"
          leftIcon={<CalendarPlus className="size-4" />}
        >
          Booking Lapangan
        </LinkButton>
      }
    >
      <section className="relative overflow-hidden rounded-3xl bg-brand-950 p-6 text-white shadow-lg shadow-brand-950/10 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-24 size-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-8 size-28 rounded-full border border-white/10" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-brand-200">
              <Sparkles className="size-3.5" />
              Siap bermain?
            </span>
            <h2 className="mt-4 max-w-xl text-2xl font-black leading-tight tracking-tight sm:text-3xl">
              Waktunya main badminton. Pilih lapangan dan amankan jadwalmu.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-100/80">
              Slot diperbarui langsung dari data booking. Pesanan yang bentrok akan
              otomatis ditolak agar jadwal tetap adil.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <LinkButton
                href="schedule.html"
                size="lg"
                className="bg-white text-brand-950 shadow-none hover:bg-brand-50 focus-visible:ring-white/30"
                leftIcon={<CalendarPlus className="size-4" />}
              >
                Pesan Sekarang
              </LinkButton>
              <LinkButton
                href="my-bookings.html"
                size="lg"
                variant="ghost"
                className="text-brand-100 hover:bg-white/10 hover:text-white focus-visible:ring-white/20"
                rightIcon={<ArrowRight className="size-4" />}
              >
                Lihat Booking Saya
              </LinkButton>
            </div>
          </div>

          {upcoming ? (
            <div className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:min-w-72">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200">
                  Booking berikutnya
                </p>
                <StatusBadge status={upcoming.status} />
              </div>
              <p className="mt-3 text-lg font-extrabold">
                {upcoming.court?.name ?? upcoming.courtName}
              </p>
              <div className="mt-2 space-y-1.5 text-sm text-brand-100">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-brand-300" />
                  {relativeDayLabel(upcoming.date)} &middot;{' '}
                  {humanTimeRange(upcoming.startTime, upcoming.endTime)}
                </p>
                <p className="flex items-center gap-2">
                  <Wallet className="size-4 text-brand-300" />
                  {formatCurrency(upcoming.totalPrice)}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-center sm:min-w-72">
              <CalendarCheck2 className="mx-auto size-8 text-brand-300" />
              <p className="mt-3 text-sm font-bold">Belum ada jadwal berikutnya</p>
              <p className="mt-1 text-xs leading-5 text-brand-200/70">
                Pilih slot favoritmu dan mulai bermain.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Booking Saya"
          value={stats.total}
          helper="Semua riwayat pemesanan"
          icon={CalendarDays}
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
          helper="Perlu diproses admin"
          icon={Clock3}
          tone="violet"
        />
        <StatCard
          label="Lapangan Tersedia"
          value={`${availableCourts.length}/${courts.length}`}
          helper="Siap dipesan sekarang"
          icon={MapPinned}
          tone="blue"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-extrabold text-slate-900">Booking terbaru</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Lima aktivitas pemesanan terakhir Anda.
              </p>
            </div>
            <a
              href="my-bookings.html"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
            >
              Lihat semua
              <ChevronRight className="size-4" />
            </a>
          </div>

          {recent.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Belum ada booking"
              description="Setelah memesan lapangan, riwayat booking akan muncul di sini."
              action={
                <LinkButton href="schedule.html" size="sm">
                  Cari Jadwal
                </LinkButton>
              }
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map(booking => (
                <a
                  key={booking.id}
                  href="my-bookings.html"
                  className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50 sm:px-5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <CalendarDays className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {booking.court?.name ?? booking.courtName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {formatShortDate(booking.date)} &middot;{' '}
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
              <h2 className="font-extrabold text-slate-900">Ringkasan status</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Distribusi booking Anda.
              </p>
            </div>
            <Wallet className="size-5 text-brand-600" />
          </div>

          <div className="mt-5 space-y-4">
            {statusRows.map(item => {
              const percent =
                stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-800">{item.value}</span>
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

          <div className="mt-5 rounded-xl bg-slate-50 p-3.5">
            <p className="text-xs text-slate-500">Total nilai booking</p>
            <p className="mt-1 text-lg font-extrabold text-slate-900">
              {formatCurrency(
                bookings.reduce((total, booking) => total + booking.totalPrice, 0),
              )}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Termasuk semua status pemesanan.
            </p>
          </div>
        </Card>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Lapangan &amp; harga
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Daftar lapangan yang dikelola Goking.
            </p>
          </div>
          <a
            href="schedule.html"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
          >
            Lihat jadwal
            <ChevronRight className="size-4" />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {courts.map(court => (
            <Card key={court.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <MapPin className="size-5" />
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${
                    court.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : 'bg-rose-50 text-rose-700 ring-rose-200'
                  }`}
                >
                  {court.isAvailable ? 'Tersedia' : 'Nonaktif'}
                </span>
              </div>
              <h3 className="mt-3 font-extrabold text-slate-900">{court.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {court.type} &middot; {court.openTime}-{court.closeTime}
              </p>
              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    {formatCurrency(court.pricePerHour)}
                  </p>
                  <p className="text-[10px] text-slate-400">per jam</p>
                </div>
                <a
                  href="schedule.html"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  Pesan
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
