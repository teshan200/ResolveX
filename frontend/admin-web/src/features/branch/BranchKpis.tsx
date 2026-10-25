import { Smile, Ticket, Timer, CircleArrowUp } from 'lucide-react'
import { EscalationKpiCards } from '../escalation/components/EscalationKpiCards'
import type { EscalationKpi } from '../escalation/components/EscalationKpiCards'

const kpis: EscalationKpi[] = [
  { label: 'Open now', value: 9, icon: Ticket, tone: 'info', delta: '0.0%', note: '4 claimed · 5 in progress' },
  { label: 'At SLA risk', value: 3, icon: Timer, tone: 'danger', delta: '8.1%', note: 'breaching within 15 min' },
  { label: 'Escalated to you', value: 2, icon: CircleArrowUp, tone: 'danger', delta: '8.1%', note: '1 awaiting acknowledgement' },
  { label: 'Post-resolution CSAT today', value: '4.6', icon: Smile, tone: 'success', delta: '12.4%', note: 'from 11 surveys' },
]

/** KPI row from the Figma "Branch overview" frame. */
export function BranchKpis() {
  return <EscalationKpiCards items={kpis} />
}
