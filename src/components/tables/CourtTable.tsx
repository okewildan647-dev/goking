import type { ReactNode } from 'react'
import { Clock, MapPinned, Pencil, Trash2 } from 'lucide-react'
import type { Court } from '../../types'
import { formatCurrency } from '../../utils/currency'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Toggle } from '../ui/Toggle'

interface CourtTableProps {
  courts: Court[]
  activeBookingCounts: Record<string, number>
  onEdit: (court: Court) => void
  onDelete: (court: Court) => void
  onToggle: (court: Court, checked: boolean) => void
  emptyAction?: ReactNode
}

const typeTone = {
  Indoor: 'brand',
  Outdoor: 'amber',
  VIP: 'violet',
} as const

function CourtIdentity({ court }: { court: Court }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
        <MapPinned className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-bold text-slate-800">{court.name}</p>
        <p className="truncate text-xs text-slate-500">{court.description || 'Tanpa deskripsi'}</p>
      </div>
    </div>
  )
}

function Actions({
  court,
  onEdit,
  onDelete,
}: {
  court: Court
  onEdit: (court: Court) => void
  onDelete: (court: Court) => void
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onEdit(court)}
        aria-label={`Edit ${court.name}`}
        title="Edit lapangan"
        className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-brand-50 hover:text-brand-700"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(court)}
        aria-label={`Hapus ${court.name}`}
        title="Hapus lapangan"
        className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

export function CourtTable({
  courts,
  activeBookingCounts,
  onEdit,
  onDelete,
  onToggle,
  emptyAction,
}: CourtTableProps) {
  if (courts.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={MapPinned}
          title="Belum ada lapangan"
          description="Tambahkan lapangan pertama agar pengguna dapat mulai melakukan booking."
          action={emptyAction}
        />
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {courts.map(court => (
          <Card key={court.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <CourtIdentity court={court} />
              <Badge tone={typeTone[court.type]}>{court.type}</Badge>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Harga / jam
                </p>
                <p className="font-semibold text-slate-700">
                  {formatCurrency(court.pricePerHour)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Operasional
                </p>
                <p className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="size-3.5" />
                  {court.openTime} - {court.closeTime}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Booking aktif
                </p>
                <p className="font-semibold text-slate-700">
                  {activeBookingCounts[court.id] ?? 0} booking
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {court.isAvailable ? 'Tersedia' : 'Nonaktif'}
                </span>
                <Toggle
                  checked={court.isAvailable}
                  onChange={checked => onToggle(court, checked)}
                  label={`Ketersediaan ${court.name}`}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">ID: {court.id.slice(0, 12)}</span>
              <Actions court={court} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50/90">
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3.5 font-bold">Lapangan</th>
                <th className="px-5 py-3.5 font-bold">Tipe</th>
                <th className="px-5 py-3.5 font-bold">Harga / Jam</th>
                <th className="px-5 py-3.5 font-bold">Operasional</th>
                <th className="px-5 py-3.5 font-bold">Booking Aktif</th>
                <th className="px-5 py-3.5 font-bold">Ketersediaan</th>
                <th className="px-5 py-3.5 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courts.map(court => (
                <tr key={court.id} className="transition hover:bg-slate-50/70">
                  <td className="max-w-xs px-5 py-4">
                    <CourtIdentity court={court} />
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={typeTone[court.type]}>{court.type}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                    {formatCurrency(court.pricePerHour)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5 text-slate-400" />
                      {court.openTime} - {court.closeTime}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {activeBookingCounts[court.id] ?? 0} booking
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={court.isAvailable}
                        onChange={checked => onToggle(court, checked)}
                        label={`Ketersediaan ${court.name}`}
                      />
                      <span className="text-xs font-semibold text-slate-500">
                        {court.isAvailable ? 'Tersedia' : 'Nonaktif'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Actions court={court} onEdit={onEdit} onDelete={onDelete} />
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
