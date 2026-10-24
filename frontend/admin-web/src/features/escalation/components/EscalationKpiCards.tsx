import { Minus, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../../components/ui/cn'

export interface EscalationKpi {
  label: string
  value: number
  icon: LucideIcon
  /** Delta pill: danger shows a falling trend, info shows a flat one. */
  tone: 'danger' | 'info'
  delta: string
  note: string
}

const tones = {
  danger: { pill: 'bg-danger-bg text-danger-fg', icon: TrendingDown },
  info: { pill: 'bg-info-bg text-info-fg', icon: Minus },
}

/** KPI card from the Figma "Escalated to me" frame. */
function KpiCard({ kpi }: { kpi: EscalationKpi }) {
  const Icon = kpi.icon
  const tone = tones[kpi.tone]
  const DeltaIcon = tone.icon
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-lg border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] leading-4.5 font-medium whitespace-nowrap text-content-secondary">
          {kpi.label}
        </p>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-subtle text-content-brand">
          <Icon size={16} aria-hidden />
        </span>
      </div>
      <p className="text-[30px] leading-[38px] font-semibold tracking-[-0.3px]">{kpi.value}</p>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex items-center gap-0.5 rounded-full px-1.5 text-xs leading-4 font-semibold whitespace-nowrap',
            tone.pill,
          )}
        >
          <DeltaIcon size={12} aria-hidden />
          {kpi.delta}
        </span>
        <p className="text-xs leading-4 whitespace-nowrap text-content-tertiary">{kpi.note}</p>
      </div>
    </div>
  )
}

export function EscalationKpiCards({ items }: { items: EscalationKpi[] }) {
  return (
    <div className="flex gap-4">
      {items.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  )
}
