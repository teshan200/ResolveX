import { Card } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import type { SlaSummary } from '../types'

const cards: { key: keyof SlaSummary; label: string; hint: string; accent: string }[] = [
  { key: 'total', label: 'Active complaints', hint: 'With an SLA clock', accent: 'bg-brand' },
  { key: 'onTrack', label: 'On track', hint: 'Within target', accent: 'bg-success-solid' },
  { key: 'warning', label: 'Warning', hint: 'Over 75% of time used', accent: 'bg-warning-solid' },
  { key: 'breached', label: 'Breached', hint: 'Past the due time', accent: 'bg-danger-solid' },
  { key: 'paused', label: 'Paused', hint: 'Clock on hold', accent: 'bg-neutral-400' },
]

export function SlaSummaryCards({ summary }: { summary: SlaSummary }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <li key={c.key}>
          <Card className="flex h-full flex-col gap-1 p-4">
            <span className="flex items-center gap-2 text-sm font-medium text-content-secondary">
              <span aria-hidden="true" className={cn('size-2 rounded-full', c.accent)} />
              {c.label}
            </span>
            <span className="text-3xl font-semibold tabular-nums">{summary[c.key]}</span>
            <span className="text-xs text-content-tertiary">{c.hint}</span>
          </Card>
        </li>
      ))}
    </ul>
  )
}
