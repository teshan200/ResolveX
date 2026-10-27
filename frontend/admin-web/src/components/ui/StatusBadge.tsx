import {
  CircleAlert,
  CircleArrowUp,
  CircleCheck,
  CircleDot,
  CircleX,
  ChevronUp,
  Loader,
  Lock,
  Minus,
  RotateCcw,
  TriangleAlert,
  User,
  UserCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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

const statusStyles: Record<TicketStatus, { style: string; icon: LucideIcon }> = {
  New: { style: 'bg-status-new-bg text-status-new-fg', icon: CircleDot },
  Assigned: { style: 'bg-status-assigned-bg text-status-assigned-fg', icon: User },
  Claimed: { style: 'bg-status-claimed-bg text-status-claimed-fg', icon: UserCheck },
  'In Progress': {
    style: 'bg-status-in-progress-bg text-status-in-progress-fg',
    icon: Loader,
  },
  Resolved: { style: 'bg-status-resolved-bg text-status-resolved-fg', icon: CircleCheck },
  Escalated: { style: 'bg-status-escalated-bg text-status-escalated-fg', icon: CircleArrowUp },
  Reopened: { style: 'bg-status-reopened-bg text-status-reopened-fg', icon: RotateCcw },
  Cancelled: { style: 'bg-status-cancelled-bg text-status-cancelled-fg', icon: CircleX },
  'Unable to Resolve': {
    style: 'bg-status-unable-bg text-status-unable-fg',
    icon: CircleAlert,
  },
  Closed: { style: 'bg-status-closed-bg text-status-closed-fg', icon: Lock },
}

const priorityStyles: Record<TicketPriority, { style: string; icon: LucideIcon }> = {
  Critical: { style: 'bg-priority-critical-bg text-priority-critical-fg', icon: TriangleAlert },
  High: { style: 'bg-priority-high-bg text-priority-high-fg', icon: ChevronUp },
  Medium: { style: 'bg-priority-medium-bg text-priority-medium-fg', icon: Minus },
  Normal: { style: 'bg-priority-normal-bg text-priority-normal-fg', icon: Minus },
}

// 'sm' is the 20px badge used inside table rows.
export function StatusBadge({ status, size = 'md' }: { status: TicketStatus; size?: 'md' | 'sm' }) {
  const { style, icon: Icon } = statusStyles[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 font-medium whitespace-nowrap',
        size === 'sm' ? 'h-5 text-xs leading-4' : 'h-6 text-[13px] leading-4.5',
        style,
      )}
    >
      <Icon size={14} />
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const { style, icon: Icon } = priorityStyles[priority]
  return (
    <span
      className={cn(
        'inline-flex h-5.5 items-center gap-1 rounded-xs px-2 text-xs leading-4 font-semibold whitespace-nowrap uppercase',
        style,
      )}
    >
      <Icon size={12} />
      {priority}
    </span>
  )
}
