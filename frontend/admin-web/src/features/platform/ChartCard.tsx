import { EllipsisVertical } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconButton } from '../../components/ui'

interface ChartCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-base leading-6 font-semibold">{title}</h2>
          <p className="text-xs leading-4 text-content-tertiary">{subtitle}</p>
        </div>
        <IconButton icon={EllipsisVertical} label={`${title} options`} size="sm" />
      </header>
      {children}
    </section>
  )
}
