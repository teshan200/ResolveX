import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn'

interface InputProps extends ComponentProps<'input'> {
  label?: string
  helper?: string
  error?: string
  leadingIcon?: ReactNode
  trailing?: ReactNode
}

export function Input({
  label,
  helper,
  error,
  leadingIcon,
  trailing,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] leading-4.5 font-medium text-content">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-10 items-center gap-2 rounded-md border bg-surface px-3 text-content-tertiary',
          props.disabled && 'cursor-not-allowed bg-muted',
          error
            ? 'border-danger-fg shadow-[inset_0_0_0_0.5px_var(--color-danger-fg),0_0_0_3px_rgba(220,38,38,0.25)]'
            : 'border-line focus-within:border-line-focus focus-within:shadow-[inset_0_0_0_0.5px_var(--color-line-focus),0_0_0_3px_rgba(42,140,126,0.35)]',
        )}
      >
        {leadingIcon}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-sm leading-5 text-content outline-none',
            'placeholder:text-content-tertiary disabled:cursor-not-allowed disabled:text-content-disabled',
            className,
          )}
          {...props}
        />
        {trailing}
      </div>
      {(error || helper) && (
        <p className={cn('text-xs', error ? 'text-danger-fg' : 'text-content-tertiary')}>
          {error ?? helper}
        </p>
      )}
    </div>
  )
}
