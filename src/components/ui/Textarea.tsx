import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/classnames'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  containerClassName?: string
}

export function Textarea({
  label,
  error,
  hint,
  containerClassName,
  className,
  id,
  name,
  ...props
}: TextareaProps) {
  const textareaId = id ?? name

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-slate-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        className={cn(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}
