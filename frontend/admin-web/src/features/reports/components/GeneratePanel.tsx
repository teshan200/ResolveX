import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button, Select } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import { branchScopeOptions, dateRangeOptions } from '../mocks'
import type { ReportFormat } from '../mocks'
import type { ReportOptions } from '../../export/reports'

function Radio({
  label,
  value,
  checked,
  onChange,
}: {
  label: string
  value: ReportFormat
  checked: boolean
  onChange: (value: ReportFormat) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm leading-5">
      <input
        type="radio"
        name="report-format"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <span
        className={cn(
          'flex size-[18px] items-center justify-center rounded-full border-[1.5px] border-line-strong bg-surface',
          'peer-checked:border-brand peer-checked:bg-brand peer-checked:*:opacity-100',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-line-focus',
        )}
      >
        <span className="size-1.5 rounded-full bg-white opacity-0" />
      </span>
      {label}
    </label>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-fit cursor-pointer items-center gap-2 text-sm leading-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
    >
      <span
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand' : 'bg-line-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(11,19,18,0.2)] transition-all',
            checked ? 'left-[18px]' : 'left-0.5',
          )}
        />
      </span>
      {label}
    </button>
  )
}

interface GeneratePanelProps {
  templateTitle: string
  /** False when the selected template has no sample data to export. */
  canGenerate: boolean
  onGenerate: (format: ReportFormat, options: ReportOptions) => void
}

/** "Generate: <template>" form. CSV downloads a file and PDF opens the print dialog. */
export function GeneratePanel({ templateTitle, canGenerate, onGenerate }: GeneratePanelProps) {
  const [range, setRange] = useState(dateRangeOptions[1])
  const [branches, setBranches] = useState(branchScopeOptions[0])
  const [format, setFormat] = useState<ReportFormat>('PDF')
  const [email, setEmail] = useState(false)

  return (
    <section
      aria-labelledby="generate-heading"
      className="flex w-full shrink-0 flex-col gap-4 rounded-xl border border-line bg-surface p-5 lg:w-[380px]"
    >
      <h2 id="generate-heading" className="text-base leading-6 font-semibold whitespace-nowrap">
        Generate: {templateTitle}
      </h2>
      <Select label="Date range" options={dateRangeOptions} value={range} onChange={(e) => setRange(e.target.value)} />
      <Select label="Branches" options={branchScopeOptions} value={branches} onChange={(e) => setBranches(e.target.value)} />
      <div role="radiogroup" aria-labelledby="format-label" className="flex flex-col gap-2">
        <p id="format-label" className="text-[13px] leading-4.5 font-medium">
          Format
        </p>
        <div className="flex gap-5">
          <Radio label="PDF report" value="PDF" checked={format === 'PDF'} onChange={setFormat} />
          <Radio label="CSV data" value="CSV" checked={format === 'CSV'} onChange={setFormat} />
        </div>
      </div>
      <Toggle label="Email it to me when ready" checked={email} onChange={setEmail} />
      <Button
        className="w-full font-semibold!"
        disabled={!canGenerate}
        title={canGenerate ? undefined : 'No sample data for this report in the prototype'}
        onClick={() => onGenerate(format, { range, branches })}
      >
        <Download size={18} aria-hidden />
        Generate report
      </Button>
    </section>
  )
}
