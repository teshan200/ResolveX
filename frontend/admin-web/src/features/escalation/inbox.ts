import type { TicketPriority } from '../../components/ui'
import type { TimelineEntry } from './detail'

export interface InboxEscalation {
  id: string
  title: string
  priority: TicketPriority
  /** Who it was escalated from and to, for example "Supervisor → you". */
  route: string
  breach: string
  escalatedAgo: string
  /** Text inside the timer pill. */
  ackDue: string
  currentOwner: string
  guest: string
  guestUpdate: string
}

export interface AcknowledgedEscalation {
  id: string
  title: string
  /** Second line under the title, for example "Table 4 · High". */
  detail: string
  level: string
  acknowledged: string
}

// Mock data only, taken from the Figma "Escalation Inbox" frame.
export const urgentEscalation: InboxEscalation = {
  id: '#1038',
  title: 'Wrong order delivered',
  priority: 'Critical',
  route: 'Supervisor → you',
  breach: 'Resolution SLA breached',
  escalatedAgo: '4 min ago',
  ackDue: 'Ack due in 06:00',
  currentOwner: 'Kavinda Perera (Supervisor)',
  guest: 'Shalini J. · Table 14 · waited 40 min',
  guestUpdate: 'Emailed only when the complaint is closed',
}

export const acknowledgedEscalations: AcknowledgedEscalation[] = [
  {
    id: '#1031',
    title: 'Foreign object in soup',
    detail: 'Table 4 · High',
    level: 'Staff → Supervisor',
    acknowledged: '12:22 · Kavinda P.',
  },
]

/** Escalation history of the urgent escalation, newest first. */
export const urgentHistory: TimelineEntry[] = [
  {
    id: 'h1',
    kind: 'escalated',
    title: 'Escalated to Branch Manager',
    time: '12:41 PM',
    actor: 'by SLA engine',
    description: 'Resolution SLA (30 min) breached at Supervisor level.',
  },
  {
    id: 'h2',
    kind: 'escalated',
    title: 'Escalated to Supervisor',
    time: '12:20 PM',
    actor: 'by SLA engine',
    description: 'Acknowledgement SLA (5 min) breached.',
  },
  {
    id: 'h3',
    kind: 'assigned',
    title: 'Assigned to Dinesh Kumara',
    time: '12:14 PM',
    actor: 'by AI routing',
    description: 'Critical · auto-escalation rule active.',
  },
]

export const inboxChips = [
  { key: 'needs', label: 'Needs acknowledgement' },
  { key: 'acknowledged', label: 'Acknowledged' },
  { key: 'history', label: 'History' },
] as const

export type InboxChip = (typeof inboxChips)[number]['key']

/** Number of past escalations shown on the History chip. */
export const historyCount = 42

/** Shown in the acknowledged table once the urgent escalation is acknowledged (simulated). */
export const acknowledgedBy = { time: '12:45', name: 'Ayesha P.' }
