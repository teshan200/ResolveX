import { useId } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface DetailPanelProps {
  /** Some Figma panels (Details, Customer case) have a title with no icon. */
  icon?: LucideIcon
  title: string
  /** Chip or badge shown at the right of the header. */
  action?: ReactNode
  children: ReactNode
}

/** Card with an icon header, used for every panel on the Figma escalation detail screen. */
export function DetailPanel({ icon: Icon, title, action, children }: DetailPanelProps) {
  const headingId = useId()
  return (
    <section
      aria-labelledby={headingId}
      className="overflow-hidden rounded-xl border border-line bg-surface"
    >
      <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        {Icon && <Icon size={18} className="shrink-0 text-content-brand" aria-hidden />}
        <h2 id={headingId} className="min-w-0 flex-1 text-base leading-6 font-semibold">
          {title}
        </h2>
        {action}
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">{children}</div>
    </section>
  )
}

/** Label on the left, value on the right. */
export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[13px] leading-4.5">
      <p className="min-w-0 flex-1 text-content-secondary">{label}</p>
      <div className="shrink-0 font-semibold whitespace-nowrap">{children}</div>
    </div>
  )
}
