import { Card, PriorityBadge } from '../../../components/ui'
import { getSlaTiming } from '../sla'
import type { SlaComplaint } from '../types'
import { SlaCountdown } from './SlaCountdown'
import { SlaStatusBadge } from './SlaStatusBadge'

interface SlaWatchlistProps {
  complaints: SlaComplaint[]
  nowMs: number
  limit?: number
}

/** Complaints closest to (or already past) their due time. Paused clocks are left out. */
export function SlaWatchlist({ complaints, nowMs, limit = 5 }: SlaWatchlistProps) {
  const rows = complaints
    .map((complaint) => ({ complaint, timing: getSlaTiming(complaint, nowMs) }))
    .filter((r) => r.timing.status !== 'Paused')
    .sort((a, b) => a.timing.remainingMs - b.timing.remainingMs)
    .slice(0, limit)

  return (
    <Card className="p-0">
      <ul className="divide-y divide-line">
        {rows.map(({ complaint, timing }) => (
          <li
            key={complaint.id}
            className="grid grid-cols-1 items-center gap-3 px-4 py-3 md:grid-cols-[1fr_auto_auto]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                <span className="text-content-tertiary">{complaint.id}</span> {complaint.title}
              </p>
              <p className="truncate text-xs text-content-secondary">
                {complaint.branch} · {complaint.assignee ?? 'Unassigned'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={complaint.priority} />
              <SlaStatusBadge status={timing.status} />
            </div>
            <SlaCountdown timing={timing} />
          </li>
        ))}
      </ul>
    </Card>
  )
}
