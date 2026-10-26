import { Check } from 'lucide-react'
import { cn } from './cn'

interface FilterChipProps {
  label: string
  // Chips without a number (e.g. event types) leave this out.
  count?: number
  selected: boolean
  onClick: () => void
}

export function FilterChip({ label, count, selected, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] leading-4.5 font-medium whitespace-nowrap transition-colors',
        selected
          ? 'border-brand bg-brand text-on-brand'
          : 'border-line bg-surface text-content hover:bg-muted',
      )}
    >
      {selected && <Check size={14} />}
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
