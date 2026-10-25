import type { TimelineEntry } from '../escalation/detail'

// Sample data for the tenant admin Complaint detail screen. #1042 is the only complaint with a design.

export const complaint1042 = {
  id: '#1042',
  title: 'Food was cold',
  subtitle: 'Colombo Branch · Table 7 · Dine-in · Created 12:18 PM by guest via QR · read-only',
  banner: {
    title: 'View only',
    description:
      'Handled by Colombo Branch (Branch Manager: Ayesha Perera). Tenant Admin can follow progress but not change status, priority or assignment.',
  },
  guestComplaint:
    '“The chicken biryani and garlic naan arrived barely lukewarm after a 35-minute wait. Our server was handling another section and couldn’t re-fire it.”',
  meta: { rating: 'Rating 2 / 5', channel: 'Dine-in', guest: 'Nimal Perera · nimal.perera@gmail.com', photos: '1 photo' },
  tabs: [
    { label: 'Activity', count: 6 },
    { label: 'Notes', count: 2 },
    { label: 'Evidence', count: 1 },
    { label: 'Customer case' },
  ],
  timeline: [
    { id: 'p', kind: 'response', title: 'Progress update', time: '12:29 PM', actor: 'by Dinesh K. · Waiter / Waitress', description: 'Replacement biryani ordered from kitchen, ETA 6 minutes. Apologized to guest.' },
    { id: 'c', kind: 'claimed', title: 'Ticket claimed', time: '12:26 PM', actor: 'by Dinesh K. · mobile app', description: 'Acknowledgement SLA met in 08:12.' },
    { id: 'a', kind: 'assigned', title: 'Assigned to Dinesh Kumara', time: '12:19 PM', actor: 'by AI routing', description: 'Food quality › Temperature · High · 92% confidence · assigned by Ayesha P. (Branch Manager)' },
    { id: 's', kind: 'received', title: 'Ticket created', time: '12:18 PM', actor: 'by guest via QR · Table 7', description: 'Rating 2/5 · photo attached · email on resolution.' },
  ] as TimelineEntry[],
  ai: {
    percent: 92,
    rows: [
      ['Category', 'Food quality'],
      ['Sub-category', 'Temperature'],
    ] as [string, string][],
    rules: 'Business rules passed · reviewed by branch',
  },
  details: [
    ['Branch', 'Colombo Branch'],
    ['Service point', 'Table 7 · Dining hall'],
    ['Assigned designation', 'Waiter / Waitress'],
    ['Order', '#ORD-8821'],
    ['SLA policy', 'High · 15m / 45m'],
  ] as [string, string][],
  customerCase: [
    ['Guest', 'Nimal Perera'],
    ['Updates', 'Email on resolution'],
    ['Previous complaints', '1 (Aug 2026)'],
  ] as [string, string][],
}
