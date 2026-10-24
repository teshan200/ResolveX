import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import type { ComponentProps } from 'react'
import { cn } from './cn'

interface SelectProps extends ComponentProps<'select'> {
  label?: string
  error?: string
  options: string[]
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-[13px] leading-4.5 font-medium text-content">
          {label}
        </label>
      )}
      <div
        className={cn(
          'relative flex h-10 items-center rounded-md border bg-surface text-content-tertiary',
          error
            ? 'border-danger-fg shadow-[inset_0_0_0_0.5px_var(--color-danger-fg),0_0_0_3px_rgba(220,38,38,0.25)]'
            : 'border-line focus-within:border-line-focus focus-within:shadow-[inset_0_0_0_0.5px_var(--color-line-focus),0_0_0_3px_rgba(42,140,126,0.35)]',
        )}
      >
        <select
          id={selectId}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-full w-full cursor-pointer appearance-none bg-transparent pr-9 pl-3 text-sm leading-5 text-content outline-none',
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-3" />
      </div>
      {error && <p className="text-xs text-danger-fg">{error}</p>}
    </div>
  )
}
