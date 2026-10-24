import { cn } from '../../../components/ui/cn'
import { formatDateTime } from '../sla'
import type { SlaTimelineEvent, SlaTimelineKind } from '../types'

const dotColor: Record<SlaTimelineKind, string> = {
  opened: 'bg-neutral-400',
  assigned: 'bg-info-solid',
  claimed: 'bg-info-solid',
  warning: 'bg-warning-solid',
  breached: 'bg-danger-solid',
  escalated: 'bg-orange-500',
  paused: 'bg-neutral-400',
  reopened: 'bg-orange-500',
}

/** Chronological list of events, oldest first. */
export function SlaTimeline({ events }: { events: SlaTimelineEvent[] }) {
  return (
    <ol className="flex flex-col">
      {events.map((event, index) => (
        <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
          {index < events.length - 1 && (
            <span aria-hidden="true" className="absolute top-3 bottom-0 left-[5px] w-px bg-line" />
          )}
          <span
            aria-hidden="true"
            className={cn('relative mt-1.5 size-[11px] shrink-0 rounded-full', dotColor[event.kind])}
          />
          <div className="min-w-0">
            <p
              className={cn(
                'text-sm font-medium',
                event.kind === 'breached' && 'text-sla-breached-fg',
                event.kind === 'warning' && 'text-sla-warning-fg',
              )}
            >
              {event.title}
            </p>
            <p className="text-xs text-content-secondary">
              <time dateTime={event.at}>{formatDateTime(new Date(event.at).getTime())}</time> ·{' '}
              {event.actor}
            </p>
            {event.note && <p className="mt-0.5 text-xs text-content-tertiary">{event.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
