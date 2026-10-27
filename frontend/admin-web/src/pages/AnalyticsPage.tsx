import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from '../components/ui'
import { AnalyticsFilterBar } from '../features/analytics/components/AnalyticsFilterBar'
import { BranchBars } from '../features/analytics/components/BranchBars'
import { CategoryDonut } from '../features/analytics/components/CategoryDonut'
import { ChartCard } from '../features/analytics/components/ChartCard'
import { TrendLineChart } from '../features/analytics/components/TrendLineChart'
import {
  analyticsKpis,
  branchBars,
  categorySlices,
  defaultAnalyticsFilters,
  trendBreaches,
  trendComplaints,
} from '../features/analytics/mocks'
import type { AnalyticsFilters } from '../features/analytics/mocks'
import { EscalationKpiCards } from '../features/escalation/components/EscalationKpiCards'
import { downloadCsv, exportFilename, reportToCsv } from '../features/export/csv'
import { analyticsReport } from '../features/export/reports'

export function AnalyticsPage() {
  // The Figma design shows one set of figures, so the filters do not change the numbers yet.
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultAnalyticsFilters)

  const exportCsv = () =>
    downloadCsv(exportFilename('Analytics'), reportToCsv(analyticsReport(filters)))
  // "Export PDF" opens the browser's print dialog; choose "Save as PDF" there.
  const exportPdf = () => window.print()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-64 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Analytics</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Complaints, SLA performance and branches — filter and export.
          </p>
        </div>
        <div className="flex gap-3 print:hidden">
          <Button variant="outline" className="font-semibold!" onClick={exportCsv}>
            <Download size={18} aria-hidden />
            Export CSV
          </Button>
          <Button className="font-semibold!" onClick={exportPdf}>
            <FileText size={18} aria-hidden />
            Export PDF
          </Button>
        </div>
      </header>

      <AnalyticsFilterBar filters={filters} onChange={setFilters} />
      <EscalationKpiCards items={analyticsKpis} gapClass="gap-3" />

      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <ChartCard title="Complaint trend vs SLA breaches" subtitle="Daily" className="w-full min-w-0 flex-1">
          <TrendLineChart complaints={trendComplaints} breaches={trendBreaches} />
        </ChartCard>
        <ChartCard title="Complaints by category" className="w-full shrink-0 lg:w-[420px]">
          <CategoryDonut slices={categorySlices} />
        </ChartCard>
      </div>

      <ChartCard title="Branch comparison" subtitle="Complaints per 1,000 covers" className="w-full">
        <BranchBars heights={branchBars} />
      </ChartCard>
    </div>
  )
}
