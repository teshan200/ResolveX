export type ApprovalSla = 'Met' | 'Breached'

/** Where a resolution stands: waiting for the branch manager, or already decided. */
export type ApprovalStatus = 'waiting' | 'approved' | 'reopened'

export interface ResolutionApproval {
  /** Ticket number, for example "#1042". */
  id: string
  title: string
  /** Second line under the title, for example "Table 7" or "Online". */
  location: string
  resolvedBy: string
  note: string
  /** Time taken to resolve, for example "24 min". */
  time: string
  sla: ApprovalSla
  status: ApprovalStatus
  /** Post-resolution survey answer. Missing when the guest has not submitted one. */
  survey?: { rating: number; comment: string }
}
