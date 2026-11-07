import { useState } from 'react'
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  MapPin,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { createBooking, getBookings } from '../services/booking.service'
import { getCourts } from '../services/court.service'
import type { Booking } from '../types'
import { cn } from '../utils/classnames'
import { formatCurrency } from '../utils/currency'
import {
  addHour,
  formatDate,
  generateTimeSlots,
  humanTimeRange,
  isPastSlot,
  todayISO,
} from '../utils/date'

export default function SchedulePage() {
  const { user } = useAuth()
  const { notify } = useToast()
  const [courts] = useState(getCourts)
  const [bookings, setBookings] = useState<Booking[]>(getBookings)
  const [selectedCourtId, setSelectedCourtId] = useState(
    () => courts.find(court => court.isAvailable)?.id ?? courts[0]?.id ?? '',
  )
  const [date, setDate] = useState(todayISO())
  const [selectedTime, setSelectedTime] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!user) return null

  const selectedCourt = courts.find(court => court.id === selectedCourtId) ?? null
  const slots = selectedCourt
    ? generateTimeSlots(selectedCourt.openTime, selectedCourt.closeTime)
    : []

  const bookedSlots = bookings
    .filter(
      booking =>
        booking.courtId === selectedCourtId &&
        booking.date === date &&
        (booking.status === 'pending' || booking.status === 'confirmed'),
    )
    .map(booking => booking.startTime)

  const handleCourtChange = (courtId: string) => {
    setSelectedCourtId(courtId)
    setSelectedTime('')
  }

  const handleDateChange = (value: string) => {
    setDate(value)
    setSelectedTime('')
  }

  const handleOpenConfirm = () => {
    if (!selectedCourt || !selectedTime || !date) {
      notify('Pilih lapangan, tanggal, dan jam terlebih dahulu.', 'error')
      return
    }
    if (!selectedCourt.isAvailable) {
      notify('Lapangan sedang tidak tersedia untuk booking.', 'error')
      return
    }
    setConfirmOpen(true)
  }

  const handleConfirmBooking = () => {
    if (!selectedCourt || !selectedTime || !date) return

    const result = createBooking({
      userId: user.id,
      courtId: selectedCourt.id,
      date,
      startTime: selectedTime,
    })

    setConfirmOpen(false)

    if (!result.ok) {
      notify(result.message, 'error')
      setBookings(getBookings())
      setSelectedTime('')
      return
    }

    notify(
      `Booking ${selectedCourt.name} berhasil dibuat dan menunggu konfirmasi admin.`,
      'success',
    )
    setBookings(getBookings())
    setSelectedTime('')
    window.setTimeout(() => {
      window.location.href = 'my-bookings.html'
    }, 800)
  }

  const confirmDescription =
    selectedCourt && selectedTime && date
      ? `${selectedCourt.name} pada ${formatDate(date)} pukul ${humanTimeRange(
          selectedTime,
          addHour(selectedTime),
        )}. Total ${formatCurrency(
          selectedCourt.pricePerHour,
        )} dan status awal booking adalah Menunggu.`
      : ''

  return (
    <AppShell
      active="schedule"
      title="Jadwal Lapangan"
      subtitle="Pilih lapangan, tanggal, lalu klik jam yang masih kosong."
    >
      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <MapPin className="size-4" />
              </span>
              <div>
                <h2 className="font-extrabold text-slate-900">1. Pilih lapangan</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Harga dan jam operasional mengikuti lapangan yang dipilih.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {courts.map(court => {
                const isSelected = court.id === selectedCourtId
                return (
                  <button
                    key={court.id}
                    type="button"
                    onClick={() => handleCourtChange(court.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition',
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-100'
                        : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/30',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-slate-900">{court.name}</span>
                      <Badge tone={court.isAvailable ? 'brand' : 'rose'}>
                        {court.isAvailable ? 'Tersedia' : 'Nonaktif'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {court.type} &middot; {court.openTime}-{court.closeTime}
                    </p>
                    <p className="mt-3 text-sm font-extrabold text-brand-700">
                      {formatCurrency(court.pricePerHour)}
                      <span className="text-[10px] font-medium text-slate-400"> / jam</span>
                    </p>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <CalendarDays className="size-4" />
              </span>
              <div>
                <h2 className="font-extrabold text-slate-900">2. Pilih tanggal &amp; jam</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Slot yang sudah terisi atau sudah lewat tidak dapat dipilih.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-5 sm:grid-cols-[210px_1fr]">
              <Input
                label="Tanggal bermain"
                name="bookingDate"
                type="date"
                min={todayISO()}
                value={date}
                onChange={event => handleDateChange(event.target.value)}
              />

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700">Jam tersedia</p>
                  {selectedCourt && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Clock3 className="size-3.5" />
                      {selectedCourt.openTime}-{selectedCourt.closeTime}
                    </span>
                  )}
                </div>

                {!selectedCourt ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    Pilih lapangan terlebih dahulu.
                  </div>
                ) : !selectedCourt.isAvailable ? (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    Lapangan ini sedang dinonaktifkan oleh admin. Silakan pilih lapangan
                    lain.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map(slot => {
                        const past = date ? isPastSlot(date, slot) : true
                        const booked = bookedSlots.includes(slot)
                        const disabled = past || booked
                        const selected = selectedTime === slot

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedTime(slot)}
                            className={cn(
                              'rounded-xl border px-2 py-2.5 text-sm font-bold transition',
                              disabled
                                ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
                                : selected
                                  ? 'border-brand-700 bg-brand-700 text-white shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50',
                            )}
                          >
                            {slot}
                            <span
                              className={cn(
                                'mt-0.5 block text-[9px] font-semibold uppercase tracking-wide',
                                disabled
                                  ? 'text-slate-300'
                                  : selected
                                    ? 'text-brand-100'
                                    : 'text-slate-400',
                              )}
                            >
                              {past ? 'Lewat' : booked ? 'Terisi' : selected ? 'Dipilih' : 'Tersedia'}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-brand-600" />
                        Dipilih
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-white ring-1 ring-slate-300" />
                        Tersedia
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-slate-300" />
                        Terisi / lewat
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 xl:sticky xl:top-24">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-brand-600" />
              <h2 className="font-extrabold text-slate-900">Ringkasan booking</h2>
            </div>

            <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">Lapangan</span>
                <span className="text-right font-bold text-slate-800">
                  {selectedCourt?.name ?? 'Belum dipilih'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">Tanggal</span>
                <span className="text-right font-bold text-slate-800">
                  {date ? formatDate(date) : 'Belum dipilih'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">Jam</span>
                <span className="text-right font-bold text-slate-800">
                  {selectedTime
                    ? humanTimeRange(selectedTime, addHour(selectedTime))
                    : 'Belum dipilih'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3 border-t border-slate-200 pt-3">
                <span className="text-slate-500">Durasi</span>
                <span className="text-right font-bold text-slate-800">1 jam</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">Total</span>
                <span className="text-right text-lg font-extrabold text-brand-700">
                  {selectedCourt ? formatCurrency(selectedCourt.pricePerHour) : '-'}
                </span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              className="mt-4"
              disabled={!selectedCourt?.isAvailable || !selectedTime || !date}
              onClick={handleOpenConfirm}
              leftIcon={<CheckCircle2 className="size-4" />}
            >
              Booking Sekarang
            </Button>
            <p className="mt-2 text-center text-[11px] leading-5 text-slate-400">
              Status awal booking adalah Menunggu sampai dikonfirmasi admin.
            </p>

            {!selectedTime && selectedCourt?.isAvailable && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-700">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                Pilih salah satu jam yang tersedia untuk melanjutkan.
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-brand-600" />
              <h2 className="font-extrabold text-slate-900">Cara booking</h2>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                'Pilih lapangan dan tanggal bermain.',
                'Klik slot jam yang masih tersedia.',
                'Periksa ringkasan lalu konfirmasi booking.',
                'Pantau status di halaman Booking Saya.',
              ].map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[11px] font-extrabold text-brand-700">
                    {index + 1}
                  </span>
                  <span className="leading-6">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmBooking}
        title="Konfirmasi booking"
        description={confirmDescription}
        confirmLabel="Ya, pesan sekarang"
        cancelLabel="Periksa lagi"
        tone="primary"
      />
    </AppShell>
  )
}
