import { useState } from 'react'
import type { FormEvent } from 'react'
import { AlertCircle, Save, X } from 'lucide-react'
import type { Court, CourtInput, CourtType, Result } from '../../types'
import { COURT_TYPES } from '../../utils/constants'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { Toggle } from '../ui/Toggle'

interface CourtFormProps {
  court?: Court | null
  onSave: (input: CourtInput) => Result<Court>
  onSuccess: () => void
  onCancel: () => void
}

export function CourtForm({ court, onSave, onSuccess, onCancel }: CourtFormProps) {
  const [name, setName] = useState(court?.name ?? '')
  const [type, setType] = useState<CourtType>(court?.type ?? 'Indoor')
  const [description, setDescription] = useState(court?.description ?? '')
  const [price, setPrice] = useState(String(court?.pricePerHour ?? 75000))
  const [openTime, setOpenTime] = useState(court?.openTime ?? '08:00')
  const [closeTime, setCloseTime] = useState(court?.closeTime ?? '22:00')
  const [isAvailable, setIsAvailable] = useState(court?.isAvailable ?? true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setGeneralError('')

    const result = onSave({
      name,
      type,
      description,
      pricePerHour: Number(price),
      openTime,
      closeTime,
      isAvailable,
    })

    if (!result.ok) {
      setErrors(result.fieldErrors ?? {})
      setGeneralError(result.message)
      return
    }

    setErrors({})
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {generalError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      <Input
        label="Nama lapangan"
        name="courtName"
        placeholder="Contoh: Lapangan 5"
        value={name}
        onChange={event => setName(event.target.value)}
        error={errors.name}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Tipe lapangan"
          name="courtType"
          value={type}
          onChange={event => setType(event.target.value as CourtType)}
          error={errors.type}
        >
          {COURT_TYPES.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>

        <Input
          label="Harga per jam (Rp)"
          name="pricePerHour"
          type="number"
          min="0"
          step="5000"
          value={price}
          onChange={event => setPrice(event.target.value)}
          error={errors.pricePerHour}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Jam buka"
          name="openTime"
          type="time"
          value={openTime}
          onChange={event => setOpenTime(event.target.value)}
          error={errors.openTime}
        />
        <Input
          label="Jam tutup"
          name="closeTime"
          type="time"
          value={closeTime}
          onChange={event => setCloseTime(event.target.value)}
          error={errors.closeTime}
        />
      </div>

      <Textarea
        label="Deskripsi"
        name="description"
        rows={3}
        placeholder="Fasilitas, jenis lantai, dan informasi singkat lainnya."
        value={description}
        onChange={event => setDescription(event.target.value)}
        error={errors.description}
      />

      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
        <div>
          <p className="text-sm font-semibold text-slate-800">Tersedia untuk booking</p>
          <p className="text-xs text-slate-500">
            Nonaktifkan jika lapangan sedang dalam perawatan.
          </p>
        </div>
        <Toggle
          checked={isAvailable}
          onChange={setIsAvailable}
          label="Ketersediaan lapangan"
        />
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button
          variant="secondary"
          onClick={onCancel}
          leftIcon={<X className="size-4" />}
        >
          Batal
        </Button>
        <Button type="submit" leftIcon={<Save className="size-4" />}>
          {court ? 'Simpan Perubahan' : 'Tambah Lapangan'}
        </Button>
      </div>
    </form>
  )
}
