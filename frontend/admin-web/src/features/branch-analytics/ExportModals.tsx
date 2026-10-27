import { CircleCheck, Download, FileText } from 'lucide-react'
import { Button, Checkbox, Modal } from '../../components/ui'
import { cn } from '../../components/ui/cn'
import { reportSections } from './mocks'

export type ExportFormat = 'PDF' | 'CSV'

function Radio({
  label,
  checked,
  onSelect,
}: {
  label: string
  checked: boolean
  onSelect: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm leading-5">
      <input type="radio" name="export-format" className="peer sr-only" checked={checked} onChange={onSelect} />
      <span
        className={cn(
          'flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-line-focus',
          checked ? 'border-brand bg-brand' : 'border-line-strong bg-surface',
        )}
      >
        {checked && <span className="size-2 rounded-full bg-on-brand" />}
      </span>
      {label}
    </label>
  )
}

interface OptionsProps {
  open: boolean
  format: ExportFormat
  included: string[]
  onFormat: (format: ExportFormat) => void
  onToggle: (section: string) => void
  onCancel: () => void
  onExport: () => void
}

/** "Export branch report" dialog from the Figma Branch analytics export frames. */
export function ExportOptionsModal({ open, format, included, onFormat, onToggle, onCancel, onExport }: OptionsProps) {
  return (
    <Modal
      open={open}
      size="lg"
      title="Export branch report"
      onClose={onCancel}
      footer={
        <>
          <Button variant="outline" className="font-semibold!" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="font-semibold!" disabled={included.length === 0} onClick={onExport}>
            Export report
          </Button>
        </>
      }
    >
      <p className="text-sm leading-5 text-content-secondary">
        Colombo Branch · Last 30 days (20 Sep – 19 Oct 2026). Choose a format and what to include.
      </p>
      <div className="flex flex-col gap-2.5">
        <p className="text-xs leading-[17px] font-medium">Format</p>
        <div className="flex gap-5">
          <Radio label="PDF report" checked={format === 'PDF'} onSelect={() => onFormat('PDF')} />
          <Radio label="CSV data" checked={format === 'CSV'} onSelect={() => onFormat('CSV')} />
        </div>
        <p className="text-xs leading-[17px] font-medium">Include</p>
        <div className="flex flex-col items-start gap-2">
          {reportSections.map((section) => (
            <Checkbox
              key={section}
              label={section}
              checked={included.includes(section)}
              onChange={() => onToggle(section)}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

interface ReadyProps {
  open: boolean
  format: ExportFormat
  sections: string[]
  onClose: () => void
  onDownload: () => void
}

const fileStem = 'Colombo-Branch-Report_20Sep-19Oct-2026'

/** "Your report is ready" dialog. The PDF download is simulated, as the Figma note says. */
export function ExportReadyModal({ open, format, sections, onClose, onDownload }: ReadyProps) {
  const summary =
    sections.length === reportSections.length
      ? 'KPI summary, trends, priority & SLA, feedback, workload'
      : sections.join(', ')
  return (
    <Modal
      open={open}
      size="lg"
      title="Your report is ready"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" className="font-semibold!" onClick={onClose}>
            Close
          </Button>
          <Button className="font-semibold!" onClick={onDownload}>
            <Download size={18} aria-hidden />
            Download {format}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-5 text-content-secondary">
        Colombo Branch · Last 30 days (20 Sep – 19 Oct 2026) · {sections.length}{' '}
        {sections.length === 1 ? 'section' : 'sections'}.
      </p>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3 rounded-[10px] border border-line px-3.5 py-3">
          <FileText size={20} className="shrink-0" aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-[13px] leading-[19px] font-medium">
              {fileStem}.{format.toLowerCase()}
            </p>
            <p className="truncate text-xs leading-[17px] text-content-secondary">
              {format} · {summary}
            </p>
          </div>
          <CircleCheck size={18} className="shrink-0 text-success-fg" aria-hidden />
        </div>
        {format === 'PDF' && (
          <p className="text-[11px] leading-4 text-content-secondary">
            Prototype: the download is simulated and no file is generated.
          </p>
        )}
      </div>
    </Modal>
  )
}
