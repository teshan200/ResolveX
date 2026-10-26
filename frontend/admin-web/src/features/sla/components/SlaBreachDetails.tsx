import type { ReactNode } from 'react'
import { Card } from '../../../components/ui'
import { buildTimeline, timeUsedRatio } from '../history'
import { formatDateTime, formatDuration, getSlaTiming } from '../sla'
import type { SlaComplaint } from '../types'

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-content-secondary">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  )
}

/** Summary of a breached complaint. Renders nothing for complaints that have not breached. */
export function SlaBreachDetails({ complaint, nowMs }: { complaint: SlaComplaint; nowMs: number }) {
  const timing = getSlaTiming(complaint, nowMs)
  if (timing.status !== 'Breached') return null

  const escalation = buildTimeline(complaint, nowMs).find((e) => e.kind === 'escalated')
  const due = new Date(complaint.dueAt).getTime()

  return (
    <section aria-labelledby="breach-details">
      <Card className="flex flex-col gap-4 border-danger-border bg-danger-bg">
        <h2 id="breach-details" className="text-lg font-semibold text-danger-fg">
          Breach details
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Breached at">{formatDateTime(due)}</Fact>
          <Fact label="Overdue by">{formatDuration(nowMs - due)}</Fact>
          <Fact label="Time used">{Math.round(timeUsedRatio(complaint, nowMs) * 100)}% of target</Fact>
          <Fact label="Assignee at breach">{complaint.assignee ?? 'Unassigned'}</Fact>
          <Fact label="Escalation">
            {escalation
              ? `Escalated ${formatDateTime(new Date(escalation.at).getTime())}`
              : 'Not escalated yet'}
          </Fact>
          <Fact label="Ticket status">{complaint.ticketStatus}</Fact>
          <Fact label="Category">{complaint.category}</Fact>
          <Fact label="Branch">{complaint.branch}</Fact>
        </dl>
      </Card>
    </section>
  )
}
