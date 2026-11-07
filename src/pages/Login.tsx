import { useState } from 'react'
import {
  ArrowRight,
  CalendarCheck2,
  Clock3,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { LoginForm } from '../components/forms/LoginForm'
import { RegisterForm } from '../components/forms/RegisterForm'
import { Logo } from '../components/ui/Logo'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../utils/classnames'

const features = [
  {
    icon: CalendarCheck2,
    title: 'Jadwal real-time',
    description: 'Lihat slot kosong tanpa perlu bertanya ke admin.',
  },
  {
    icon: ShieldCheck,
    title: 'Anti bentrok',
    description: 'Sistem menolak booking ganda pada lapangan dan jam yang sama.',
  },
  {
    icon: Clock3,
    title: 'Konfirmasi cepat',
    description: 'Ajukan booking, lalu pantau statusnya dari dashboard.',
  },
]

export default function LoginPage() {
  const { user } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const dashboardHref = user?.role === 'admin' ? 'admin.html' : 'dashboard.html'

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-brand-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute right-12 top-1/3 size-40 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-24 top-1/3 size-24 rounded-full border border-white/10" />

        <div className="relative">
          <Logo tone="light" />

          <div className="mt-16 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-brand-200">
              <Sparkles className="size-3.5" />
              Booking lapangan tanpa ribet
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.1] tracking-tight xl:text-5xl">
              Main badminton,
              <br />
              <span className="text-brand-300">atur jadwalnya di Goking.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-brand-100/80 xl:text-base">
              Pesan lapangan favorit, cek ketersediaan, dan pantau status booking
              dalam satu dashboard yang rapi.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <MapPinned className="size-4 text-brand-300" />
                <p className="mt-2 text-lg font-extrabold">4</p>
                <p className="text-[11px] text-brand-200/80">Lapangan</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <Clock3 className="size-4 text-brand-300" />
                <p className="mt-2 text-lg font-extrabold">08-22</p>
                <p className="text-[11px] text-brand-200/80">Jam operasional</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <CalendarCheck2 className="size-4 text-brand-300" />
                <p className="mt-2 text-lg font-extrabold">Instan</p>
                <p className="text-[11px] text-brand-200/80">Ajukan booking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-12 grid gap-3 sm:grid-cols-3">
          {features.map(feature => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <Icon className="size-5 text-brand-300" />
                <p className="mt-3 text-sm font-bold text-white">{feature.title}</p>
                <p className="mt-1 text-xs leading-5 text-brand-200/70">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-5 py-5 lg:hidden">
          <Logo />
          <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700">
            Booking Badminton
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-md">
            {user && (
              <a
                href={dashboardHref}
                className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800 transition hover:border-brand-300"
              >
                <span className="min-w-0">
                  Sudah masuk sebagai <strong className="font-bold">{user.name}</strong>
                </span>
                <ArrowRight className="size-4 shrink-0" />
              </a>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                {[
                  { key: 'login' as const, label: 'Masuk' },
                  { key: 'register' as const, label: 'Daftar' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setMode(tab.key)}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-bold transition',
                      mode === tab.key
                        ? 'bg-white text-brand-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {mode === 'login' ? (
                  <LoginForm onSwitchToRegister={() => setMode('register')} />
                ) : (
                  <RegisterForm onSwitchToLogin={() => setMode('login')} />
                )}
              </div>
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              Goking adalah simulasi frontend. Seluruh data disimpan di localStorage
              perangkat Anda.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
