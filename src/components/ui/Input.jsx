import { useId } from 'react'
import { cn } from '../../lib/cn'

export default function Input({ label, hint, error, endSlot, className, id, ...props }) {
  const autoId = useId()
  const inputId = id || autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-10 w-full rounded-control border bg-paper px-3 text-sm placeholder:text-muted/70',
            error ? 'border-bad' : 'border-line',
            endSlot && 'pr-16',
          )}
          {...props}
        />
        {endSlot && <div className="absolute inset-y-0 right-1 flex items-center">{endSlot}</div>}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-bad">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
