import type { TicketStatus } from '../../components/ui'

/** Decides the icon and colour of a timeline event. */
export type TimelineEventKind = 'received' | 'assigned' | 'in-progress' | 'resolved'

export interface TimelineEvent {
  kind: TimelineEventKind
  title: string
  /** ISO timestamp of the event. */
  at: string
  /** Branch the event happened at. */
  location: string
  message: string
}

export interface CaseDetail {
  caseId: string
  status: TicketStatus
  /** ISO timestamp of when the feedback was submitted. */
  submittedAt: string
  branch: string
  table: string | null
  /** Complaint categories, shown as one tag. */
  categories: string[]
  /** Order reference, when the complaint relates to an order. */
  orderRef: string | null
  expected: {
    label: string
    /** Percentage of the expected resolution time that has passed. */
    progress: number
    note: string
  }
  /** True once the branch has resolved the issue, which is when the guest may confirm it. */
  branchResolved: boolean
  /** Oldest event first. */
  timeline: TimelineEvent[]
  /** How recently the timeline changed, for example "Updated 2 min ago". */
  updatedLabel: string
}
