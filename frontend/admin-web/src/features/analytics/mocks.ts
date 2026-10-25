import { Clock, Inbox, Timer, TriangleAlert, Zap } from 'lucide-react'
import type { EscalationKpi } from '../escalation/components/EscalationKpiCards'

// Mock data only, taken from the Figma "Analytics" frame. No backend is connected.
export const analyticsKpis: EscalationKpi[] = [
  {
    label: 'Total complaints',
    value: '1,684',
    icon: Inbox,
    tone: 'info',
    delta: '0.0%',
    note: '+4% vs prior period',
  },
  {
    label: 'Avg. response',
    value: '6 min',
    icon: Timer,
    tone: 'success',
    delta: '12.4%',
    note: '−2 min',
  },
  {
    label: 'Avg. resolution',
    value: '24 min',
    icon: Clock,
    tone: 'success',
    delta: '12.4%',
    note: '−7 min',
  },
  {
    label: 'SLA violation rate',
    value: '4.2%',
    icon: TriangleAlert,
    tone: 'success',
    delta: '12.4%',
    note: '−2.6 pts',
  },
  {
    label: 'Critical rate',
    value: '3.1%',
    icon: Zap,
    tone: 'danger',
    delta: '8.1%',
    note: '+0.4 pts',
  },
]

export interface AnalyticsFilters {
  period: string
  branch: string
  category: string
  priority: string
}

export const periodOptions = [
  'Last 7 days · 12 Oct – 18 Oct',
  'Last 30 days · 19 Sep – 18 Oct',
  'Last 90 days · 20 Jul – 18 Oct',
]
export const branchOptions = ['All branches', 'Colombo Branch', 'Kandy Branch', 'Galle Fort', 'Negombo Beach']
export const categoryOptions = ['All categories', 'Service', 'Food quality', 'Cleanliness']
export const priorityOptions = ['All priorities', 'Critical', 'High', 'Medium', 'Normal']

export const defaultAnalyticsFilters: AnalyticsFilters = {
  period: periodOptions[1],
  branch: branchOptions[0],
  category: categoryOptions[0],
  priority: priorityOptions[0],
}

// Chart data. The points are read off the Figma plots, which are illustrative.
// Coordinates are in the 380 x 180 plot area, y measured from the top.
export const trendComplaints = [139, 119, 127, 89, 98, 59, 69, 39]
export const trendBreaches = [149, 145, 140, 131, 127, 118, 119, 108]

export const categorySlices = [
  { label: 'Food quality', percent: 38, color: 'var(--color-brand)' },
  { label: 'Wait time', percent: 24, color: 'var(--color-warning-solid)' },
  { label: 'Service', percent: 18, color: 'var(--color-info-solid)' },
  { label: 'Other', percent: 20, color: 'var(--color-neutral-400)' },
]

/** Bar heights in pixels, highest first (Complaints per 1,000 covers, six branches). */
export const branchBars = [127.5, 93, 72, 60, 45, 33]

export const recoveryMetrics = [
  { label: 'Follow-up completion', display: '91%', percent: 91, tone: 'success' },
  { label: 'Post-resolution CSAT', display: '4.4 / 5', percent: 88, tone: 'brand' },
  { label: 'Guests returning within 60 days', display: '63%', percent: 63, tone: 'brand' },
  { label: 'Repeat complaints', display: '7%', percent: 7, tone: 'warning' },
] as const

export interface StaffPerformance {
  name: string
  /** Branch and designation, for example "Colombo · Waiter / Waitress". */
  role: string
  tickets: number
  avgAck: string
  avgResolution: string
  /** Share of tickets resolved within SLA, 0 to 100. */
  slaMet: number
  csat: string
}

export const staffPerformance: StaffPerformance[] = [
  {
    name: 'Dinesh Kumara',
    role: 'Colombo · Waiter / Waitress',
    tickets: 48,
    avgAck: '4 min',
    avgResolution: '19 min',
    slaMet: 97,
    csat: '4.7',
  },
  {
    name: 'Nadeesha Jay',
    role: 'Colombo · Bar',
    tickets: 31,
    avgAck: '5 min',
    avgResolution: '22 min',
    slaMet: 94,
    csat: '4.5',
  },
  {
    name: 'Ruwan Silva',
    role: 'Galle · Waiter / Waitress',
    tickets: 44,
    avgAck: '14 min',
    avgResolution: '51 min',
    slaMet: 78,
    csat: '3.6',
  },
]
