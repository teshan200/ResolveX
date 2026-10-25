import { CircleCheck, Timer, TriangleAlert, Users } from 'lucide-react'
import { EscalationKpiCards } from '../escalation/components/EscalationKpiCards'
import type { EscalationKpi } from '../escalation/components/EscalationKpiCards'

const kpis: EscalationKpi[] = [
  { label: 'On shift', value: '12 of 38', icon: Users, tone: 'info', delta: '0.0%', note: '3 on break' },
  { label: 'Overloaded', value: 2, icon: TriangleAlert, tone: 'danger', delta: '8.1%', note: '5+ open tickets' },
  { label: 'Avg. acknowledgement', value: '5 min', icon: Timer, tone: 'success', delta: '12.4%', note: 'target 15 min' },
  { label: 'SLA met (team)', value: '93%', icon: CircleCheck, tone: 'success', delta: '12.4%', note: 'last 7 days' },
]

/** KPI row from the Figma "Staff & workload" frame. */
export function StaffKpis() {
  return <EscalationKpiCards items={kpis} />
}
