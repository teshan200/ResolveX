import { Clock, ShieldCheck, Star, Ticket } from 'lucide-react'
import type { EscalationKpi } from '../escalation/components/EscalationKpiCards'

// Sample data for the branch manager "Branch analytics" tab, taken from the Figma frame.
// No backend is connected.
export const branchKpis: EscalationKpi[] = [
  { label: 'Total tickets', value: '214', icon: Ticket, tone: 'info', delta: '—', note: '18 open · 196 resolved' },
  { label: 'SLA compliance', value: '93.0%', icon: ShieldCheck, tone: 'success', delta: '+1.8 pts', note: '15 breached of 214' },
  { label: 'Avg. resolution time', value: '27 min', icon: Clock, tone: 'success', delta: '−4 min', note: 'vs 31 min prior 30 days' },
  { label: 'Avg. feedback rating', value: '4.2 / 5', icon: Star, tone: 'success', delta: '+0.2', note: 'from 127 surveys' },
]

export const timeRange = 'Last 30 days · 20 Sep – 19 Oct'

export const weeklyTickets = [
  { label: '20–26 Sep', value: 48 },
  { label: '27 Sep–3 Oct', value: 56 },
  { label: '4–10 Oct', value: 51 },
  { label: '11–17 Oct', value: 49 },
  { label: '18–19 Oct', value: 10, partial: true },
]

export type BarTone = 'brand' | 'brand-soft' | 'warning' | 'danger' | 'success'

export interface BarRowData {
  label: string
  /** Text at the right of the bar, for example "196 · 91.6%". */
  display: string
  /** Bar fill as a share of the track, 0 to 100. */
  percent: number
  tone: BarTone
}

export const resolution: BarRowData[] = [
  { label: 'Resolved', display: '196 · 91.6%', percent: 91.6, tone: 'brand' },
  { label: 'Open', display: '18 · 8.4%', percent: 8.4, tone: 'warning' },
]
export const sla: BarRowData[] = [
  { label: 'SLA met', display: '199 · 93.0%', percent: 93, tone: 'success' },
  { label: 'SLA breached', display: '15 · 7.0%', percent: 7, tone: 'danger' },
]

/** Bars whose length is the value relative to the largest value in the list. */
const relative = (rows: { label: string; value: number; display?: string; tone?: BarTone }[]): BarRowData[] => {
  const max = Math.max(...rows.map((r) => r.value))
  return rows.map((r) => ({
    label: r.label,
    display: r.display ?? String(r.value),
    percent: (r.value / max) * 100,
    tone: r.tone ?? 'brand',
  }))
}

export const priorities = relative([
  { label: 'Critical', value: 12, display: '12 · 5.6%', tone: 'danger' },
  { label: 'High', value: 48, display: '48 · 22.4%', tone: 'warning' },
  { label: 'Medium', value: 94, display: '94 · 43.9%', tone: 'brand' },
  { label: 'Normal', value: 60, display: '60 · 28.0%', tone: 'brand-soft' },
])

export const ratings = relative([
  { label: '5 stars', value: 62 },
  { label: '4 stars', value: 41 },
  { label: '3 stars', value: 14 },
  { label: '2 stars', value: 6 },
  { label: '1 star', value: 4 },
])

export const employees = relative([
  { label: 'Dinesh K.', value: 46 },
  { label: 'Kavinda P.', value: 38 },
  { label: 'Ravi S.', value: 35 },
  { label: 'Nimal P.', value: 29 },
  { label: 'Namal S.', value: 24 },
  { label: 'Amali W.', value: 22 },
  { label: 'Others (5)', value: 20 },
])

export const reportSections = [
  'KPI summary',
  'Tickets over time',
  'Open vs resolved & SLA',
  'Complaints by priority',
  'Feedback ratings',
  'Ticket distribution by employee',
] as const
