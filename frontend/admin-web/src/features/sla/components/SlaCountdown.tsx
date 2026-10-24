import { cn } from '../../../components/ui/cn'
import { formatDuration, slaBarColor } from '../sla'
import type { SlaTiming } from '../sla'

const textColor = {
  'On Track': 'text-content',
  Warning: 'text-sla-warning-fg',
  Breached: 'text-sla-breached-fg',
  Paused: 'text-sla-paused-fg',
} as const

export function SlaCountdown({ timing, className }: { timing: SlaTiming; className?: string }) {
  const { status, remainingMs, elapsed } = timing
  const label =
    status === 'Paused'
      ? 'Clock paused'
      : status === 'Breached'
        ? `Overdue by ${formatDuration(remainingMs)}`
        : `${formatDuration(remainingMs)} left`

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className={cn('text-sm font-medium tabular-nums', textColor[status])}>{label}</span>
      <div
        role="progressbar"
        aria-label="SLA time elapsed"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(elapsed * 100)}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn('h-full rounded-full', slaBarColor[status])}
          style={{ width: `${elapsed * 100}%` }}
        />
      </div>
    </div>
  )
}
