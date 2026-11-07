
import { useEffect, useState } from 'react'

type Page = string
type User = { name: string; email: string; role: 'user' | 'admin' }
type Booking = {
  id: number
  name: string
  court: string
  date: string
  time: string
  status: 'Menunggu' | 'Diterima' | 'Ditolak' | 'Dibatalkan'
}

const initialCourts = ['Lapangan 1', 'Lapangan 2', 'Lapangan 3']

function readData<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

export default function App({ page }: { page: Page }) {
  const [user, setUser] = useState<User | null>(() => readData('goking-user', null))
  const [bookings, setBookings] = useState<Booking[]>(() =>
    readData('goking-bookings', [])
  )
  const [courts, setCourts] = useState<string[]>(() =>
    readData('goking-courts', initialCourts)
  )

  useEffect(() => {
    localStorage.setItem('goking-user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('goking-bookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    localStorage.setItem('goking-courts', JSON.stringify(courts))
  }, [courts])

  function login(email: string, password: string) {
    if (email === 'admin@goking.test' && password === 'admin123') {
      setUser({ name: 'Administrator', email, role: 'admin' })
      window.location.href = 'admin.html'
      return
    }

    if (email === 'user@goking.test' && password === 'user123') {
      setUser({ name: 'Pengguna Goking', email, role: 'user' })
      window.location.href = 'dashboard.html'
      return
    }

    alert('Email atau password salah.')
  }

  function logout() {
    localStorage.removeItem('goking-user')
    setUser(null)
    window.location.href = 'index.html'
  }

  function createBooking(court: string, date: string, time: string) {
    if (!user) {
      alert('Silakan login terlebih dahulu.')
      return
    }

    const alreadyBooked = bookings.some(
      b => b.court === court &&
        b.date === date &&
        b.time === time &&
        (b.status === 'Menunggu' || b.status === 'Diterima')
    )

    if (alreadyBooked) {
      alert('Jadwal tersebut sudah dipesan.')
      return
    }

    const booking: Booking = {
      id: Date.now(),
      name: user.name,
      court,
      date,
      time,
      status: 'Menunggu',
    }

    setBookings(old => [...old, booking])
    alert('Booking berhasil dibuat. Menunggu konfirmasi admin.')
    window.location.href = 'my-bookings.html'
  }

  function updateBooking(id: number, status: Booking['status']) {
    setBookings(old =>
      old.map(b => b.id === id ? { ...b, status } : b)
    )
  }

  function addCourt(name: string) {
    const cleanName = name.trim()
    if (!cleanName) return
    if (courts.includes(cleanName)) {
      alert('Nama lapangan sudah tersedia.')
      return
    }
    setCourts(old => [...old, cleanName])
  }

  function removeCourt(name: string) {
    if (confirm(`Hapus ${name}?`)) {
      setCourts(old => old.filter(c => c !== name))
    }
  }

  if (page === 'login') {
    return <LoginPage onLogin={login} />
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">Silakan login</h1>
          <p className="text-gray-500 mb-5">Anda harus login untuk membuka halaman ini.</p>
          <a className="bg-green-700 text-white px-5 py-3 rounded-xl" href="index.html">
            Kembali ke Login
          </a>
        </div>
      </main>
    )
  }

  if (page.startsWith('admin') && user.role !== 'admin') {
    return <AccessDenied />
  }

  if (page === 'admin' || page === 'admin-bookings' || page === 'admin-courts') {
    return (
      <Layout user={user} admin onLogout={logout}>
        {page === 'admin' && (
          <AdminDashboard bookings={bookings} courts={courts} />
        )}
        {page === 'admin-bookings' && (
          <AdminBookings bookings={bookings} onUpdate={updateBooking} />
        )}
        {page === 'admin-courts' && (
          <AdminCourts courts={courts} onAdd={addCourt} onRemove={removeCourt} />
        )}
      </Layout>
    )
  }

  return (
    <Layout user={user} onLogout={logout}>
      {page === 'dashboard' && <Dashboard user={user} bookings={bookings} courts={courts} />}
      {page === 'schedule' && <Schedule courts={courts} bookings={bookings} onBook={createBooking} />}
      {page === 'bookings' && (
        <MyBookings
          bookings={bookings.filter(b => b.name === user.name)}
          onCancel={id => updateBooking(id, 'Dibatalkan')}
        />
      )}
    </Layout>
  )
}

function LoginPage({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('user@goking.test')
  const [password, setPassword] = useState('user123')

  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-green-950">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏸</div>
          <h1 className="text-3xl font-black text-green-800">GOKING</h1>
          <p className="text-gray-500 mt-2">Booking Lapangan Badminton Jadi Mudah</p>
        </div>

        <form onSubmit={e => {
          e.preventDefault()
          onLogin(email, password)
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-600"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-600"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold p-3 rounded-xl">
            Masuk
          </button>
        </form>

        <div className="mt-6 p-4 bg-green-50 rounded-xl text-sm">
          <p className="font-bold mb-2">Akun Demo</p>
          <p>User: user@goking.test / user123</p>
          <p>Admin: admin@goking.test / admin123</p>
        </div>
      </div>
    </main>
  )
}

function Layout({
  user, admin = false, onLogout, children,
}: {
  user: User
  admin?: boolean
  onLogout: () => void
  children: React.ReactNode
}) {
  const links = admin
    ? [
        ['Dashboard', 'admin.html'],
        ['Kelola Booking', 'admin-bookings.html'],
        ['Kelola Lapangan', 'admin-courts.html'],
      ]
    : [
        ['Dashboard', 'dashboard.html'],
        ['Jadwal Lapangan', 'schedule.html'],
        ['Booking Saya', 'my-bookings.html'],
      ]

  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-green-950 text-white md:w-64 p-6">
        <a href={admin ? 'admin.html' : 'dashboard.html'} className="text-2xl font-black">
          🏸 GOKING
        </a>
        <p className="text-green-300 text-xs mt-2 mb-8">GO BOOKING BADMINTON</p>
        <nav className="space-y-2">
          {links.map(([label, href]) => (
            <a key={href} href={href}
              className="block p-3 rounded-xl hover:bg-green-800">
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-10 border-t border-green-800 pt-5">
          <p className="font-semibold">{user.name}</p>
          <p className="text-green-300 text-xs mb-4">{admin ? 'Administrator' : 'Pengguna'}</p>
          <button onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 rounded-xl p-3">
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 p-5 md:p-10 min-w-0">
        {children}
      </main>
    </div>
  )
}

function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-black text-green-950">{title}</h1>
      <p className="text-gray-500 mt-2">{subtitle}</p>
    </header>
  )
}

function Stat({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  )
}

function Dashboard({
  user, bookings, courts,
}: {
  user: User
  bookings: Booking[]
  courts: string[]
}) {
  const mine = bookings.filter(b => b.name === user.name)
  return (
    <>
      <Heading title={`Selamat datang, ${user.name}!`} subtitle="Dashboard Goking, pusat booking lapangan badminton." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Stat title="Total Booking Saya" value={mine.length} icon="📅" />
        <Stat title="Menunggu Konfirmasi" value={mine.filter(b => b.status === 'Menunggu').length} icon="⏳" />
        <Stat title="Lapangan Tersedia" value={courts.length} icon="🏸" />
      </div>
      <div className="mt-8 bg-green-800 text-white rounded-3xl p-8">
        <h2 className="text-2xl font-bold">Waktunya bermain!</h2>
        <p className="mt-2 text-green-100">Pilih jadwal dan pesan lapangan badminton favoritmu.</p>
        <a href="schedule.html" className="inline-block mt-5 bg-white text-green-900 font-bold px-5 py-3 rounded-xl">
          Pesan Lapangan
        </a>
      </div>
    </>
  )
}

function Schedule({
  courts, bookings, onBook,
}: {
  courts: string[]
  bookings: Booking[]
  onBook: (court: string, date: string, time: string) => void
}) {
  const [court, setCourt] = useState(courts[0] || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('08:00')
  const times = ['08:00', '10:00', '13:00', '15:00', '17:00', '19:00', '21:00']

  const isTaken = (slot: string) => bookings.some(
    b => b.court === court && b.date === date && b.time === slot &&
      (b.status === 'Menunggu' || b.status === 'Diterima')
  )

  return (
    <>
      <Heading title="Jadwal Lapangan" subtitle="Pilih lapangan, tanggal, dan jam bermain." />
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-3xl">
        <label className="block font-semibold mb-2">Pilih Lapangan</label>
        <select className="w-full border p-3 rounded-xl mb-5" value={court}
          onChange={e => setCourt(e.target.value)}>
          {courts.map(c => <option key={c}>{c}</option>)}
        </select>

        <label className="block font-semibold mb-2">Tanggal Booking</label>
        <input type="date" min={new Date().toISOString().split('T')[0]}
          className="w-full border p-3 rounded-xl mb-5" value={date}
          onChange={e => setDate(e.target.value)} />

        <p className="font-semibold mb-3">Pilih Jam</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {times.map(slot => (
            <button key={slot} disabled={!date || isTaken(slot)}
              onClick={() => setTime(slot)}
              className={`p-3 rounded-xl border font-semibold ${
                isTaken(slot) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                time === slot ? 'bg-green-700 text-white border-green-700' :
                'bg-white hover:bg-green-50'
              }`}>
              {slot}
              <span className="block text-xs font-normal">
                {isTaken(slot) ? 'Terisi' : 'Tersedia'}
              </span>
            </button>
          ))}
        </div>
        <button disabled={!date || !court}
          onClick={() => onBook(court, date, time)}
          className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white p-3 rounded-xl font-bold">
          Booking Sekarang
        </button>
      </div>
    </>
  )
}

function MyBookings({
  bookings, onCancel,
}: {
  bookings: Booking[]
  onCancel: (id: number) => void
}) {
  return (
    <>
      <Heading title="Booking Saya" subtitle="Lihat status dan riwayat pemesanan lapangan." />
      <BookingTable bookings={bookings} action={b => (
        b.status === 'Menunggu' && (
          <button onClick={() => {
            if (confirm('Batalkan booking ini?')) onCancel(b.id)
          }} className="text-red-600 font-semibold">Batalkan</button>
        )
      )} />
    </>
  )
}

function AdminDashboard({
  bookings, courts,
}: {
  bookings: Booking[]
  courts: string[]
}) {
  return (
    <>
      <Heading title="Dashboard Admin" subtitle="Ringkasan pengelolaan Goking." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Stat title="Total Booking" value={bookings.length} icon="📋" />
        <Stat title="Menunggu Konfirmasi" value={bookings.filter(b => b.status === 'Menunggu').length} icon="⏳" />
        <Stat title="Jumlah Lapangan" value={courts.length} icon="🏸" />
      </div>
      <div className="mt-8 bg-white p-6 rounded-2xl">
        <h2 className="font-bold text-xl mb-3">Aktivitas Admin</h2>
        <p className="text-gray-600">Gunakan menu Kelola Booking untuk menerima atau menolak pesanan pengguna.</p>
      </div>
    </>
  )
}

function AdminBookings({
  bookings, onUpdate,
}: {
  bookings: Booking[]
  onUpdate: (id: number, status: Booking['status']) => void
}) {
  return (
    <>
      <Heading title="Kelola Booking" subtitle="Periksa dan konfirmasi pesanan pengguna." />
      <BookingTable bookings={bookings} action={b => b.status === 'Menunggu' && (
        <div className="flex gap-3">
          <button onClick={() => onUpdate(b.id, 'Diterima')}
            className="text-green-700 font-bold">Terima</button>
          <button onClick={() => onUpdate(b.id, 'Ditolak')}
            className="text-red-600 font-bold">Tolak</button>
        </div>
      )} />
    </>
  )
}

function BookingTable({
  bookings, action,
}: {
  bookings: Booking[]
  action: (booking: Booking) => React.ReactNode
}) {
  if (!bookings.length) {
    return <div className="bg-white p-8 rounded-2xl text-gray-500">Belum ada data booking.</div>
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-green-50">
          <tr>
            {['Nama', 'Lapangan', 'Tanggal', 'Jam', 'Status', 'Aksi'].map(h => (
              <th key={h} className="p-4 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} className="border-t">
              <td className="p-4">{b.name}</td>
              <td className="p-4">{b.court}</td>
              <td className="p-4">{b.date}</td>
              <td className="p-4">{b.time}</td>
              <td className="p-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
                  {b.status}
                </span>
              </td>
              <td className="p-4">{action(b)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AdminCourts({
  courts, onAdd, onRemove,
}: {
  courts: string[]
  onAdd: (name: string) => void
  onRemove: (name: string) => void
}) {
  const [name, setName] = useState('')

  return (
    <>
      <Heading title="Kelola Lapangan" subtitle="Tambah dan hapus daftar lapangan badminton." />
      <form onSubmit={e => {
        e.preventDefault()
        onAdd(name)
        setName('')
      }} className="bg-white p-6 rounded-2xl max-w-xl mb-6">
        <label className="block font-semibold mb-2">Nama Lapangan Baru</label>
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Contoh: Lapangan 4"
            className="flex-1 min-w-0 border p-3 rounded-xl" />
          <button className="bg-green-700 text-white px-5 rounded-xl font-bold">Tambah</button>
        </div>
      </form>

      <div className="bg-white rounded-2xl p-6 max-w-xl">
        <h2 className="font-bold mb-4">Daftar Lapangan</h2>
        {courts.map(c => (
          <div key={c} className="flex justify-between items-center border-b py-4">
            <span>{c}</span>
            <button onClick={() => onRemove(c)} className="text-red-600 font-semibold">Hapus</button>
          </div>
        ))}
      </div>
    </>
  )
}

function AccessDenied() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold">Akses Ditolak</h1>
        <p className="my-4 text-gray-500">Halaman ini hanya dapat dibuka oleh admin.</p>
        <a href="dashboard.html" className="text-green-700 font-bold">Kembali</a>
      </div>
    </main>
  )
}
