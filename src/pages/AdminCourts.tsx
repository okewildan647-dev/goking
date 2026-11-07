import { useState } from 'react'
import {
  CalendarClock,
  CheckCircle2,
  MapPinned,
  Plus,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react'
import { CourtForm } from '../components/forms/CourtForm'
import { AppShell } from '../components/layout/AppShell'
import { CourtTable } from '../components/tables/CourtTable'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { StatCard } from '../components/ui/StatCard'
import { useToast } from '../hooks/useToast'
import { getBookings } from '../services/booking.service'
import {
  createCourt,
  deleteCourt,
  getCourts,
  setCourtAvailability,
  updateCourt,
} from '../services/court.service'
import type { Court, CourtInput } from '../types'
import { todayISO } from '../utils/date'

export default function AdminCourtsPage() {
  const { notify } = useToast()
  const [courts, setCourts] = useState(getCourts)
  const [bookings] = useState(getBookings)
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCourt, setEditingCourt] = useState<Court | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Court | null>(null)

  const normalizedQuery = query.trim().toLowerCase()
  const filtered = courts.filter(court =>
    [court.name, court.type, court.description]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  )

  const activeBookings = bookings.filter(
    booking =>
      (booking.status === 'pending' || booking.status === 'confirmed') &&
      booking.date >= todayISO(),
  )
  const activeBookingCounts: Record<string, number> = {}
  courts.forEach(court => {
    activeBookingCounts[court.id] = activeBookings.filter(
      booking => booking.courtId === court.id,
    ).length
  })

  const refresh = () => setCourts(getCourts())

  const openCreate = () => {
    setEditingCourt(null)
    setFormOpen(true)
  }

  const openEdit = (court: Court) => {
    setEditingCourt(court)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingCourt(null)
  }

  const handleSave = (input: CourtInput) => {
    const result = editingCourt
      ? updateCourt(editingCourt.id, input)
      : createCourt(input)

    if (result.ok) {
      notify(
        editingCourt
          ? `${result.data.name} berhasil diperbarui.`
          : `${result.data.name} berhasil ditambahkan.`,
        'success',
      )
      refresh()
    }

    return result
  }

  const handleDelete = () => {
    if (!deleteTarget) return

    const result = deleteCourt(deleteTarget.id)
    if (!result.ok) {
      notify(result.message, 'error')
      setDeleteTarget(null)
      refresh()
      return
    }

    notify(`${deleteTarget.name} berhasil dihapus.`, 'success')
    setDeleteTarget(null)
    refresh()
  }

  const handleToggle = (court: Court, checked: boolean) => {
    const result = setCourtAvailability(court.id, checked)
    if (!result.ok) {
      notify(result.message, 'error')
      return
    }

    notify(
      `${court.name} ${checked ? 'diaktifkan' : 'dinonaktifkan'} untuk booking.`,
      'success',
    )
    refresh()
  }

  return (
    <AppShell
      active="admin-courts"
      title="Kelola Lapangan"
      subtitle="Tambah, ubah, atur harga, dan kelola ketersediaan lapangan."
      actions={
        <Button onClick={openCreate} leftIcon={<Plus className="size-4" />}>
          Tambah Lapangan
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Lapangan"
          value={courts.length}
          helper="Seluruh lapangan terdaftar"
          icon={MapPinned}
        />
        <StatCard
          label="Lapangan Tersedia"
          value={courts.filter(court => court.isAvailable).length}
          helper="Dapat dipesan pengguna"
          icon={CheckCircle2}
          tone="blue"
        />
        <StatCard
          label="Lapangan Nonaktif"
          value={courts.filter(court => !court.isAvailable).length}
          helper="Sedang tidak dibuka"
          icon={XCircle}
          tone="rose"
        />
        <StatCard
          label="Booking Aktif"
          value={activeBookings.length}
          helper="Menunggu atau diterima"
          icon={CalendarClock}
          tone="amber"
        />
      </div>

      <Card className="mt-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input
            containerClassName="flex-1"
            label="Cari lapangan"
            placeholder="Cari nama, tipe, atau deskripsi lapangan..."
            value={query}
            onChange={event => setQuery(event.target.value)}
            leftIcon={<Search className="size-4" />}
          />
          <Button
            variant="secondary"
            disabled={query.trim() === ''}
            onClick={() => setQuery('')}
            leftIcon={<RotateCcw className="size-4" />}
          >
            Reset
          </Button>
        </div>
        <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          Menampilkan <strong className="text-slate-800">{filtered.length}</strong>{' '}
          dari {courts.length} lapangan. Lapangan dengan booking aktif tidak dapat
          dihapus.
        </p>
      </Card>

      <div className="mt-5">
        <CourtTable
          courts={filtered}
          activeBookingCounts={activeBookingCounts}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onToggle={handleToggle}
          emptyAction={
            <Button onClick={openCreate} leftIcon={<Plus className="size-4" />}>
              Tambah Lapangan
            </Button>
          }
        />
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingCourt ? 'Edit lapangan' : 'Tambah lapangan baru'}
        description={
          editingCourt
            ? 'Perbarui informasi lapangan. Perubahan langsung dipakai pada halaman jadwal.'
            : 'Lengkapi informasi lapangan agar pengguna dapat melakukan booking.'
        }
        size="lg"
      >
        <CourtForm
          key={editingCourt?.id ?? 'new-court'}
          court={editingCourt}
          onSave={handleSave}
          onSuccess={closeForm}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus lapangan?"
        description={
          deleteTarget
            ? `${deleteTarget.name} akan dihapus permanen. Jika masih memiliki booking aktif, penghapusan akan ditolak oleh sistem.`
            : ''
        }
        confirmLabel="Ya, hapus lapangan"
        cancelLabel="Batal"
      />
    </AppShell>
  )
}
