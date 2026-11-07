import type { AnchorHTMLAttributes, ReactNode } from 'react'
import type { ButtonSize, ButtonVariant } from './buttonStyles'
import { buttonClassName } from './buttonStyles'

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export function LinkButton({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={buttonClassName({ variant, size, fullWidth, className })}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </a>
  )
}
