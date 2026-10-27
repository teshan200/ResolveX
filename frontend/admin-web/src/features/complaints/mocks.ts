// Sample data for the Complaints overview screen. No backend is connected.
import type { ComplaintPeriod, ComplaintRow } from './types'

/** The screen reports every complaint in the company, while the sample holds a few rows. */
export const complaintTotal = 248

/** Page count shown for the full, unfiltered list. */
export const complaintPageCount = 13

export const BRANCH_FILTERS = ['All branches', 'Colombo', 'Kandy', 'Galle', 'Negombo', 'Nuwara Eliya', 'Matara']
export const PRIORITY_FILTERS = ['All priorities', 'Critical', 'High', 'Medium', 'Normal']
export const STATUS_FILTERS = [
  'All statuses',
  'New',
  'Assigned',
  'Claimed',
  'In Progress',
  'Escalated',
  'Resolved',
  'Reopened',
  'Unable to Resolve',
  'Closed',
  'Cancelled',
]
export const PERIOD_FILTERS: ComplaintPeriod[] = ['Today', 'Last 7 days', 'Last 30 days']

const person = (name: string) => ({ name, initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2) })

export const complaints: ComplaintRow[] = [
  { id: '#1038', subject: 'Wrong order delivered', servicePoint: 'Table 14 · Dine-in', branch: 'Colombo', priority: 'Critical', status: 'Escalated', assignee: person('Dinesh Kumara'), created: '19 Oct, 12:14', updated: '4 min ago', createdAgo: 30, updatedAgo: 4 },
  { id: '#1031', subject: 'Foreign object in soup', servicePoint: 'Table 4 · Dine-in', branch: 'Colombo', priority: 'High', status: 'In Progress', assignee: person('Kavinda Perera'), created: '19 Oct, 11:50', updated: '12 min ago', createdAgo: 54, updatedAgo: 12 },
  { id: '#1042', subject: 'Food was cold', servicePoint: 'Table 7 · Dine-in', branch: 'Colombo', priority: 'High', status: 'Claimed', assignee: person('Dinesh Kumara'), created: '19 Oct, 12:18', updated: '8 min ago', createdAgo: 26, updatedAgo: 8 },
  { id: '#1051', subject: 'Long wait for the bill', servicePoint: 'Table 3 · Dine-in', branch: 'Kandy', priority: 'Medium', status: 'Assigned', assignee: person('Sachini Bandara'), created: '19 Oct, 12:05', updated: '20 min ago', createdAgo: 39, updatedAgo: 20 },
  { id: '#1045', subject: 'Billing discrepancy', servicePoint: 'Counter 2 · Takeaway', branch: 'Colombo', priority: 'Medium', status: 'New', assignee: null, created: '19 Oct, 12:40', updated: 'just now', createdAgo: 4, updatedAgo: 0 },
  { id: '#1047', subject: 'Rude staff behaviour', servicePoint: 'Counter 1 · Takeaway', branch: 'Galle', priority: 'High', status: 'Escalated', assignee: person('Ruwan Silva'), created: '19 Oct, 11:40', updated: '1 h ago', createdAgo: 64, updatedAgo: 60 },
  { id: '#1029', subject: 'Wrong drink served', servicePoint: 'Table 2 · Dine-in', branch: 'Negombo', priority: 'Normal', status: 'Resolved', assignee: person('Tharindu Fernando'), created: '18 Oct, 20:11', updated: '18 Oct, 20:30', createdAgo: 993, updatedAgo: 974 },
  { id: '#1024', subject: 'Hair in food', servicePoint: 'Table 9 · Dine-in', branch: 'Galle', priority: 'Critical', status: 'Unable to Resolve', assignee: person('Ruwan Silva'), created: '18 Oct, 19:02', updated: '19 Oct, 10:05', createdAgo: 1062, updatedAgo: 159 },
  { id: '#1019', subject: 'Delivery arrived late', servicePoint: 'Online · Delivery', branch: 'Kandy', priority: 'Medium', status: 'Closed', assignee: person('Sachini Bandara'), created: '17 Oct, 21:15', updated: '18 Oct, 09:00', createdAgo: 2250, updatedAgo: 1664 },
  // More samples, so the filters and the second page have something to show.
  { id: '#1055', subject: 'Cold coffee served', servicePoint: 'Table 11 · Dine-in', branch: 'Colombo', priority: 'Normal', status: 'New', assignee: null, created: '19 Oct, 12:31', updated: '9 min ago', createdAgo: 13, updatedAgo: 9 },
  { id: '#1050', subject: 'Missing item in takeaway', servicePoint: 'Counter 3 · Takeaway', branch: 'Nuwara Eliya', priority: 'Medium', status: 'In Progress', assignee: person('Ishara Gamage'), created: '19 Oct, 10:22', updated: '35 min ago', createdAgo: 142, updatedAgo: 35 },
  { id: '#1048', subject: 'Table not cleaned', servicePoint: 'Table 6 · Dine-in', branch: 'Kandy', priority: 'Normal', status: 'Resolved', assignee: person('Sachini Bandara'), created: '19 Oct, 09:48', updated: '2 h ago', createdAgo: 176, updatedAgo: 120 },
  { id: '#1043', subject: 'Overcharged on bill', servicePoint: 'Counter 1 · Takeaway', branch: 'Galle', priority: 'High', status: 'Reopened', assignee: person('Ruwan Silva'), created: '18 Oct, 18:30', updated: '3 h ago', createdAgo: 1094, updatedAgo: 180 },
  { id: '#1036', subject: 'Delivery missing items', servicePoint: 'Online · Delivery', branch: 'Colombo', priority: 'High', status: 'Resolved', assignee: person('Dinesh Kumara'), created: '18 Oct, 14:05', updated: '18 Oct, 15:10', createdAgo: 1359, updatedAgo: 1294 },
  { id: '#1027', subject: 'Staff were slow to greet', servicePoint: 'Table 8 · Dine-in', branch: 'Matara', priority: 'Normal', status: 'Closed', assignee: person('Dilan Jayawardena'), created: '17 Oct, 13:40', updated: '18 Oct, 08:00', createdAgo: 2584, updatedAgo: 1724 },
  { id: '#1021', subject: 'Noisy kitchen near tables', servicePoint: 'Table 1 · Dine-in', branch: 'Negombo', priority: 'Normal', status: 'Cancelled', assignee: null, created: '16 Oct, 19:25', updated: '17 Oct, 10:00', createdAgo: 3939, updatedAgo: 2564 },
]
