import { useState } from 'react'
import { GeneratePanel } from '../features/reports/components/GeneratePanel'
import { RecentExports } from '../features/reports/components/RecentExports'
import { TemplateGrid } from '../features/reports/components/TemplateGrid'
import { reportTemplates } from '../features/reports/mocks'

export function ReportsPage() {
  const [selected, setSelected] = useState(reportTemplates[0].id)
  const template = reportTemplates.find((t) => t.id === selected) ?? reportTemplates[0]

  return (
    <div className="flex flex-col gap-6">
      <header className="flex min-h-25 flex-col justify-center gap-1">
        <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Reports &amp; exports</h1>
        <p className="text-sm leading-5 text-content-secondary">
          Generate summary reports as PDF or raw data as CSV. Large exports are emailed when ready.
        </p>
      </header>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <TemplateGrid selected={selected} onSelect={setSelected} />
        <GeneratePanel templateTitle={template.title} />
      </div>

      <RecentExports />
    </div>
  )
}
