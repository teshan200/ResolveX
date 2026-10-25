import type { ReactNode } from 'react'
import { cn } from './cn'

interface FormCardProps {
  title?: string
  /** Small tag on the right of the heading, e.g. "Required" or "Optional". */
  tag?: 'Required' | 'Optional'
  /** Outlines the card in red when the question inside has an error. */
  invalid?: boolean
  children: ReactNode
  className?: string
}

export function FormCard({ title, tag, invalid, children, className }: FormCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-3 rounded-xl bg-surface p-4',
        invalid ? 'border-[1.5px] border-danger-fg' : 'border border-line-subtle',
        className,
      )}
    >
      {title && (
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex-1 text-base font-semibold text-content">{title}</h2>
          {tag && (
            <span
              className={cn(
                'shrink-0 text-xs font-semibold',
                tag === 'Required' ? 'text-danger-fg' : 'text-content-tertiary',
              )}
            >
              {tag}
            </span>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
