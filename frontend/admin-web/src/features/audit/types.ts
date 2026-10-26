export type AuditCategory =
  | 'Authentication'
  | 'Branches & staff'
  | 'Subscription'
  | 'Tickets'
  | 'Escalations'
  | 'Cases'
  | 'AI overrides'
  | 'Admin'

export interface AuditEvent {
  id: string
  /** e.g. "19 Oct · 15:58:12" */
  time: string
  actorName: string
  actorInitials: string
  action: string
  detail: string
  category: AuditCategory
  /** The record the action was done to, e.g. "BR-MATARA" or "#1042". */
  target: string
  /** Where it came from: an IP and browser, "Mobile app", "SLA engine" or "Billing". */
  source: string
}
