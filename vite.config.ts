
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        login: resolve(process.cwd(), 'index.html'),
        dashboard: resolve(process.cwd(), 'dashboard.html'),
        schedule: resolve(process.cwd(), 'schedule.html'),
        bookings: resolve(process.cwd(), 'my-bookings.html'),
        profile: resolve(process.cwd(), 'profile.html'),
        admin: resolve(process.cwd(), 'admin.html'),
        adminBookings: resolve(process.cwd(), 'admin-bookings.html'),
        adminCourts: resolve(process.cwd(), 'admin-courts.html'),
      },
    },
  },
})
