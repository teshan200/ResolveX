import type { Escalation } from './types'

// Mock data only: no backend or AI service is connected.
// The three open escalations come from the Figma "Escalated to me" frame. The two closed
// ones are needed so the "AI escalations this month" card can show 5 against 3 managers.
export const escalations: Escalation[] = [
  {
    id: '#1055',
    title: 'Branch Manager dismissed my complaint and refused a replacement',
    branch: 'Colombo Branch',
    manager: 'Ayesha Perera',
    priority: 'Critical',
    ticketStatus: 'Escalated',
    state: 'awaiting',
    escalatedOn: '19 Oct, 12:41',
    escalatedDaysAgo: 0,
    minutesSince: 3 * 60 + 41,
    reason:
      'Complaint is about the Branch Manager’s own handling, so it can’t be resolved at branch level.',
  },
  {
    id: '#1058',
    title: 'Manager ignored my allergy concern',
    branch: 'Galle Fort',
    manager: 'Ruwan Silva',
    priority: 'Critical',
    ticketStatus: 'Escalated',
    state: 'awaiting',
    escalatedOn: '19 Oct, 10:05',
    escalatedDaysAgo: 0,
    minutesSince: 6 * 60 + 12,
    reason:
      'Guest reports the Branch Manager personally dismissed an allergy question — safety risk.',
  },
  {
    id: '#1061',
    title: 'Branch Manager was rude at the counter',
    branch: 'Galle Fort',
    manager: 'Ruwan Silva',
    priority: 'High',
    ticketStatus: 'Escalated',
    state: 'acknowledged',
    escalatedOn: '19 Oct, 11:58',
    escalatedDaysAgo: 0,
    minutesSince: 4 * 60 + 24,
    reason: 'Complaint names the Branch Manager’s behaviour directly.',
  },
  {
    id: '#1049',
    title: 'Manager refused a refund for a cold meal',
    branch: 'Negombo Beach',
    manager: 'Tharindu Fernando',
    priority: 'Medium',
    ticketStatus: 'Resolved',
    state: 'closed',
    escalatedOn: '9 Oct, 15:20',
    escalatedDaysAgo: 10,
    minutesSince: 10 * 24 * 60,
    reason: 'Complaint is about the Branch Manager’s own handling.',
  },
  {
    id: '#1052',
    title: 'Manager ignored a reservation mix-up',
    branch: 'Negombo Beach',
    manager: 'Tharindu Fernando',
    priority: 'Normal',
    ticketStatus: 'Resolved',
    state: 'closed',
    escalatedOn: '12 Oct, 09:10',
    escalatedDaysAgo: 7,
    minutesSince: 7 * 24 * 60,
    reason: 'Complaint names the Branch Manager’s behaviour directly.',
  },
]

export const branchOptions = ['All branches', 'Colombo Branch', 'Kandy Branch', 'Galle Fort', 'Negombo Beach']
export const priorityOptions = ['All priorities', 'Critical', 'High', 'Medium', 'Normal']
export const statusOptions = ['All statuses', 'Escalated', 'Resolved']
export const dateOptions = [
  { label: 'Escalated: last 7 days', days: 7 },
  { label: 'Escalated: last 30 days', days: 30 },
  { label: 'Escalated: last 90 days', days: 90 },
]
