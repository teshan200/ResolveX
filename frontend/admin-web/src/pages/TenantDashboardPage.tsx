import { useState } from 'react'
import { ChevronRight, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, PriorityBadge, SlaTimer } from '../components/ui'
import { cn } from '../components/ui/cn'
import { BranchBars } from '../features/analytics/components/BranchBars'
import { CategoryDonut } from '../features/analytics/components/CategoryDonut'
import { ChartCard } from '../features/analytics/components/ChartCard'
import { TrendLineChart } from '../features/analytics/components/TrendLineChart'
import { EscalationKpiCards } from '../features/escalation/components/EscalationKpiCards'
import { downloadCsv, exportFilename, reportToCsv } from '../features/export/csv'
import {
  atRiskTickets,
  branchPerformance,
  dashboardBranchBars,
  dashboardBranchLabels,
  dashboardCategories,
  dashboardKpis,
  dashboardPeriods,
  dashboardTrendBreaches,
  dashboardTrendComplaints,
} from '../features/tenant-admin/mocks'
import type { BranchPerformance, DashboardPeriod } from '../features/tenant-admin/mocks'

const breachTone: Record<BranchPerformance['breachTone'], string> = {
  success: 'text-success-fg',
  warning: 'text-warning-fg',
  danger: 'text-danger-fg',
}

const head =
  'flex h-10 items-center gap-1 border-b border-line bg-canvas px-4 text-xs leading-4 font-semibold whitespace-nowrap text-content-secondary'
const cell = 'flex h-14 items-center gap-2 overflow-hidden px-4'

/** Tenant admin "Dashboard" tab (Figma node 38:25). Sample data only, the same figures for every period. */
export function TenantDashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>('7 days')

  const exportCsv = () =>
    downloadCsv(
      exportFilename('Dashboard'),
      reportToCsv({
        title: 'Spice Garden Holdings dashboard',
        meta: [
          ['Period', period],
          ['Exported', new Date().toLocaleString('en-GB')],
        ],
        sections: [
          {
            title: 'Summary',
            columns: ['Measure', 'Value', 'Change', 'Note'],
            rows: dashboardKpis.map((k) => [k.label, k.value, k.delta, k.note]),
          },
          {
            title: 'Branch performance',
            columns: ['Branch', 'Region and manager', 'Open', 'Avg. resolution', 'SLA breach rate', 'Post-resolution CSAT'],
            rows: branchPerformance.map((b) => [b.name, b.meta, b.open, b.resolution, b.breachRate, b.csat]),
          },
        ],
      }),
    )

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Good morning, Marcus</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Here’s how your 32 branches are handling guest complaints today.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div role="group" aria-label="Period" className="flex gap-1 rounded-md bg-muted p-1">
            {dashboardPeriods.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={p === period}
                onClick={() => setPeriod(p)}
                className={cn(
                  'flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-[13px] leading-4.5 font-medium whitespace-nowrap',
                  p === period
                    ? 'bg-surface text-content shadow-[0_1px_1px_rgba(11,19,18,0.04),0_1px_1.5px_rgba(11,19,18,0.08)]'
                    : 'text-content-secondary hover:text-content',
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" className="font-semibold!" onClick={exportCsv}>
            <Download size={18} aria-hidden />
            Export
          </Button>
        </div>
      </header>

      <EscalationKpiCards items={dashboardKpis} />

      <div className="flex items-start gap-4">
        <ChartCard title="Complaints vs SLA breaches" subtitle="Daily · last 7 days" className="min-w-0 flex-1">
          <TrendLineChart complaints={dashboardTrendComplaints} breaches={dashboardTrendBreaches} />
        </ChartCard>
        <ChartCard title="By category" subtitle="Last 30 days" className="w-[420px] shrink-0">
          <CategoryDonut slices={dashboardCategories} />
        </ChartCard>
      </div>

      <div className="flex items-start gap-4">
        <ChartCard title="Complaints by branch" subtitle="Top 6 · last 7 days" plotHeight={200} className="min-w-0 flex-1">
          <BranchBars heights={dashboardBranchBars} labels={dashboardBranchLabels} />
        </ChartCard>

        <section aria-label="SLA at risk" className="flex w-[520px] shrink-0 flex-col overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-base leading-6 font-semibold">SLA at risk</h2>
              <p className="text-xs leading-4 text-content-tertiary">Breaching in the next 15 min</p>
            </div>
            <Link
              to="/tenant/complaints"
              className="flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] leading-4.5 font-medium text-content-secondary hover:bg-muted"
            >
              View all
              <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
          {atRiskTickets.map((t) => {
            const body = (
              <>
                <p className="font-mono text-[13px] leading-4.5 font-medium">{t.id}</p>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-5 font-medium">{t.title}</p>
                  <p className="truncate text-xs leading-4 text-content-tertiary">{t.place}</p>
                </div>
                <PriorityBadge priority={t.priority} />
                <SlaTimer state={t.slaState} label={t.sla} />
              </>
            )
            const cls = 'flex items-center gap-3 border-b border-line-subtle px-5 py-3 last:border-b-0'
            // Only #1042 has a complaint detail screen in the designs.
            return t.id === '#1042' ? (
              <Link key={t.id} to={`/tenant/complaints/${t.id.slice(1)}`} className={cn(cls, 'transition-colors hover:bg-canvas')}>
                {body}
              </Link>
            ) : (
              <div key={t.id} className={cls}>
                {body}
              </div>
            )
          })}
        </section>
      </div>

      <section aria-label="Branch performance" className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-base leading-6 font-semibold">Branch performance</h2>
            <p className="text-xs leading-4 text-content-tertiary">Last 7 days</p>
          </div>
          <Link
            to="/tenant/analytics"
            className="flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] leading-4.5 font-medium text-content-secondary hover:bg-muted"
          >
            Open analytics
            <ChevronRight size={16} aria-hidden />
          </Link>
        </div>
        <div role="table" aria-label="Branch performance">
          <div role="row" className="flex w-full">
            <div role="columnheader" className={cn(head, 'min-w-0 flex-1')}>Branch</div>
            <div role="columnheader" className={cn(head, 'w-[100px] shrink-0')}>Open</div>
            <div role="columnheader" className={cn(head, 'w-[160px] shrink-0')}>Avg. resolution</div>
            <div role="columnheader" className={cn(head, 'w-[200px] shrink-0')}>SLA breach rate</div>
            <div role="columnheader" className={cn(head, 'w-[160px] shrink-0')}>Post-resolution CSAT</div>
            <div role="columnheader" className={cn(head, 'w-16 shrink-0')} />
          </div>
          {branchPerformance.map((b) => (
            <div key={b.name} role="row" className="flex w-full border-b border-line-subtle bg-surface last:border-b-0">
              <div className={cn(cell, 'min-w-0 flex-1')}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-5 font-medium">{b.name}</p>
                  <p className="truncate text-xs leading-4 text-content-tertiary">{b.meta}</p>
                </div>
              </div>
              <div className={cn(cell, 'w-[100px] shrink-0')}>
                <p className="text-sm leading-5">{b.open}</p>
              </div>
              <div className={cn(cell, 'w-[160px] shrink-0')}>
                <p className="text-sm leading-5">{b.resolution}</p>
              </div>
              <div className={cn(cell, 'w-[200px] shrink-0')}>
                <p className={cn('text-sm leading-5 font-medium', breachTone[b.breachTone])}>{b.breachRate}</p>
              </div>
              <div className={cn(cell, 'w-[160px] shrink-0')}>
                <p className="text-sm leading-5">{b.csat}</p>
              </div>
              <div className={cn(cell, 'w-16 shrink-0 justify-end')}>
                <Link
                  to="/tenant/branches"
                  aria-label={`Open ${b.name}`}
                  className="flex size-8 items-center justify-center rounded-md text-content-tertiary hover:bg-muted"
                >
                  <ChevronRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
