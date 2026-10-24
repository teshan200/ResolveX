import { cn } from '../../../components/ui/cn'
import type { SlaStatus } from '../types'

const styles: Record<SlaStatus, { pill: string; dot: string }> = {
  'On Track': { pill: 'bg-sla-on-track-bg text-sla-on-track-fg', dot: 'bg-success-solid' },
  Warning: { pill: 'bg-sla-warning-bg text-sla-warning-fg', dot: 'bg-warning-solid' },
  Breached: { pill: 'bg-sla-breached-bg text-sla-breached-fg', dot: 'bg-danger-solid' },
  Paused: { pill: 'bg-sla-paused-bg text-sla-paused-fg', dot: 'bg-neutral-400' },
}

/** Status is conveyed by the label as well as the colour. */
export function SlaStatusBadge({ status }: { status: SlaStatus }) {
  const s = styles[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        s.pill,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', s.dot)} />
      {status}
    </span>
  )
}
