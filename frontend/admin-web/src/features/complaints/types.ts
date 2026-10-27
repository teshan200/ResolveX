import type { TicketPriority, TicketStatus } from '../../components/ui/StatusBadge'

export type ComplaintPeriod = 'Today' | 'Last 7 days' | 'Last 30 days'

export interface ComplaintAssignee {
  name: string
  initials: string
}

export interface ComplaintRow {
  /** e.g. "#1038". */
  id: string
  subject: string
  /** e.g. "Table 14 · Dine-in". */
  servicePoint: string
  /** Short branch name, e.g. "Colombo". */
  branch: string
  priority: TicketPriority
  status: TicketStatus
  /** Null while nobody has been assigned ("Not assigned yet"). */
  assignee: ComplaintAssignee | null
  /** Shown in the Created column, e.g. "19 Oct, 12:14". */
  created: string
  /** Shown in the Last updated column, e.g. "4 min ago". */
  updated: string
  /** How long ago it was created and last updated, in minutes. Used to filter by period and to sort. */
  createdAgo: number
  updatedAgo: number
}
