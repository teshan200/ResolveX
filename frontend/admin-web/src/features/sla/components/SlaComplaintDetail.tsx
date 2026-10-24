import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card, PriorityBadge, StatusBadge } from '../../../components/ui'
import { WARNING_THRESHOLD, formatDateTime, formatDuration, getSlaTiming } from '../sla'
import type { SlaComplaint } from '../types'
import { SlaCountdown } from './SlaCountdown'
import { SlaStatusBadge } from './SlaStatusBadge'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-content-secondary">{label}</dt>
      <dd className="text-sm font-medium sm:text-right">{children}</dd>
    </div>
  )
}

export function SlaComplaintDetail({ complaint, nowMs }: { complaint: SlaComplaint; nowMs: number }) {
  const timing = getSlaTiming(complaint, nowMs)
  const opened = new Date(complaint.openedAt).getTime()
  const due = new Date(complaint.dueAt).getTime()
  const warnAt = opened + (due - opened) * WARNING_THRESHOLD

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/tenant/sla-monitoring"
        className="w-fit text-sm font-medium text-content-link hover:underline focus-visible:outline-2 focus-visible:outline-line-focus"
      >
        ← Back to SLA monitoring
      </Link>

      <header className="flex flex-col gap-3">
        <div>
          <p className="text-sm text-content-tertiary">Complaint {complaint.id}</p>
          <h1 className="text-2xl font-semibold">{complaint.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlaStatusBadge status={timing.status} />
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.ticketStatus} />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section aria-labelledby="sla-timing">
          <Card className="flex flex-col gap-5">
            <h2 id="sla-timing" className="text-lg font-semibold">
              SLA timing
            </h2>
            <SlaCountdown timing={timing} />
            <dl className="flex flex-col gap-3 border-t border-line pt-4">
              <Field label="SLA target">{formatDuration(due - opened)}</Field>
              <Field label="Clock">{complaint.paused ? 'Paused' : 'Running'}</Field>
              <Field label="Opened">{formatDateTime(opened)}</Field>
              <Field label={`Warning at ${Math.round(WARNING_THRESHOLD * 100)}%`}>
                {formatDateTime(warnAt)}
              </Field>
              <Field label="Due">{formatDateTime(due)}</Field>
              <Field label="Time elapsed">{formatDuration(nowMs - opened)}</Field>
            </dl>
          </Card>
        </section>

        <section aria-labelledby="complaint-info">
          <Card className="flex flex-col gap-5">
            <h2 id="complaint-info" className="text-lg font-semibold">
              Complaint details
            </h2>
            <dl className="flex flex-col gap-3">
              <Field label="Customer">{complaint.customer}</Field>
              <Field label="Branch">{complaint.branch}</Field>
              <Field label="Category">{complaint.category}</Field>
              <Field label="Priority">{complaint.priority}</Field>
              <Field label="Ticket status">{complaint.ticketStatus}</Field>
              <Field label="Assignee">{complaint.assignee ?? 'Unassigned'}</Field>
            </dl>
          </Card>
        </section>
      </div>
    </div>
  )
}
