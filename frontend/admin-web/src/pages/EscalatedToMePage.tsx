import { useState } from 'react'
import { CircleCheck, Sparkles, TriangleAlert } from 'lucide-react'
import { EscalationCard } from '../features/escalation/components/EscalationCard'
import { EscalationEmptyState } from '../features/escalation/components/EscalationEmptyState'
import { EscalationFilterBar } from '../features/escalation/components/EscalationFilterBar'
import { EscalationKpiCards } from '../features/escalation/components/EscalationKpiCards'
import type { EscalationKpi } from '../features/escalation/components/EscalationKpiCards'
import { EscalationStatusChips } from '../features/escalation/components/EscalationStatusChips'
import {
  applyFilters,
  chipCounts,
  defaultFilters,
  escalatedChips,
  formatSpan,
  matchesChip,
} from '../features/escalation/escalations'
import { escalations } from '../features/escalation/mocks'
import type { EscalationChip, EscalationFilters } from '../features/escalation/types'

// Oldest unacknowledged escalation across all branches, shown under the first KPI.
const oldestAwaiting = Math.max(
  0,
  ...escalations.filter((e) => e.state === 'awaiting').map((e) => e.minutesSince),
)
const managerCount = new Set(escalations.map((e) => e.manager)).size

export function EscalatedToMePage() {
  const [filters, setFilters] = useState<EscalationFilters>(defaultFilters)
  const [chip, setChip] = useState<EscalationChip>('awaiting')

  const filtered = applyFilters(escalations, filters)
  const counts = chipCounts(filtered)
  const visible = filtered.filter((e) => matchesChip(e, chip))

  const kpis: EscalationKpi[] = [
    {
      label: 'Awaiting your acknowledgement',
      value: counts.awaiting,
      icon: TriangleAlert,
      tone: 'danger',
      delta: '8.1%',
      note: `oldest ${formatSpan(oldestAwaiting)}`,
    },
    {
      label: 'Acknowledged · still open',
      value: counts.acknowledged,
      icon: CircleCheck,
      tone: 'info',
      delta: '0.0%',
      note: 'in progress at branches',
    },
    {
      label: 'AI escalations this month',
      value: filtered.length,
      icon: Sparkles,
      tone: 'info',
      delta: '0.0%',
      note: `against ${managerCount} Branch Managers`,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Escalated to me</h1>
        <p className="text-sm leading-5 text-content-secondary">
          Complaints against a Branch Manager that ResolveX AI escalated to you automatically. All
          other complaints stay with branches.
        </p>
      </header>

      <EscalationKpiCards items={kpis} />
      <EscalationFilterBar filters={filters} onChange={setFilters} />
      <EscalationStatusChips
        label="Escalation status"
        chips={escalatedChips}
        selected={chip}
        counts={counts}
        onSelect={setChip}
      />

      {visible.length > 0 ? (
        <div className="flex flex-col gap-3">
          {visible.map((e) => (
            <EscalationCard key={e.id} escalation={e} />
          ))}
        </div>
      ) : (
        <EscalationEmptyState
          branch={filters.branch === 'All branches' ? null : filters.branch}
          days={filters.days}
        />
      )}
    </div>
  )
}
