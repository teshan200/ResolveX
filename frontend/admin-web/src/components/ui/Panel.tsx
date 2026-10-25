import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from './cn'

interface PanelProps {
  title: string
  description?: string
  icon: LucideIcon
  children: ReactNode
  // The body of a table panel has no padding of its own.
  flush?: boolean
}

export function Panel({ title, description, icon: Icon, children, flush = false }: PanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <header className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        <Icon size={18} className="shrink-0 text-brand" />
        <div>
          <h2 className="text-base leading-6 font-semibold">{title}</h2>
          {description && (
            <p className="text-xs leading-4 text-content-tertiary">{description}</p>
          )}
        </div>
      </header>
      <div className={cn(!flush && 'flex flex-col gap-3 px-5 py-4')}>{children}</div>
    </section>
  )
}

interface PanelRowProps {
  label: string
  children: ReactNode
  danger?: boolean
  mono?: boolean
}

export function PanelRow({ label, children, danger = false, mono = false }: PanelRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] leading-4.5 text-content-secondary">{label}</span>
      <span
        className={cn(
          mono
            ? 'font-mono text-xs leading-4 font-medium'
            : 'text-[13px] leading-4.5 font-semibold',
          danger && 'text-danger-fg',
        )}
      >
        {children}
      </span>
    </div>
  )
}
