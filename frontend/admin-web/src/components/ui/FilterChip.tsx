import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from './cn'

interface FilterChipProps extends Omit<ComponentProps<'button'>, 'children'> {
  label: string
  count?: number
  selected?: boolean
}

export function FilterChip({
  label,
  count,
  selected = false,
  className,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] leading-[18px] font-medium whitespace-nowrap',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
        selected ? 'bg-brand text-on-brand' : 'border border-line bg-surface text-content',
        className,
      )}
      {...props}
    >
      {selected && <Check size={14} aria-hidden />}
      {label}
      {count !== undefined && (
        <span
          className={cn(
            'rounded-full px-1.5 text-xs leading-4 font-semibold',
            selected ? 'bg-brand-hover text-on-brand' : 'bg-muted text-content-secondary',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}
