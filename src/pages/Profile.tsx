import { useState } from 'react'
import {
  CalendarCheck2,
  CheckCircle2,
  Hourglass,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { PasswordForm } from '../components/forms/PasswordForm'
import { ProfileForm } from '../components/forms/ProfileForm'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import {
  getBookingStats,
  getBookingViewsForUser,
} from '../services/booking.service'
import { formatDate } from '../utils/date'
import { ROLE_LABELS } from '../utils/constants'

export default function ProfilePage() {
  const { user } = useAuth()
  const [bookings] = useState(() =>
    user ? getBookingViewsForUser(user.id) : [],
  )

  if (!user) return null

  const stats = getBookingStats(bookings)
  const memberSince = formatDate(user.createdAt.slice(0, 10))

  return (
    <AppShell
      active="profile"
      title="Profil Saya"
      subtitle="Perbarui informasi akun dan keamanan login Anda."
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.4fr]">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950" />
            <div className="px-5 pb-5">
              <div className="-mt-10 flex items-end justify-between gap-3">
                <Avatar name={user.name} size="xl" className="ring-4 ring-white" />
                <Badge tone={user.role === 'admin' ? 'violet' : 'brand'}>
                  <ShieldCheck className="size-3.5" />
                  {ROLE_LABELS[user.role]}
                </Badge>
              </div>
              <h2 className="mt-3 text-xl font-extrabold text-slate-900">
                {user.name}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">{user.email}</p>

              <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="size-4 text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="size-4 text-slate-400" />
                  <span>{user.phone || 'Nomor telepon belum diisi'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <UserRound className="size-4 text-slate-400" />
                  <span>Bergabung sejak {memberSince}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <CalendarCheck2 className="size-4" />
              </span>
              <div>
                <p className="text-xs text-slate-500">Total booking</p>
                <p className="text-lg font-extrabold text-slate-900">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <Hourglass className="size-4" />
              </span>
              <div>
                <p className="text-xs text-slate-500">Booking aktif</p>
                <p className="text-lg font-extrabold text-slate-900">{stats.upcoming}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-700">
                <CheckCircle2 className="size-4" />
              </span>
              <div>
                <p className="text-xs text-slate-500">Selesai</p>
                <p className="text-lg font-extrabold text-slate-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <UserRound className="size-4" />
              </span>
              <div>
                <h2 className="font-extrabold text-slate-900">Informasi profil</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Nama dan email akan dipakai pada data booking.
                </p>
              </div>
            </div>
            <ProfileForm user={user} />
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <ShieldCheck className="size-4" />
              </span>
              <div>
                <h2 className="font-extrabold text-slate-900">Keamanan akun</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Ganti password secara berkala untuk menjaga akun.
                </p>
              </div>
            </div>
            <PasswordForm />
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700">
              Simulasi frontend: password disimpan di localStorage dan tidak
              terenkripsi. Jangan gunakan password penting.
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
