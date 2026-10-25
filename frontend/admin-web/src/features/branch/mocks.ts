import type { SlaState } from '../../components/ui/SlaTimer'
import type { TicketPriority } from '../../components/ui/StatusBadge'

// Sample data for the Branch overview screen. No backend is connected.

export type QueueStatus = 'New' | 'Claimed' | 'In Progress' | 'Escalated'

export interface QueueTicket {
  id: string
  title: string
  place: string
  priority: TicketPriority
  status: QueueStatus
  slaState: SlaState
  sla: string
  /** Empty when nobody is assigned yet. */
  assignee?: { initials: string; name: string }
}

export const liveQueue: QueueTicket[] = [
  { id: '1038', title: 'Wrong order delivered', place: 'Table 14', priority: 'Critical', status: 'Escalated', slaState: 'warning', sla: '02:15 left', assignee: { initials: 'DK', name: 'Dinesh K.' } },
  { id: '1031', title: 'Foreign object in soup', place: 'Table 4', priority: 'High', status: 'In Progress', slaState: 'breached', sla: '−05:20', assignee: { initials: 'KP', name: 'Kavinda P.' } },
  { id: '1042', title: 'Food was cold', place: 'Table 7', priority: 'High', status: 'Claimed', slaState: 'warning', sla: '08:42 left', assignee: { initials: 'DK', name: 'Dinesh K.' } },
  { id: '1045', title: 'Billing discrepancy', place: 'Counter 2', priority: 'Medium', status: 'New', slaState: 'on-track', sla: '24:10 left' },
]

export interface DecisionItem {
  label: string
  count: number
  tone: 'brand' | 'danger'
  /** Branch screen this item opens. */
  to: string
}

export const decisions: DecisionItem[] = [
  { label: 'AI review queue', count: 5, tone: 'brand', to: '/branch/ai-review' },
  { label: 'Resolution approvals', count: 4, tone: 'brand', to: '/branch/approvals' },
  { label: 'Escalations to acknowledge', count: 1, tone: 'danger', to: '/branch/escalations' },
]

export interface OnShiftMember {
  initials: string
  name: string
  role: string
  tone: 'brand' | 'warning' | 'danger'
}

export const onShift: OnShiftMember[] = [
  { initials: 'DK', name: 'Dinesh Kumara', role: 'Waiter / Waitress', tone: 'warning' },
  { initials: 'KP', name: 'Kavinda Perera', role: 'Floor Supervisor', tone: 'brand' },
  { initials: 'NJ', name: 'Nadeesha Jay', role: 'Bartender', tone: 'brand' },
  { initials: 'RS', name: 'Ravi Silva', role: 'Head Chef / Kitchen Manager', tone: 'danger' },
]
