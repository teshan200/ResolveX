import { CircleCheck, Download } from 'lucide-react'
import { Button } from '../../components/ui'
import { cn } from '../../components/ui/cn'
import type { AnalyticsData, ReportFormat } from '../../types/analytics'

interface ReportPreviewProps {
  format: ReportFormat
  data: AnalyticsData
  onClose: () => void
}

// "20–26 Oct 2026" → "20-26-Oct_2026"
const fileSlug = (range: string) =>
  range.replace(/\s*–\s*/g, '-').replace(/ (\d{4})$/, '_$1').replace(/ /g, '-')

export function ReportPreview({ format, data, onClose }: ReportPreviewProps) {
  const extension = format.toLowerCase()

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-success-solid bg-surface p-5">
      <header className="flex min-h-10 items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CircleCheck size={20} className="shrink-0 text-neutral-700" />
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[15px] leading-[18px] font-semibold">
              {format} report ready — {data.period} ({data.range})
            </h2>
            <p className="text-xs leading-[15px] text-content-secondary">
              ResolveX_Platform_Analytics_{fileSlug(data.range)}.{extension} · simulated preview, no
              file is created in this prototype
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" className="text-content-secondary!" onClick={onClose}>
            Close
          </Button>
          <Button size="sm">
            <Download size={16} />
            Download {format}
          </Button>
        </div>
      </header>

      <div className="overflow-hidden rounded-[10px] border border-line-subtle">
        {data.summary.map((row, index) => (
          <div
            key={row.label}
            className={cn('flex h-8 items-center px-3.5 text-xs leading-4', index % 2 === 0 && 'bg-canvas')}
          >
            <span className="w-65 shrink-0 font-medium text-content-secondary">{row.label}</span>
            <span className={index === 0 ? 'font-semibold' : undefined}>{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
