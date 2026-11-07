import { useState } from 'react'
import type { FormEvent } from 'react'
import { Mail, Phone, Save, UserRound } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import type { SessionUser } from '../../types'
import { isValidEmail } from '../../utils/validators'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function ProfileForm({ user }: { user: SessionUser }) {
  const { updateProfile } = useAuth()
  const { notify } = useToast()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (name.trim().length < 3) nextErrors.name = 'Nama minimal 3 karakter.'
    if (!isValidEmail(email)) nextErrors.email = 'Format email tidak valid.'
    if (phone.trim() && phone.trim().length < 8) {
      nextErrors.phone = 'Nomor telepon minimal 8 karakter.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const result = updateProfile({ name, email, phone })
    if (!result.ok) {
      setErrors(result.fieldErrors ?? {})
      notify(result.message, 'error')
      return
    }

    setErrors({})
    notify('Informasi profil berhasil diperbarui.', 'success')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Nama lengkap"
        name="name"
        value={name}
        onChange={event => setName(event.target.value)}
        error={errors.name}
        leftIcon={<UserRound className="size-4" />}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
        error={errors.email}
        hint="Email digunakan untuk login."
        leftIcon={<Mail className="size-4" />}
      />
      <Input
        label="Nomor telepon"
        name="phone"
        type="tel"
        placeholder="08xx-xxxx-xxxx"
        value={phone}
        onChange={event => setPhone(event.target.value)}
        error={errors.phone}
        leftIcon={<Phone className="size-4" />}
      />
      <div className="flex justify-end pt-1">
        <Button type="submit" leftIcon={<Save className="size-4" />}>
          Simpan Perubahan
        </Button>
      </div>
    </form>
  )
}
