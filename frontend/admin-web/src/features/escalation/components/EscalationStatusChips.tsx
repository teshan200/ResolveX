import { Check } from 'lucide-react'
import { cn } from '../../../components/ui/cn'
import type { EscalationChip } from '../types'

const chips: { key: EscalationChip; label: string }[] = [
  { key: 'awaiting', label: 'Awaiting acknowledgement' },
  { key: 'acknowledged', label: 'Acknowledged' },
  { key: 'all', label: 'All' },
]

interface EscalationStatusChipsProps {
  selected: EscalationChip
  counts: Record<EscalationChip, number>
  onSelect: (chip: EscalationChip) => void
}

/** Filter chips from the Figma frame: the selected chip is solid brand with a check. */
export function EscalationStatusChips({ selected, counts, onSelect }: EscalationStatusChipsProps) {
  return (
    <div role="group" aria-label="Escalation status" className="flex gap-2">
      {chips.map(({ key, label }) => {
        const active = key === selected
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(key)}
            className={cn(
              'flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] leading-4.5 font-medium whitespace-nowrap',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
              active ? 'bg-brand text-on-brand' : 'border border-line bg-surface text-content',
            )}
          >
            {active && <Check size={14} aria-hidden />}
            {label}
            <span
              className={cn(
                'rounded-full px-1.5 text-xs leading-4 font-semibold',
                active ? 'bg-brand-hover text-on-brand' : 'bg-muted text-content-secondary',
              )}
            >
              {counts[key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
