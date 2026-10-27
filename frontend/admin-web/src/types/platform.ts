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
  // Shown under each chart title, e.g. "This month · 1–26 Oct 2026".
  period: string
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

export type PeriodName = 'Last 7 days' | 'Last 30 days' | 'Last 90 days' | 'This month' | 'Last month'

export interface SubscriptionsData {
  // The four KPI cards change with the selected period.
  kpisByPeriod: Record<PeriodName, PlatformKpi[]>
  events: SubscriptionEvent[]
}

export interface AdminPlan {
  id: string
  name: string
  headline: string
  caption: string
}

export type AuditCategory = 'Activation' | 'Plan change' | 'Grace period' | 'Suspension'

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
