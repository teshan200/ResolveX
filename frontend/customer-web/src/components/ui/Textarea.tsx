import { useId } from 'react'
import type { ComponentProps } from 'react'
import { cn } from './cn'

interface TextareaProps extends ComponentProps<'textarea'> {
  label: string
  /** Left-hand hint under the box, e.g. who can see the text. */
  hint?: string
  error?: string
  /** Current length, shown as "count / maxLength" when maxLength is set. */
  count?: number
}

export function Textarea({
  label,
  hint,
  error,
  count = 0,
  maxLength,
  className,
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={textareaId} className="text-[13px]/[18px] font-medium text-content">
        {label}
      </label>
      <textarea
        id={textareaId}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        className={cn(
          'min-h-[120px] resize-none rounded-md bg-surface px-3 py-2 text-sm/5 text-content placeholder:text-content-tertiary',
          error
            ? 'border-[1.5px] border-danger-fg shadow-[0_0_0_3px_rgba(220,38,38,0.25)] outline-none'
            : 'border border-line focus:border-line-focus focus:outline-2 focus:outline-line-focus/30',
          className,
        )}
        {...props}
      />
      <div className="flex items-start justify-between gap-2 text-xs/4">
        <p className={error ? 'text-danger-fg' : 'text-content-tertiary'}>{error ?? hint}</p>
        {maxLength && (
          <p className="shrink-0 text-content-tertiary">
            {count} / {maxLength}
          </p>
        )}
      </div>
    </div>
  )
}
