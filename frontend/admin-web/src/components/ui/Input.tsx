import { useId } from 'react'
import type { ComponentProps } from 'react'
import { cn } from './cn'

interface InputProps extends ComponentProps<'input'> {
  label?: string
  helper?: string
  error?: string
}

export function Input({ label, helper, error, className, id, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-content">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(
          'h-10 rounded-md border bg-surface px-3 text-sm text-content placeholder:text-content-tertiary',
          'focus:border-line-focus focus:outline-2 focus:outline-line-focus/30',
          'disabled:cursor-not-allowed disabled:bg-muted disabled:text-content-disabled',
          error ? 'border-danger-solid' : 'border-line',
          className,
        )}
        {...props}
      />
      {(error || helper) && (
        <p className={cn('text-xs', error ? 'text-danger-fg' : 'text-content-tertiary')}>
          {error ?? helper}
        </p>
      )}
    </div>
  )
}
