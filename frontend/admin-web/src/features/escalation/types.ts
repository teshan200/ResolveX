import type { TicketPriority, TicketStatus } from '../../components/ui'

/** Where an escalation stands with the person it was escalated to. */
export type EscalationState = 'awaiting' | 'acknowledged' | 'closed'

export interface Escalation {
  /** Complaint number, for example "#1055". */
  id: string
  title: string
  branch: string
  /** Branch Manager the complaint is about. */
  manager: string
  priority: TicketPriority
  ticketStatus: TicketStatus
  state: EscalationState
  /** Display date, for example "19 Oct, 12:41". */
  escalatedOn: string
  /** Whole days between the escalation and the mock "today". */
  escalatedDaysAgo: number
  /** Minutes since the escalation, shown as "3 h 41 m ago". */
  minutesSince: number
  /** Why the AI escalated it. Shown after "AI escalation reason:". */
  reason: string
}

export type EscalationChip = 'awaiting' | 'acknowledged' | 'all'

export interface EscalationFilters {
  search: string
  branch: string
  priority: string
  status: string
  /** Number of days back to include. */
  days: number
}
