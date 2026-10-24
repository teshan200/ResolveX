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
  /** True while the SLA clock is paused (for example, awaiting the customer). */
  paused?: boolean
}

export interface SlaSummary {
  total: number
  onTrack: number
  warning: number
  breached: number
  paused: number
}

export type SlaTimelineKind =
  | 'opened'
  | 'assigned'
  | 'claimed'
  | 'warning'
  | 'breached'
  | 'escalated'
  | 'paused'
  | 'reopened'

export interface SlaTimelineEvent {
  id: string
  complaintId: string
  /** ISO timestamp. */
  at: string
  kind: SlaTimelineKind
  title: string
  actor: string
  note?: string
}

/** A manual or rule-driven change recorded for audit purposes. */
export interface SlaAuditEntry {
  id: string
  complaintId: string
  /** ISO timestamp. */
  at: string
  actor: string
  action: string
  detail?: string
}
