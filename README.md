# Goking

Frontend aplikasi booking lapangan badminton. Aplikasi ini berjalan sepenuhnya di browser dengan data simulasi pada `localStorage`, tanpa backend atau database.

## Teknologi

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Lucide React
- Oxlint

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`.

Perintah lain:

```bash
npm run lint
npm run build
npm run preview
```

## Akun Demo

| Peran | Email | Password |
| --- | --- | --- |
| Pengguna | `user@goking.test` | `user123` |
| Admin | `admin@goking.test` | `admin123` |
| Pengguna | `budi@goking.test` | `budi123` |

Registrasi akun baru juga tersedia melalui halaman login.

## Halaman

| File | Akses | Fungsi |
| --- | --- | --- |
| `index.html` | Publik | Login dan registrasi |
| `dashboard.html` | Pengguna/Admin | Ringkasan dan booking terbaru |
| `schedule.html` | Pengguna/Admin | Pilih lapangan, tanggal, dan slot |
| `my-bookings.html` | Pengguna/Admin | Daftar dan pembatalan booking |
| `profile.html` | Pengguna/Admin | Ubah profil dan password |
| `admin.html` | Admin | Statistik dan ringkasan admin |
| `admin-bookings.html` | Admin | Kelola status booking dan ekspor CSV |
| `admin-courts.html` | Admin | Tambah, ubah, hapus, dan atur lapangan |

Navigasi menggunakan multi-page application (MPA) dengan tautan HTML biasa, bukan React Router.

## Fitur Utama

- Login, registrasi, logout, dan pembatasan akses berdasarkan peran.
- Pemesanan lapangan dengan pencegahan bentrok jadwal dan validasi slot lampau.
- Pembatalan booking oleh pengguna dan pengelolaan status oleh admin.
- CRUD lapangan, pengaturan ketersediaan, dan perlindungan hapus saat masih ada booking aktif.
- Filter booking, pencarian, statistik, dan ekspor laporan CSV.
- Tampilan responsif untuk desktop dan perangkat mobile.
- Data contoh otomatis: 3 pengguna, 4 lapangan, dan 6 booking.

## Penyimpanan Data

Data disimpan dengan key berikut:

- `goking_users_v1`
- `goking_session_v1`
- `goking_courts_v1`
- `goking_bookings_v1`

Hapus key tersebut melalui DevTools untuk mengembalikan data contoh. Password disimpan sebagai teks biasa karena aplikasi ini merupakan simulasi frontend, bukan sistem produksi.

## Struktur Singkat

```text
src/
  components/   komponen UI, form, layout, dan tabel
  context/      provider autentikasi dan toast
  entries/      entry point setiap halaman MPA
  hooks/        hook autentikasi dan toast
  pages/        komponen halaman
  services/     logika autentikasi, booking, dan lapangan
  types/        tipe data TypeScript
  utils/        penyimpanan, seed, tanggal, validasi, dan CSV
```
