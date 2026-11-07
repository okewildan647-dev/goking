const DEFAULT_TIME_ZONE = 'Asia/Jakarta'

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function addDaysISO(days: number, base: Date = new Date()): string {
  const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() + days)
  return toISODate(date)
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDate(value: string): string {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parseISODate(value))
}

export function formatShortDate(value: string): string {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parseISODate(value))
}

export function formatDateRange(from: string, to: string): string {
  if (from && to) return `${formatShortDate(from)} - ${formatShortDate(to)}`
  if (from) return `Sejak ${formatShortDate(from)}`
  if (to) return `Hingga ${formatShortDate(to)}`
  return 'Semua tanggal'
}

export function formatDateTime(value: string): string {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: DEFAULT_TIME_ZONE,
  }).format(new Date(value))
}

export function toMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + minute
}

export function fromMinutes(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function addHour(time: string): string {
  return fromMinutes(toMinutes(time) + 60)
}

export function generateTimeSlots(openTime: string, closeTime: string): string[] {
  const start = toMinutes(openTime)
  const end = toMinutes(closeTime)
  const slots: string[] = []

  for (let current = start; current + 60 <= end; current += 60) {
    slots.push(fromMinutes(current))
  }

  return slots
}

export function currentTime(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function isPastDate(value: string): boolean {
  return value < todayISO()
}

export function isPastSlot(date: string, time: string): boolean {
  const today = todayISO()
  if (date < today) return true
  if (date > today) return false
  return toMinutes(time) <= toMinutes(currentTime())
}

export function relativeDayLabel(value: string): string {
  const today = todayISO()
  if (value === today) return 'Hari ini'
  if (value === addDaysISO(1)) return 'Besok'
  return formatShortDate(value)
}

export function humanTimeRange(start: string, end: string): string {
  return `${start} - ${end}`
}
