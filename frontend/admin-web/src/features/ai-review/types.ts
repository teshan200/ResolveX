import type { TicketPriority } from '../../components/ui'

/** A complaint the AI was not confident about. All values are mock suggestions, not a real model. */
export interface ReviewItem {
  /** Complaint number, for example "#1053". */
  id: string
  /** Where and when, for example "Table 11 · 4 min ago". */
  meta: string
  quote: string
  /** Sample confidence score, 0 to 100. */
  confidence: number
  category: string
  subCategory?: string
  priority: TicketPriority
}

export interface Employee {
  name: string
  initials: string
  level: number
  openTickets: number
}

/** The review panel's starting values for one item. */
export interface ReviewDraft {
  category: string
  subCategory: string
  priority: TicketPriority
  designation: string
  employee: string
}

export type ReviewChip = 'waiting' | 'reviewed' | 'overridden'

export interface AssignedSummary {
  id: string
  employee: string
  designation: string
  priority: TicketPriority
}
