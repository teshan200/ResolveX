import { cn } from './cn'

export type TicketStatus =
  | 'New'
  | 'Assigned'
  | 'Claimed'
  | 'In Progress'
  | 'Resolved'
  | 'Escalated'
  | 'Reopened'
  | 'Cancelled'
  | 'Unable to Resolve'
  | 'Closed'

export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Normal'

const statusStyles: Record<TicketStatus, string> = {
  New: 'bg-status-new-bg text-status-new-fg',
  Assigned: 'bg-status-assigned-bg text-status-assigned-fg',
  Claimed: 'bg-status-claimed-bg text-status-claimed-fg',
  'In Progress': 'bg-status-in-progress-bg text-status-in-progress-fg',
  Resolved: 'bg-status-resolved-bg text-status-resolved-fg',
  Escalated: 'bg-status-escalated-bg text-status-escalated-fg',
  Reopened: 'bg-status-reopened-bg text-status-reopened-fg',
  Cancelled: 'bg-status-cancelled-bg text-status-cancelled-fg',
  'Unable to Resolve': 'bg-status-unable-bg text-status-unable-fg',
  Closed: 'bg-status-closed-bg text-status-closed-fg',
}

const priorityStyles: Record<TicketPriority, string> = {
  Critical: 'bg-priority-critical-bg text-priority-critical-fg',
  High: 'bg-priority-high-bg text-priority-high-fg',
  Medium: 'bg-priority-medium-bg text-priority-medium-fg',
  Normal: 'bg-priority-normal-bg text-priority-normal-fg',
}

const pill = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={cn(pill, statusStyles[status])}>{status}</span>
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={cn(pill, priorityStyles[priority])}>{priority}</span>
}
