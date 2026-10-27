import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from './cn'

export type KpiTrend = 'up' | 'flat' | 'down'

const trends: Record<KpiTrend, { icon: LucideIcon; style: string }> = {
  up: { icon: TrendingUp, style: 'bg-success-bg text-success-fg' },
  flat: { icon: Minus, style: 'bg-info-bg text-info-fg' },
  down: { icon: TrendingDown, style: 'bg-danger-bg text-danger-fg' },
}

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  iconClassName?: string
  // Without a delta and caption the card shows only the label and the value.
  delta?: string
  trend?: KpiTrend
  caption?: string
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  iconClassName = 'text-brand',
  delta,
  trend = 'flat',
  caption,
}: KpiCardProps) {
  const { icon: TrendIcon, style } = trends[trend]

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] leading-4.5 font-medium text-content-secondary">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-md bg-brand-subtle">
          <Icon size={16} className={cn(iconClassName)} />
        </span>
      </div>
      <p className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">{value}</p>
      {delta !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex items-center gap-0.5 rounded-full px-1.5 text-xs leading-4 font-semibold',
              style,
            )}
          >
            <TrendIcon size={12} />
            {delta}
          </span>
          <span className="text-xs leading-4 text-content-tertiary">{caption}</span>
        </div>
      )}
    </div>
  )
}
