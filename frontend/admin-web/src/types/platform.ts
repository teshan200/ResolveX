import type { KpiTrend, PillTone, TagTone } from '../components/ui'

export interface PlatformKpi {
  id: string
  label: string
  value: string
  delta: string
  trend: KpiTrend
  caption: string
}

export interface PlanSlice {
  label: string
  // The percentage shown in the legend.
  percent: number
  // The share of the ring the slice is drawn with.
  arcShare: number
  color: string
}

export interface AttentionItem {
  id: string
  companyId: string
  title: string
  detail: string
  tone: 'danger' | 'warning'
}

export interface PlatformOverview {
  kpis: PlatformKpi[]
  // Two series scaled 0–1, drawn over the last 30 days.
  ticketsProcessed: number[]
  ticketsBreached: number[]
  tenantsByPlan: PlanSlice[]
  attention: AttentionItem[]
}

export type SubscriptionEventType =
  | 'Renewals'
  | 'Upgrades'
  | 'Downgrades'
  | 'Failed payments'
  | 'Cancellations'
  | 'Trials'

export interface SubscriptionEvent {
  id: string
  company: string
  event: string
  type: SubscriptionEventType
  plan: string
  amount: string
  statusLabel: string
  statusTone: PillTone
  when: string
  failed?: boolean
}

export interface SubscriptionsData {
  kpis: PlatformKpi[]
  events: SubscriptionEvent[]
}

export interface AdminPlan {
  id: string
  name: string
  headline: string
  caption: string
}

export type AuditCategory = 'Tenants' | 'Subscriptions' | 'Impersonation' | 'Plans' | 'Admin users'

export interface AuditEvent {
  id: string
  time: string
  actorInitials: string
  actorName: string
  action: string
  detail: string
  category: AuditCategory
  categoryTone: TagTone
  target: string
}

export interface AuditLogData {
  events: AuditEvent[]
  total: number
  pageCount: number
}
