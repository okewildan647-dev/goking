import type { LucideIcon } from 'lucide-react'
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  MapPinned,
  UserRound,
} from 'lucide-react'
import type { Role } from '../../types'

export interface NavItem {
  key: string
  label: string
  href: string
  icon: LucideIcon
}

export const userNav: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: 'dashboard.html',
    icon: LayoutDashboard,
  },
  {
    key: 'schedule',
    label: 'Jadwal Lapangan',
    href: 'schedule.html',
    icon: CalendarDays,
  },
  {
    key: 'bookings',
    label: 'Booking Saya',
    href: 'my-bookings.html',
    icon: ClipboardList,
  },
  {
    key: 'profile',
    label: 'Profil Saya',
    href: 'profile.html',
    icon: UserRound,
  },
]

export const adminNav: NavItem[] = [
  {
    key: 'admin',
    label: 'Dashboard Admin',
    href: 'admin.html',
    icon: LayoutDashboard,
  },
  {
    key: 'admin-bookings',
    label: 'Kelola Booking',
    href: 'admin-bookings.html',
    icon: ListChecks,
  },
  {
    key: 'admin-courts',
    label: 'Kelola Lapangan',
    href: 'admin-courts.html',
    icon: MapPinned,
  },
  {
    key: 'profile',
    label: 'Profil Saya',
    href: 'profile.html',
    icon: UserRound,
  },
]

export function getNavigation(role: Role): NavItem[] {
  return role === 'admin' ? adminNav : userNav
}

export function getHomeHref(role: Role): string {
  return role === 'admin' ? 'admin.html' : 'dashboard.html'
}

export function getSectionLabel(role: Role): string {
  return role === 'admin' ? 'Panel Administrator' : 'Panel Pengguna'
}
