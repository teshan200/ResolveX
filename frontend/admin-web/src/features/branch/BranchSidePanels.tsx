import { ChevronRight, CircleArrowUp, CircleCheck, Flag, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../components/ui/cn'
import { decisions } from './mocks'

const decisionIcons: Record<string, LucideIcon> = {
  'AI review queue': Sparkles,
  'Resolution approvals': CircleCheck,
  'Escalations to acknowledge': CircleArrowUp,
}

function CardHeader({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
      <Icon size={18} className="shrink-0 text-brand" aria-hidden />
      <h2 className="min-w-0 flex-1 text-base leading-6 font-semibold whitespace-nowrap">{title}</h2>
      {children}
    </div>
  )
}

/** "Needs your decision" card from the Figma "Branch overview" frame. */
export function NeedsDecisionCard() {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <CardHeader icon={Flag} title="Needs your decision" />
      <div className="flex flex-col gap-3 p-5">
        {decisions.map((d) => {
          const Icon = decisionIcons[d.label]
          return (
            <Link
              key={d.label}
              to={d.to}
              className="flex items-center gap-3 rounded-lg border border-line p-3 transition-colors hover:bg-canvas"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-subtle text-content-brand">
                <Icon size={16} aria-hidden />
              </span>
              <p className="min-w-0 flex-1 text-[13px] leading-4.5 font-medium">{d.label}</p>
              <span
                className={cn(
                  'flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-xs leading-4 font-semibold text-on-brand',
                  d.tone === 'danger' ? 'bg-danger-solid' : 'bg-brand',
                )}
              >
                {d.count}
              </span>
              <ChevronRight size={16} className="shrink-0 text-content-tertiary" aria-hidden />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
