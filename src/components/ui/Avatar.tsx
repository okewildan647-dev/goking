import { cn } from '../../utils/classnames'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  name: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-20 text-2xl',
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 font-extrabold text-white shadow-sm ring-1 ring-white/20',
        sizeClasses[size],
        className,
      )}
      aria-label={name}
    >
      {getInitials(name) || 'G'}
    </span>
  )
}
