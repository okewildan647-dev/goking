import { useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, UserPlus, UserRound } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { isValidEmail } from '../../utils/validators'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth()
  const { notify } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (name.trim().length < 3) nextErrors.name = 'Nama minimal 3 karakter.'
    if (!email.trim()) nextErrors.email = 'Email wajib diisi.'
    else if (!isValidEmail(email)) nextErrors.email = 'Format email tidak valid.'
    if (password.length < 6) nextErrors.password = 'Password minimal 6 karakter.'
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Konfirmasi password tidak cocok.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const result = register({ name, email, password })
    if (!result.ok) {
      setErrors(result.fieldErrors ?? {})
      notify(result.message, 'error')
      return
    }

    setErrors({})
    notify(`Akun ${result.data.name} berhasil dibuat. Selamat bergabung!`, 'success')
    window.setTimeout(() => {
      window.location.href = 'dashboard.html'
    }, 500)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Buat akun baru
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Daftar sekali, lalu pesan lapangan favorit Anda kapan saja.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Nama lengkap"
          name="name"
          type="text"
          placeholder="Contoh: Rizky Pratama"
          autoComplete="name"
          value={name}
          onChange={event => setName(event.target.value)}
          error={errors.name}
          leftIcon={<UserRound className="size-4" />}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          error={errors.email}
          leftIcon={<Mail className="size-4" />}
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Minimal 6 karakter"
          autoComplete="new-password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          error={errors.password}
          leftIcon={<LockKeyhole className="size-4" />}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword(value => !value)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />

        <Input
          label="Konfirmasi password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="Ulangi password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={event => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
          leftIcon={<LockKeyhole className="size-4" />}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          leftIcon={<UserPlus className="size-4" />}
        >
          Daftar dan Mulai Booking
        </Button>
      </form>

      <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
        <span>Sudah punya akun?</span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-brand-700 hover:text-brand-800"
        >
          Masuk di sini
        </button>
      </div>

      <p className="mt-6 rounded-xl bg-slate-100 p-3 text-xs leading-5 text-slate-500">
        Data akun disimpan di localStorage perangkat ini sebagai simulasi frontend.
        Jangan gunakan password asli.
      </p>
    </div>
  )
}
