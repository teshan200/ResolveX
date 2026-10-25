import { useEffect, useState } from 'react'
import { downloadCsv, exportFilename, reportToCsv } from '../features/export/csv'
import type { ExportReport } from '../features/export/csv'
import { PrintableReport } from '../features/export/PrintableReport'
import { hasReportData, templateReport } from '../features/export/reports'
import type { ReportOptions } from '../features/export/reports'
import { GeneratePanel } from '../features/reports/components/GeneratePanel'
import { RecentExports } from '../features/reports/components/RecentExports'
import { TemplateGrid } from '../features/reports/components/TemplateGrid'
import { reportTemplates } from '../features/reports/mocks'
import type { ReportFormat } from '../features/reports/mocks'

export function ReportsPage() {
  const [selected, setSelected] = useState(reportTemplates[0].id)
  // The report being printed. While it is set, only the printable version appears on paper.
  const [printing, setPrinting] = useState<ExportReport | null>(null)
  const template = reportTemplates.find((t) => t.id === selected) ?? reportTemplates[0]

  useEffect(() => {
    if (!printing) return
    const clear = () => setPrinting(null)
    window.addEventListener('afterprint', clear)
    // Give the printable report a moment to render before the dialog opens.
    const timer = setTimeout(() => window.print(), 100)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('afterprint', clear)
    }
  }, [printing])

  const generate = (format: ReportFormat, options: ReportOptions) => {
    const report = templateReport(template.id, template.title, options)
    if (!report) return
    if (format === 'CSV') downloadCsv(exportFilename(template.title), reportToCsv(report))
    else setPrinting(report)
  }

  return (
    <>
      <div className="flex flex-col gap-6 print:hidden">
        <header className="flex min-h-25 flex-col justify-center gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Reports &amp; exports</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Generate summary reports as PDF or raw data as CSV. Large exports are emailed when ready.
          </p>
        </header>

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <TemplateGrid selected={selected} onSelect={setSelected} />
          <GeneratePanel
            templateTitle={template.title}
            canGenerate={hasReportData(template.id)}
            onGenerate={generate}
          />
        </div>

        <RecentExports />
      </div>
      {printing && <PrintableReport report={printing} />}
    </>
  )
}
