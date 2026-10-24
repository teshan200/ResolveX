import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn'

interface TextFieldProps extends ComponentProps<'input'> {
  label: string
  helper?: string
  error?: string
  leadingIcon?: ReactNode
}

export function TextField({
  label,
  helper,
  error,
  leadingIcon,
  className,
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[13px]/[18px] font-medium text-content">
        {label}
      </label>
      <div
        className={cn(
          'flex h-10 items-center gap-2 rounded-md border bg-surface px-3',
          'focus-within:outline-2 focus-within:outline-line-focus/30',
          error ? 'border-danger-solid' : 'border-line focus-within:border-line-focus',
        )}
      >
        {leadingIcon && (
          <span className="flex size-[18px] shrink-0 items-center text-content-tertiary">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helper ? messageId : undefined}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-sm text-content outline-none placeholder:text-content-tertiary',
            className,
          )}
          {...props}
        />
      </div>
      {(error || helper) && (
        <p
          id={messageId}
          className={cn('text-xs/4', error ? 'text-danger-fg' : 'text-content-tertiary')}
        >
          {error ?? helper}
        </p>
      )}
    </div>
  )
}
