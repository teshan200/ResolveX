import { useState } from 'react'
import { Calendar, Download } from 'lucide-react'
import { Button } from '../components/ui'
import { EscalationKpiCards } from '../features/escalation/components/EscalationKpiCards'
import { downloadCsv, exportFilename, reportToCsv } from '../features/export/csv'
import type { ExportSection } from '../features/export/csv'
import { BarRow, ChartPanel, TicketsOverTime } from '../features/branch-analytics/Charts'
import { ExportOptionsModal, ExportReadyModal } from '../features/branch-analytics/ExportModals'
import type { ExportFormat } from '../features/branch-analytics/ExportModals'
import {
  branchKpis,
  employees,
  priorities,
  ratings,
  reportSections,
  resolution,
  sla,
  timeRange,
  weeklyTickets,
} from '../features/branch-analytics/mocks'

const bars = (rows: { label: string; display: string }[]) => rows.map((r) => [r.label, r.display])

/** Data for each section of the CSV export, built from the same sample data the charts show. */
const sectionData: Record<string, ExportSection> = {
  'KPI summary': {
    title: 'KPI summary',
    columns: ['Metric', 'Value', 'Change', 'Note'],
    rows: branchKpis.map((k) => [k.label, String(k.value), k.delta, k.note]),
  },
  'Tickets over time': {
    title: 'Tickets over time',
    columns: ['Week', 'Tickets'],
    rows: weeklyTickets.map((w) => [w.label, w.value]),
  },
  'Open vs resolved & SLA': {
    title: 'Open vs resolved & SLA',
    columns: ['Measure', 'Count · share'],
    rows: bars([...resolution, ...sla]),
  },
  'Complaints by priority': {
    title: 'Complaints by priority',
    columns: ['Priority', 'Count · share'],
    rows: bars(priorities),
  },
  'Feedback ratings': { title: 'Feedback ratings', columns: ['Rating', 'Responses'], rows: bars(ratings) },
  'Ticket distribution by employee': {
    title: 'Ticket distribution by employee',
    columns: ['Employee', 'Assigned tickets'],
    rows: bars(employees),
  },
}

/** Branch manager "Branch analytics" tab (Figma node 880:8778). Sample data only. */
export function BranchAnalyticsPage() {
  const [step, setStep] = useState<'closed' | 'options' | 'ready'>('closed')
  const [format, setFormat] = useState<ExportFormat>('PDF')
  const [included, setIncluded] = useState<string[]>([...reportSections])
  // The sections that were chosen when the report was exported, in page order.
  const exported = reportSections.filter((s) => included.includes(s))

  const toggle = (section: string) =>
    setIncluded((cur) => (cur.includes(section) ? cur.filter((s) => s !== section) : [...cur, section]))

  const download = () => {
    // PDF is simulated (see the note in the dialog). CSV downloads a real file.
    if (format === 'CSV') {
      downloadCsv(
        exportFilename('Colombo Branch report'),
        reportToCsv({
          title: 'Colombo Branch report',
          meta: [['Period', timeRange]],
          sections: exported.map((s) => sectionData[s]),
        }),
      )
    }
    setStep('closed')
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Branch analytics</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Colombo Branch only · complaints, SLA, feedback and workload for this branch.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" className="font-semibold!">
            <Calendar size={18} aria-hidden />
            {timeRange}
          </Button>
          <Button className="font-semibold!" onClick={() => setStep('options')}>
            <Download size={18} aria-hidden />
            Export Report
          </Button>
        </div>
      </header>

      <EscalationKpiCards items={branchKpis} />

      <div className="flex items-stretch gap-4">
        <ChartPanel title="Tickets over time" subtitle="Colombo Branch · 214 tickets" className="flex-1">
          <TicketsOverTime />
        </ChartPanel>
        <ChartPanel title="Open vs resolved & SLA" subtitle="Last 30 days · 214 tickets" className="w-[360px] shrink-0">
          {resolution.map((r) => (
            <BarRow key={r.label} row={r} />
          ))}
          <div className="h-px w-full bg-line-subtle" />
          {sla.map((r) => (
            <BarRow key={r.label} row={r} />
          ))}
        </ChartPanel>
      </div>

      <div className="flex items-start gap-4">
        <ChartPanel title="Complaints by priority" subtitle="Last 30 days · 214 tickets" className="flex-1">
          {priorities.map((r) => (
            <BarRow key={r.label} row={r} />
          ))}
        </ChartPanel>
        <ChartPanel
          title="Feedback ratings"
          subtitle="Post-resolution surveys · 127 responses · avg 4.2"
          className="flex-1"
        >
          {ratings.map((r) => (
            <BarRow key={r.label} row={r} />
          ))}
        </ChartPanel>
        <ChartPanel title="Ticket distribution by employee" subtitle="Assigned tickets · last 30 days" className="flex-1">
          {employees.map((r) => (
            <BarRow key={r.label} row={r} />
          ))}
        </ChartPanel>
      </div>

      <ExportOptionsModal
        open={step === 'options'}
        format={format}
        included={included}
        onFormat={setFormat}
        onToggle={toggle}
        onCancel={() => setStep('closed')}
        onExport={() => setStep('ready')}
      />
      <ExportReadyModal
        open={step === 'ready'}
        format={format}
        sections={exported}
        onClose={() => setStep('closed')}
        onDownload={download}
      />
    </div>
  )
}
