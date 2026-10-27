import type { TicketPriority, TicketStatus } from '../../components/ui'

// Sample data for the tenant admin "Complaints overview" tab, taken from the Figma frame.
// No backend is connected.
export interface ComplaintRow {
  id: string
  title: string
  /** Second line under the title, for example "Table 14 · Dine-in". */
  place: string
  branch: string
  priority: TicketPriority
  status: TicketStatus
  /** Empty when nobody is assigned yet. */
  assignee?: { name: string; initials: string }
  created: string
  updated: string
  /** Used for sorting: larger is newer. */
  createdOrder: number
  updatedOrder: number
}

export const complaints: ComplaintRow[] = [
  { id: '#1038', title: 'Wrong order delivered', place: 'Table 14 · Dine-in', branch: 'Colombo', priority: 'Critical', status: 'Escalated', assignee: { name: 'Dinesh Kumara', initials: 'DK' }, created: '19 Oct, 12:14', updated: '4 min ago', createdOrder: 9, updatedOrder: 8 },
  { id: '#1031', title: 'Foreign object in soup', place: 'Table 4 · Dine-in', branch: 'Colombo', priority: 'High', status: 'In Progress', assignee: { name: 'Kavinda Perera', initials: 'KP' }, created: '19 Oct, 11:50', updated: '12 min ago', createdOrder: 6, updatedOrder: 6 },
  { id: '#1042', title: 'Food was cold', place: 'Table 7 · Dine-in', branch: 'Colombo', priority: 'High', status: 'Claimed', assignee: { name: 'Dinesh Kumara', initials: 'DK' }, created: '19 Oct, 12:18', updated: '8 min ago', createdOrder: 8, updatedOrder: 7 },
  { id: '#1051', title: 'Long wait for the bill', place: 'Table 3 · Dine-in', branch: 'Kandy', priority: 'Medium', status: 'Assigned', assignee: { name: 'Sachini Bandara', initials: 'SB' }, created: '19 Oct, 12:05', updated: '20 min ago', createdOrder: 7, updatedOrder: 5 },
  { id: '#1045', title: 'Billing discrepancy', place: 'Counter 2 · Takeaway', branch: 'Colombo', priority: 'Medium', status: 'New', created: '19 Oct, 12:40', updated: 'just now', createdOrder: 10, updatedOrder: 9 },
  { id: '#1047', title: 'Rude staff behaviour', place: 'Counter 1 · Takeaway', branch: 'Galle', priority: 'High', status: 'Escalated', assignee: { name: 'Ruwan Silva', initials: 'RS' }, created: '19 Oct, 11:40', updated: '1 h ago', createdOrder: 5, updatedOrder: 4 },
  { id: '#1029', title: 'Wrong drink served', place: 'Table 2 · Dine-in', branch: 'Negombo', priority: 'Normal', status: 'Resolved', assignee: { name: 'Tharindu Fernando', initials: 'TF' }, created: '18 Oct, 20:11', updated: '18 Oct, 20:30', createdOrder: 3, updatedOrder: 3 },
  { id: '#1024', title: 'Hair in food', place: 'Table 9 · Dine-in', branch: 'Galle', priority: 'Critical', status: 'Unable to Resolve', assignee: { name: 'Ruwan Silva', initials: 'RS' }, created: '18 Oct, 19:02', updated: '19 Oct, 10:05', createdOrder: 2, updatedOrder: 2 },
  { id: '#1019', title: 'Delivery arrived late', place: 'Online · Delivery', branch: 'Kandy', priority: 'Medium', status: 'Closed', assignee: { name: 'Sachini Bandara', initials: 'SB' }, created: '17 Oct, 21:15', updated: '18 Oct, 09:00', createdOrder: 1, updatedOrder: 1 },
]

export const totalComplaints = 248
export const pageCount = 13

export const branchOptions = ['All branches', 'Colombo', 'Kandy', 'Galle', 'Negombo']
export const priorityOptions = ['All priorities', 'Critical', 'High', 'Medium', 'Normal']
export const statusOptions = [
  'All statuses',
  'New',
  'Assigned',
  'Claimed',
  'In Progress',
  'Escalated',
  'Resolved',
  'Unable to Resolve',
  'Closed',
]
export const rangeOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days']

export const priorityRank: Record<TicketPriority, number> = { Critical: 4, High: 3, Medium: 2, Normal: 1 }
