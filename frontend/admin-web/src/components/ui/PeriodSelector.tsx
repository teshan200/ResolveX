import { cn } from './cn'

interface PeriodSelectorProps<T extends string> {
  periods: readonly T[]
  value: T
  onChange: (period: T) => void
  label?: string
}

// Segmented control for picking a reporting period.
export function PeriodSelector<T extends string>({
  periods,
  value,
  onChange,
  label = 'Period',
}: PeriodSelectorProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex h-10.5 items-center gap-0.5 rounded-[10px] border border-line bg-canvas p-0.75"
    >
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          aria-pressed={period === value}
          onClick={() => onChange(period)}
          className={cn(
            'h-8.5 cursor-pointer rounded-lg px-4 text-[13px] leading-4.5 font-medium whitespace-nowrap transition-colors',
            period === value
              ? 'bg-surface text-content'
              : 'text-content-secondary hover:text-content',
          )}
        >
          {period}
        </button>
      ))}
    </div>
  )
}
