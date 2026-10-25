import { Banknote, Building2, ChevronRight, CreditCard, Flag, Mail, Timer, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KpiCard, PageHeader, Panel } from '../components/ui'
import { ChartCard } from '../features/platform/ChartCard'
import { TenantsDonut } from '../features/platform/TenantsDonut'
import { TicketsLineChart } from '../features/platform/TicketsLineChart'
import { getPlatformOverview } from '../services/platformService'
import type { AttentionItem, PlatformOverview } from '../types/platform'

const kpiIcons: Record<string, LucideIcon> = {
  tenants: Building2,
  revenue: Banknote,
  trials: Timer,
  pastDue: TriangleAlert,
}

const attentionStyles: Record<AttentionItem['tone'], { row: string; icon: LucideIcon; color: string }> = {
  danger: { row: 'bg-danger-bg', icon: CreditCard, color: 'text-danger-fg' },
  warning: { row: 'bg-warning-bg', icon: Mail, color: 'text-warning-fg' },
}

export function PlatformOverviewPage() {
  const [overview, setOverview] = useState<PlatformOverview | null>(null)

  useEffect(() => {
    getPlatformOverview().then(setOverview)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Platform overview"
        description="All ResolveX tenants and subscriptions."
      />

      {!overview ? (
        <p className="text-sm leading-5 text-content-secondary">Loading overview…</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            {overview.kpis.map((kpi) => (
              <KpiCard
                key={kpi.id}
                label={kpi.label}
                value={kpi.value}
                icon={kpiIcons[kpi.id]}
                delta={kpi.delta}
                trend={kpi.trend}
                caption={kpi.caption}
              />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
            <ChartCard title="Tickets processed platform-wide" subtitle="Last 30 days">
              <TicketsLineChart
                processed={overview.ticketsProcessed}
                breached={overview.ticketsBreached}
              />
            </ChartCard>
            <ChartCard title="Tenants by plan" subtitle="Last 30 days">
              <TenantsDonut slices={overview.tenantsByPlan} />
            </ChartCard>
          </div>

          <Panel title="Needs attention" icon={Flag}>
            {overview.attention.map((item) => {
              const { row, icon: Icon, color } = attentionStyles[item.tone]
              return (
                <Link
                  key={item.id}
                  to={`/super-admin/companies/${item.companyId}`}
                  className={`flex items-center gap-3 rounded-lg p-3 ${row}`}
                >
                  <Icon size={18} className={`shrink-0 ${color}`} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[13px] leading-4.5 font-semibold">{item.title}</span>
                    <span className="text-xs leading-4 text-content-secondary">{item.detail}</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-content-tertiary" />
                </Link>
              )
            })}
          </Panel>
        </>
      )}
    </div>
  )
}
