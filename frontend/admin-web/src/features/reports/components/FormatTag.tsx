import { cn } from '../../../components/ui/cn'
import type { ReportFormat } from '../mocks'

/** PDF (blue) or CSV (grey) tag from the Figma design. */
export function FormatTag({ format }: { format: ReportFormat }) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center rounded-xs px-2 text-xs leading-4 font-medium whitespace-nowrap',
        format === 'PDF' ? 'bg-info-bg text-info-fg' : 'bg-muted text-content-secondary',
      )}
    >
      {format}
    </span>
  )
}
