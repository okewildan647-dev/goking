import { useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { isValidEmail } from '../../utils/validators'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth()
  const { notify } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!email.trim()) nextErrors.email = 'Email wajib diisi.'
    else if (!isValidEmail(email)) nextErrors.email = 'Format email tidak valid.'
    if (!password) nextErrors.password = 'Password wajib diisi.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const result = login(email, password)
    if (!result.ok) {
      setErrors(result.fieldErrors ?? {})
      notify(result.message, 'error')
      return
    }

    setErrors({})
    notify(`Selamat datang kembali, ${result.data.name}!`, 'success')
    const target = result.data.role === 'admin' ? 'admin.html' : 'dashboard.html'
    window.setTimeout(() => {
      window.location.href = target
    }, 500)
  }

  const fillDemo = (role: 'user' | 'admin') => {
    setEmail(role === 'admin' ? 'admin@goking.test' : 'user@goking.test')
    setPassword(role === 'admin' ? 'admin123' : 'user123')
    setErrors({})
    setShowPassword(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Masuk ke akun
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Kelola jadwal dan booking lapangan badminton Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          placeholder="Masukkan password"
          autoComplete="current-password"
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

        <Button
          type="submit"
          fullWidth
          size="lg"
          leftIcon={<LogIn className="size-4" />}
        >
          Masuk ke Dashboard
        </Button>
      </form>

      <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
        <span>Belum punya akun?</span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-bold text-brand-700 hover:text-brand-800"
        >
          Daftar sekarang
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-800">
          Akun demo
        </p>
        <p className="mt-1 text-xs leading-5 text-brand-700">
          Gunakan tombol di bawah untuk mengisi kredensial pengujian secara otomatis.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" size="sm" onClick={() => fillDemo('user')}>
            Isi akun pengguna
          </Button>
          <Button variant="secondary" size="sm" onClick={() => fillDemo('admin')}>
            Isi akun admin
          </Button>
        </div>
        <div className="mt-3 space-y-1 text-[11px] text-brand-700">
          <p>Pengguna: user@goking.test / user123</p>
          <p>Admin: admin@goking.test / admin123</p>
        </div>
      </div>
    </div>
  )
}
