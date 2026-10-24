import { cn } from '../../../components/ui/cn'
import { slaBarColor, timerLabel } from '../sla'
import type { SlaTiming } from '../sla'

const valueColor = {
  'On Track': 'text-success-fg',
  Warning: 'text-warning-fg',
  Breached: 'text-danger-fg',
  Paused: 'text-content-tertiary',
} as const

interface SlaPanelProps {
  label: string
  timing: SlaTiming
  caption: string
}

/** SLA panel from the Figma complaint detail: label, remaining time, 8px progress bar, target line. */
export function SlaPanel({ label, timing, caption }: SlaPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface px-5 py-4">
      <div className="flex items-start justify-between gap-4 whitespace-nowrap">
        <p className="text-[13px] leading-4.5 font-medium text-content-secondary">{label}</p>
        <p className={cn('text-sm leading-5 font-semibold', valueColor[timing.status])}>
          {timerLabel(timing)}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label={`${label} time elapsed`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(timing.elapsed * 100)}
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn('h-full rounded-full', slaBarColor[timing.status])}
          style={{ width: `${timing.elapsed * 100}%` }}
        />
      </div>
      <p className="text-xs leading-4 text-content-tertiary">{caption}</p>
    </div>
  )
}
