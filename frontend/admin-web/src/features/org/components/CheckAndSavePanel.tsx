import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react'
import { cn } from '../../../components/ui/cn'
import type { HierarchyCheck } from '../../../services/orgService'

const icons = {
  ok: { Icon: CircleCheck, tone: 'text-success-fg' },
  error: { Icon: CircleAlert, tone: 'text-danger-fg' },
  warn: { Icon: TriangleAlert, tone: 'text-warning-fg' },
}

// "Check & save": every rule the draft must meet. A red line blocks saving, an orange one is only a heads-up.
export function CheckAndSavePanel({ checks }: { checks: HierarchyCheck[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <header className="border-b border-line-subtle px-5 py-4">
        <h2 className="text-base leading-6 font-semibold">Check &amp; save</h2>
        <p className="text-xs leading-4 text-content-tertiary">Invalid configurations can’t be saved.</p>
      </header>
      <ul className="flex flex-col gap-3 px-5 py-4">
        {checks.map((check) => {
          const { Icon, tone } = icons[check.state]
          return (
            <li key={check.label} className="flex gap-2 text-[13px] leading-4.5">
              <Icon size={16} className={cn('mt-0.5 shrink-0', tone)} />
              <span className={check.state === 'error' ? 'text-danger-fg' : undefined}>{check.label}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
