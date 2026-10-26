import type { TimelineEntry } from '../escalation/detail'

// Sample data for the branch Ticket detail screen. #1042 is the only ticket with a design.

export const ticket1042 = {
  id: '#1042',
  title: 'Food was cold',
  subtitle:
    'Colombo Branch · Table 7 · submitted 12:18 PM via “Colombo - Dining Area” · last updated 8 min ago',
  guestComplaint: '“The chicken biryani and garlic naan arrived barely lukewarm after a 35-minute wait.”',
  priorities: ['Critical', 'High', 'Medium', 'Normal'] as const,
  designations: ['Waiter / Waitress'],
  employees: ['Dinesh Kumara'],
  details: [
    ['Branch', 'Colombo Branch'],
    ['Service point', 'Table 7'],
    ['QR code', 'Colombo - Dining Area'],
    ['Submitted', '19 Oct, 12:18 PM'],
    ['Last updated', '8 min ago'],
    ['Customer case', 'RX-1042'],
  ] as [string, string][],
  timeline: [
    { id: 'p', kind: 'response', title: 'Progress update', time: '12:29 PM', actor: 'by Dinesh Kumara · Waiter / Waitress', description: 'Replacement ordered from kitchen, ETA 6 minutes.' },
    { id: 'c', kind: 'claimed', title: 'Ticket claimed', time: '12:26 PM', actor: 'by Dinesh Kumara · mobile app', description: 'Acknowledgement SLA met in 08:12.' },
    { id: 'a', kind: 'assigned', title: 'Assigned to Dinesh Kumara', time: '12:20 PM', actor: 'by Ayesha Perera · Branch Manager', description: 'Waiter / Waitress · priority set to High.' },
    { id: 's', kind: 'received', title: 'Complaint submitted', time: '12:18 PM', actor: 'by guest via QR · Colombo - Dining Area', description: 'AI: Food quality › Temperature · 92% (sample).' },
  ] as TimelineEntry[],
}
