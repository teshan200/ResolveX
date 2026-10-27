import type { ReactNode } from 'react'
import { cn } from '../../components/ui/cn'
import { weeklyTickets } from './mocks'
import type { BarRowData, BarTone } from './mocks'

const fill: Record<BarTone, string> = {
  brand: 'bg-brand',
  'brand-soft': 'bg-[rgba(21,94,84,0.35)]',
  warning: 'bg-warning-solid',
  danger: 'bg-danger-solid',
  success: 'bg-success-solid',
}

/** Card with a 15px title and a 12px subtitle, used by every Branch analytics chart. */
export function ChartPanel({
  title,
  subtitle,
  className,
  children,
}: {
  title: string
  subtitle: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      aria-label={title}
      className={cn('flex min-w-0 flex-col gap-4 rounded-xl border border-line bg-surface p-5', className)}
    >
      <div className="flex flex-col gap-0.5 whitespace-nowrap">
        <h2 className="text-[15px] leading-[21px] font-semibold">{title}</h2>
        <p className="text-xs leading-[17px] text-content-secondary">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

/** One label, a track with a filled bar, and a value. */
export function BarRow({ row }: { row: BarRowData }) {
  return (
    <div className="flex items-center gap-2.5">
      <p className="w-[92px] shrink-0 text-xs leading-[17px] font-medium whitespace-nowrap">{row.label}</p>
      <div
        role="progressbar"
        aria-label={row.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(row.percent)}
        className="relative h-2.5 min-w-0 flex-1 rounded-[5px] bg-muted"
      >
        <div
          className={cn('absolute top-0 left-0 h-2.5 rounded-[5px]', fill[row.tone])}
          style={{ width: `${row.percent}%` }}
        />
      </div>
      <p className="w-[78px] shrink-0 text-right text-xs leading-[17px] text-content-secondary">{row.display}</p>
    </div>
  )
}

const BAR_AREA = 150

/** Weekly ticket bars. The tallest week fills 150px; the partial last week is drawn lighter. */
export function TicketsOverTime() {
  const max = Math.max(...weeklyTickets.map((w) => w.value))
  return (
    <>
      <div className="flex items-end gap-5">
        {weeklyTickets.map((week) => (
          <div key={week.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <p className="text-xs leading-[17px] font-medium whitespace-nowrap">{week.value}</p>
            <div
              className={cn(
                'w-14 rounded-t-md',
                week.partial ? 'bg-[rgba(21,94,84,0.35)]' : 'bg-brand',
              )}
              style={{ height: Math.round((week.value / max) * BAR_AREA) }}
            />
            <p className="text-[11px] leading-[15px] whitespace-nowrap text-content-secondary">{week.label}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] leading-[15px] whitespace-nowrap text-content-secondary">
        Last week is partial (2 days). Totals match the KPI above.
      </p>
    </>
  )
}
