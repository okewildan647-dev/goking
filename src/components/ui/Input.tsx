import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/classnames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightSlot?: ReactNode
  containerClassName?: string
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightSlot,
  containerClassName,
  className,
  id,
  name,
  ...props
}: InputProps) {
  const inputId = id ?? name

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          name={name}
          className={cn(
            'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50',
            Boolean(leftIcon) && 'pl-10',
            Boolean(rightSlot) && 'pr-12',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightSlot}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}
