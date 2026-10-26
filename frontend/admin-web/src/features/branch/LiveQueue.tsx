import { Activity, ArrowRight, CircleArrowUp, CircleDot, Loader, UserCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../components/ui/cn'
import { PriorityBadge } from '../../components/ui/StatusBadge'
import { SlaTimer } from '../../components/ui/SlaTimer'
import { liveQueue } from './mocks'
import type { QueueStatus, QueueTicket } from './mocks'

const statusStyle: Record<QueueStatus, { style: string; icon: LucideIcon }> = {
  New: { style: 'bg-status-new-bg text-status-new-fg', icon: CircleDot },
  Claimed: { style: 'bg-status-claimed-bg text-status-claimed-fg', icon: UserCheck },
  'In Progress': { style: 'bg-status-in-progress-bg text-status-in-progress-fg', icon: Loader },
  Escalated: { style: 'bg-status-escalated-bg text-status-escalated-fg', icon: CircleArrowUp },
}

/** Small status pill used in the queue rows (20px high, 12px text). */
function QueueStatusPill({ status }: { status: QueueStatus }) {
  const { style, icon: Icon } = statusStyle[status]
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-full px-2 text-xs leading-4 font-semibold whitespace-nowrap',
        style,
      )}
    >
      <Icon size={12} aria-hidden />
      {status}
    </span>
  )
}

const cell = 'flex h-[60px] items-center gap-2 overflow-hidden px-4 text-left'
const headCell =
  'flex h-10 items-center gap-1 border-b border-line bg-canvas px-4 text-xs leading-4 font-semibold whitespace-nowrap text-content-secondary'

function QueueRow({ ticket }: { ticket: QueueTicket }) {
  const className = 'flex border-b border-line-subtle bg-surface'
  const cells = (
    <>
      <div className={cn(cell, 'w-20 shrink-0')}>
        <p className="min-w-0 flex-1 truncate font-mono text-[13px] leading-5 font-medium">#{ticket.id}</p>
      </div>
      <div className={cn(cell, 'min-w-0 flex-1')}>
        <div className="flex min-w-0 flex-1 flex-col whitespace-nowrap">
          <p className="truncate text-sm leading-5 font-medium">{ticket.title}</p>
          <p className="truncate text-xs leading-4 text-content-tertiary">{ticket.place}</p>
        </div>
      </div>
      <div className={cn(cell, 'w-[104px] shrink-0')}>
        <PriorityBadge priority={ticket.priority} />
      </div>
      <div className={cn(cell, 'w-32 shrink-0')}>
        <QueueStatusPill status={ticket.status} />
      </div>
      <div className={cn(cell, 'w-32 shrink-0')}>
        <SlaTimer state={ticket.slaState} label={ticket.sla} />
      </div>
      <div className={cn(cell, 'w-[136px] shrink-0')}>
        {ticket.assignee ? (
          <>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
              {ticket.assignee.initials}
            </span>
            <p className="min-w-0 flex-1 truncate text-sm leading-5 font-medium">{ticket.assignee.name}</p>
          </>
        ) : (
          <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 text-warning-fg">Unassigned</p>
        )}
      </div>
    </>
  )
  // Only #1042 has a ticket detail screen in the designs.
  return ticket.id === '1042' ? (
    <Link to={`/branch/tickets/${ticket.id}`} className={cn(className, 'transition-colors hover:bg-canvas')}>
      {cells}
    </Link>
  ) : (
    <div className={className}>{cells}</div>
  )
}

/** "Live queue" card from the Figma "Branch overview" frame. */
export function LiveQueue() {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        <Activity size={18} className="shrink-0 text-brand" aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col whitespace-nowrap">
          <h2 className="text-base leading-6 font-semibold">Live queue</h2>
          <p className="text-xs leading-4 text-content-tertiary">Sorted by SLA risk</p>
        </div>
        <Link
          to="/branch/tickets"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-[13px] leading-4.5 font-medium whitespace-nowrap text-content-secondary hover:bg-muted"
        >
          All tickets
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
      <div className="flex">
        <div className={cn(headCell, 'w-20 shrink-0')}>Ticket</div>
        <div className={cn(headCell, 'min-w-0 flex-1')}>Complaint</div>
        <div className={cn(headCell, 'w-[104px] shrink-0')}>Priority</div>
        <div className={cn(headCell, 'w-32 shrink-0')}>Status</div>
        <div className={cn(headCell, 'w-32 shrink-0')}>SLA</div>
        <div className={cn(headCell, 'w-[136px] shrink-0')}>Assignee</div>
      </div>
      {liveQueue.map((t) => (
        <QueueRow key={t.id} ticket={t} />
      ))}
    </section>
  )
}
