// Sample data for the Audit log screen. No backend is connected.
import type { AuditCategory, AuditEvent } from './types'

export const AUDIT_CATEGORIES: AuditCategory[] = [
  'Authentication',
  'Branches & staff',
  'Subscription',
  'Tickets',
  'Escalations',
  'Cases',
  'AI overrides',
  'Admin',
]

/** The screen reports the whole log (12,904 events) while the sample holds a few rows. */
export const auditTotal = 12904

/** Page count shown for the full, unfiltered log. */
export const auditPageCount = 13

export const auditEvents: AuditEvent[] = [
  { id: 'a1', time: '19 Oct · 15:58:12', actorName: 'Marcus Vance', actorInitials: 'MV', action: 'Assigned Branch Manager', detail: 'Dilan Jayawardena → Matara branch', category: 'Branches & staff', target: 'BR-MATARA', source: '10.0.4.12 · Chrome' },
  { id: 'a2', time: '19 Oct · 15:41:03', actorName: 'Kavinda Perera', actorInitials: 'KP', action: 'Overrode AI classification', detail: 'Food quality › Temperature → Wait time', category: 'AI overrides', target: '#1042', source: 'Mobile app' },
  { id: 'a3', time: '19 Oct · 15:33:48', actorName: 'System', actorInitials: 'SY', action: 'Escalated ticket', detail: 'Staff → Supervisor · acknowledgement overdue', category: 'Escalations', target: '#1038', source: 'SLA engine' },
  { id: 'a4', time: '19 Oct · 14:50:21', actorName: 'Ayesha Perera', actorInitials: 'AP', action: 'Approved resolution', detail: '#1042 closed · resolution email sent to guest', category: 'Cases', target: 'RX-1042', source: '10.0.4.31 · Safari' },
  { id: 'a5', time: '19 Oct · 14:12:09', actorName: 'Marcus Vance', actorInitials: 'MV', action: 'Updated hierarchy', detail: 'Level 3: added Assistant Branch Manager', category: 'Branches & staff', target: 'HIER-L3', source: '10.0.4.12 · Chrome' },
  { id: 'a6', time: '19 Oct · 09:02:55', actorName: 'Dinesh Kumara', actorInitials: 'DK', action: 'Signed in', detail: '2FA not required · new device', category: 'Authentication', target: 'ST-4820', source: 'Mobile app' },
  { id: 'a7', time: '18 Oct · 22:00:00', actorName: 'System', actorInitials: 'SY', action: 'Subscription renewed', detail: 'Enterprise · 32 outlets · LKR 71,000', category: 'Subscription', target: 'INV-2026-0918', source: 'Billing' },
  { id: 'a8', time: '18 Oct · 17:45:31', actorName: 'Marcus Vance', actorInitials: 'MV', action: 'Published form', detail: 'Guest feedback · Dine-in v4 → 32 branches', category: 'Admin', target: 'FORM-DINE-v4', source: '10.0.4.12 · Chrome' },
  { id: 'a9', time: '18 Oct · 16:20:44', actorName: 'Ravi Silva', actorInitials: 'RS', action: 'Claimed ticket', detail: 'Wrong order delivered · Colombo Branch', category: 'Tickets', target: '#1041', source: 'Mobile app' },
  { id: 'a10', time: '18 Oct · 15:05:17', actorName: 'Marcus Vance', actorInitials: 'MV', action: 'Added employee', detail: 'Kasun Jayasinghe · Head Waiter · Colombo', category: 'Branches & staff', target: 'ST-4821', source: '10.0.4.12 · Chrome' },
  { id: 'a11', time: '18 Oct · 12:48:02', actorName: 'System', actorInitials: 'SY', action: 'Escalated ticket', detail: 'Supervisor → Branch Manager · resolution overdue', category: 'Escalations', target: '#1035', source: 'SLA engine' },
  { id: 'a12', time: '18 Oct · 11:30:26', actorName: 'Nimal Perera', actorInitials: 'NP', action: 'Resolved ticket', detail: 'Table not cleaned · evidence attached', category: 'Tickets', target: '#1040', source: 'Mobile app' },
  { id: 'a13', time: '17 Oct · 18:12:49', actorName: 'Marcus Vance', actorInitials: 'MV', action: 'Disabled QR code', detail: 'Colombo Branch · Table 7', category: 'Admin', target: 'QR-0007', source: '10.0.4.12 · Chrome' },
  { id: 'a14', time: '17 Oct · 09:15:00', actorName: 'Ayesha Perera', actorInitials: 'AP', action: 'Signed in', detail: '2FA not required · known device', category: 'Authentication', target: 'ST-4801', source: '10.0.4.31 · Safari' },
  { id: 'a15', time: '16 Oct · 14:41:38', actorName: 'Marcus Vance', actorInitials: 'MV', action: 'Changed plan', detail: 'Business → Enterprise · 32 outlets', category: 'Subscription', target: 'SUB-0412', source: 'Billing' },
  { id: 'a16', time: '16 Oct · 10:27:05', actorName: 'Sachini Bandara', actorInitials: 'SB', action: 'Approved resolution', detail: '#1029 closed · resolution email sent to guest', category: 'Cases', target: 'RX-1029', source: '10.0.5.18 · Chrome' },
]
