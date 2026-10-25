import { CircleArrowUp, CircleDot, Pencil, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../../components/ui/cn'
import type { TimelineEntry, TimelineKind } from '../detail'

const nodes: Record<TimelineKind, { style: string; icon: LucideIcon }> = {
  escalated: { style: 'bg-status-escalated-bg text-status-escalated-fg', icon: CircleArrowUp },
  response: { style: 'bg-status-in-progress-bg text-status-in-progress-fg', icon: Pencil },
  assigned: { style: 'bg-status-assigned-bg text-status-assigned-fg', icon: User },
  received: { style: 'bg-status-new-bg text-status-new-fg', icon: CircleDot },
}

/** Timeline from the Figma "Complaint history" panel. The last event has no connector. */
export function EscalationHistory({
  entries,
  tight = false,
}: {
  entries: TimelineEntry[]
  /** No gap between events, as in the branch manager's Escalation Inbox. */
  tight?: boolean
}) {
  return (
    <ol className={cn('flex flex-col', !tight && 'gap-3')}>
      {entries.map((entry, index) => {
        const { style, icon: Icon } = nodes[entry.kind]
        const last = index === entries.length - 1
        return (
          <li key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center self-stretch">
              <span
                className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', style)}
              >
                <Icon size={16} aria-hidden />
              </span>
              {!last && <span aria-hidden className="w-0.5 flex-1 bg-line" />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1 pb-5">
              <div className="flex items-center justify-between gap-3 whitespace-nowrap">
                <p className="text-sm leading-5 font-semibold">{entry.title}</p>
                <p className="text-xs leading-4 text-content-tertiary">{entry.time}</p>
              </div>
              <p className="text-xs leading-4 font-medium text-content-secondary">{entry.actor}</p>
              <p className="text-[13px] leading-4.5 text-content-secondary">{entry.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
