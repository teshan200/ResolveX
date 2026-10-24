import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui'
import { formatDuration, getSlaTiming, slaDetailPath } from '../sla'
import type { SlaComplaint } from '../types'

/** Complaints that are past their due time, most recently breached first. */
export function SlaBreachList({ complaints, nowMs }: { complaints: SlaComplaint[]; nowMs: number }) {
  const breached = complaints
    .filter((c) => getSlaTiming(c, nowMs).status === 'Breached')
    .sort((a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime())

  return (
    <Card className="h-full">
      {breached.length === 0 ? (
        <p className="text-sm text-content-secondary">No complaints have breached the SLA.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line-subtle">
          {breached.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <Link
                  to={slaDetailPath(c.id)}
                  className="block truncate text-sm font-medium hover:text-content-link hover:underline"
                >
                  <span className="text-content-tertiary">{c.id}</span> {c.title}
                </Link>
                <p className="truncate text-xs text-content-secondary">
                  {c.branch} · {c.assignee ?? 'Unassigned'}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-sla-breached-fg tabular-nums">
                {formatDuration(nowMs - new Date(c.dueAt).getTime())} overdue
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
