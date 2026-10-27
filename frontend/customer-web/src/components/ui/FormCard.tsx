import type { ReactNode } from 'react'
import { cn } from './cn'

interface FormCardProps {
  title?: string
  /** Small tag on the right of the heading, e.g. "Required" or "Optional". */
  tag?: 'Required' | 'Optional'
  children: ReactNode
  className?: string
}

export function FormCard({ title, tag, children, className }: FormCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface p-4',
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
