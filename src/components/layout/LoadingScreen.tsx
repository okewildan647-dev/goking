import { Loader2 } from 'lucide-react'
import { Logo } from '../ui/Logo'

export function LoadingScreen({ message = 'Menyiapkan halaman...' }: { message?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <div className="flex flex-col items-center gap-5">
        <Logo />
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Loader2 className="size-4 animate-spin text-brand-600" />
          {message}
        </div>
      </div>
    </div>
  )
}
