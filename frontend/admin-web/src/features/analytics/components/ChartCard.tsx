import { EllipsisVertical } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconButton } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'

interface ChartCardProps {
  title: string
  subtitle?: string
  /** Extra classes for the card, for example a fixed or flexible width. */
  className?: string
  children: ReactNode
}

/** Card shell for Analytics charts: title, subtitle, a menu button and a 180px plot area. */
export function ChartCard({ title, subtitle, className, children }: ChartCardProps) {
  return (
    <section
      aria-label={title}
      className={cn('flex flex-col gap-4 rounded-lg border border-line bg-surface p-5', className)}
    >
      <div className="flex items-center justify-between">
        <div className="whitespace-nowrap">
          <h2 className="text-base leading-6 font-semibold">{title}</h2>
          {subtitle && <p className="text-xs leading-4 text-content-tertiary">{subtitle}</p>}
        </div>
        <IconButton icon={EllipsisVertical} label={`${title} options`} size="sm" />
      </div>
      <div className="relative h-[180px] w-full shrink-0 overflow-hidden">{children}</div>
    </section>
  )
}
