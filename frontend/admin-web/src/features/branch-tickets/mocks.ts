import type { SlaState, TicketPriority, TicketStatus } from '../../components/ui'

// Sample data for the branch manager "Tickets" tab, taken from the Figma frame. No backend is connected.
export interface BranchTicket {
  id: string
  title: string
  place: string
  submitted: string
  priority: TicketPriority
  status: TicketStatus
  /** Empty when nobody is assigned yet. */
  assignee?: { name: string; initials: string }
  slaState: SlaState
  sla: string
  updated: string
  /** Larger is newer. Used for sorting. */
  submittedOrder: number
  updatedOrder: number
}

const dk = { name: 'Dinesh Kumara', initials: 'DK' }
const kp = { name: 'Kavinda Perera', initials: 'KP' }
const ns = { name: 'Namal Silva', initials: 'NS' }
const rs = { name: 'Ravi Silva', initials: 'RS' }

export const tickets: BranchTicket[] = [
  { id: '#1053', title: 'Waiter ignored us, wrong bill', place: 'Table 11 · in AI review', submitted: '12:44', priority: 'Medium', status: 'New', slaState: 'on-track', sla: '23:10 left', updated: 'just now', submittedOrder: 11, updatedOrder: 11 },
  { id: '#1045', title: 'Billing discrepancy', place: 'Counter 2', submitted: '12:40', priority: 'Medium', status: 'New', slaState: 'on-track', sla: '24:10 left', updated: '4 min ago', submittedOrder: 10, updatedOrder: 10 },
  { id: '#1038', title: 'Wrong order delivered', place: 'Table 14', submitted: '12:14', priority: 'Critical', status: 'Escalated', assignee: dk, slaState: 'breached', sla: 'Breached −11:00', updated: '4 min ago', submittedOrder: 8, updatedOrder: 10 },
  { id: '#1031', title: 'Foreign object in soup', place: 'Table 4', submitted: '11:50', priority: 'High', status: 'In Progress', assignee: kp, slaState: 'breached', sla: 'Breached −05:20', updated: '12 min ago', submittedOrder: 6, updatedOrder: 9 },
  { id: '#1042', title: 'Food was cold', place: 'Table 7', submitted: '12:18', priority: 'High', status: 'Claimed', assignee: dk, slaState: 'warning', sla: '08:42 left', updated: '8 min ago', submittedOrder: 9, updatedOrder: 9 },
  { id: '#1049', title: 'Extra cutlery requested', place: 'Table 19', submitted: '12:30', priority: 'Normal', status: 'Assigned', assignee: ns, slaState: 'on-track', sla: '45:00 left', updated: '15 min ago', submittedOrder: 9, updatedOrder: 8 },
  { id: '#1036', title: 'Delivery missing items', place: 'Online', submitted: '11:31', priority: 'Medium', status: 'Resolved', assignee: dk, slaState: 'paused', sla: 'Met · 31 min', updated: '40 min ago', submittedOrder: 5, updatedOrder: 7 },
  { id: '#1030', title: 'Dessert served late', place: 'Table 2', submitted: 'Yesterday', priority: 'Normal', status: 'Reopened', assignee: ns, slaState: 'on-track', sla: '12:00 left', updated: '1 h ago', submittedOrder: 3, updatedOrder: 6 },
  { id: '#1027', title: 'Noisy dining area', place: 'Table 5', submitted: 'Yesterday', priority: 'Normal', status: 'Closed', assignee: kp, slaState: 'paused', sla: 'Met · 22 min', updated: 'Yesterday', submittedOrder: 3, updatedOrder: 3 },
  { id: '#1022', title: 'Allergen not disclosed', place: 'Table 6', submitted: '17 Oct', priority: 'Critical', status: 'Closed', assignee: rs, slaState: 'paused', sla: 'Met · 18 min', updated: '18 Oct', submittedOrder: 2, updatedOrder: 2 },
  { id: '#1018', title: 'Duplicate order', place: 'Counter 1', submitted: '16 Oct', priority: 'Normal', status: 'Cancelled', slaState: 'paused', sla: '—', updated: '16 Oct', submittedOrder: 1, updatedOrder: 1 },
]

export type TicketChip = 'all' | 'new' | 'active' | 'overdue' | 'escalated' | 'closed'

export const ticketChips: { key: TicketChip; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'active', label: 'Active' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'closed', label: 'Closed & resolved' },
]

/** Chip counts as shown in the Figma frame (the branch's full ticket list, not just the rows shown). */
export const chipCounts: Record<TicketChip, number> = {
  all: 214,
  new: 6,
  active: 12,
  overdue: 2,
  escalated: 1,
  closed: 189,
}

export const totalTickets = 214
export const pageCount = 13

export const statusOptions = ['Status: All', 'New', 'Assigned', 'Claimed', 'In Progress', 'Escalated', 'Resolved', 'Reopened', 'Closed', 'Cancelled']
export const priorityOptions = ['Priority: All', 'Critical', 'High', 'Medium', 'Normal']
export const assignedOptions = ['Assigned: Anyone', 'Unassigned', 'Dinesh Kumara', 'Kavinda Perera', 'Namal Silva', 'Ravi Silva']
export const slaOptions = ['SLA: All', 'On track', 'At risk', 'Breached', 'Met']
export const rangeOptions = ['Last 30 days', 'Last 7 days', 'Last 90 days']

export const priorityRank: Record<TicketPriority, number> = { Critical: 4, High: 3, Medium: 2, Normal: 1 }
