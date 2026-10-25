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
