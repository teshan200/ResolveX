import type { TicketPriority, TicketStatus } from '../../components/ui'

export type SlaStatus = 'On Track' | 'Warning' | 'Breached' | 'Paused'

export interface SlaComplaint {
  id: string
  title: string
  customer: string
  branch: string
  category: string
  priority: TicketPriority
  ticketStatus: TicketStatus
  assignee: string | null
  /** ISO timestamp when the complaint was created and the SLA clock started. */
  openedAt: string
  /** ISO timestamp by which the complaint must be resolved. */
  dueAt: string
  slaStatus: SlaStatus
}

export interface SlaSummary {
  total: number
  onTrack: number
  warning: number
  breached: number
  paused: number
}
