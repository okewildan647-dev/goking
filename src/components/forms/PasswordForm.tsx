import { useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff, KeyRound, LockKeyhole } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function PasswordForm() {
  const { updatePassword } = useAuth()
  const { notify } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!currentPassword) {
      nextErrors.currentPassword = 'Password saat ini wajib diisi.'
    }
    if (newPassword.length < 6) {
      nextErrors.newPassword = 'Password baru minimal 6 karakter.'
    }
    if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Konfirmasi password tidak cocok.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const result = updatePassword({ currentPassword, newPassword })
    if (!result.ok) {
      setErrors(result.fieldErrors ?? {})
      notify(result.message, 'error')
      return
    }

    setErrors({})
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    notify('Password berhasil diperbarui.', 'success')
  }

  const toggleVisibility = () => setShowPassword(value => !value)
  const type = showPassword ? 'text' : 'password'
  const visibilityButton = (
    <button
      type="button"
      onClick={toggleVisibility}
      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
      className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
    >
      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Password saat ini"
        name="currentPassword"
        type={type}
        value={currentPassword}
        onChange={event => setCurrentPassword(event.target.value)}
        error={errors.currentPassword}
        leftIcon={<KeyRound className="size-4" />}
        rightSlot={visibilityButton}
      />
      <Input
        label="Password baru"
        name="newPassword"
        type={type}
        placeholder="Minimal 6 karakter"
        value={newPassword}
        onChange={event => setNewPassword(event.target.value)}
        error={errors.newPassword}
        leftIcon={<LockKeyhole className="size-4" />}
      />
      <Input
        label="Konfirmasi password baru"
        name="confirmPassword"
        type={type}
        placeholder="Ulangi password baru"
        value={confirmPassword}
        onChange={event => setConfirmPassword(event.target.value)}
        error={errors.confirmPassword}
        leftIcon={<LockKeyhole className="size-4" />}
      />
      <div className="flex justify-end pt-1">
        <Button type="submit" variant="secondary" leftIcon={<KeyRound className="size-4" />}>
          Perbarui Password
        </Button>
      </div>
    </form>
  )
}
