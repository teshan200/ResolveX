import { ArrowRight, ChevronRight, CircleArrowUp, CircleCheck, Flag, Sparkles, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../components/ui/cn'
import { decisions, onShift } from './mocks'

const decisionIcons: Record<string, LucideIcon> = {
  'AI review queue': Sparkles,
  'Resolution approvals': CircleCheck,
  'Escalations to acknowledge': CircleArrowUp,
}

const barTone = {
  brand: 'bg-brand',
  warning: 'bg-warning-solid',
  danger: 'bg-danger-solid',
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

/** "On shift" card from the Figma "Branch overview" frame. */
export function OnShiftCard() {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <CardHeader icon={Users} title="On shift">
        <Link
          to="/branch/staff"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-[13px] leading-4.5 font-medium whitespace-nowrap text-content-secondary hover:bg-muted"
        >
          Workload
          <ArrowRight size={16} aria-hidden />
        </Link>
      </CardHeader>
      <div className="flex flex-col gap-3 p-5">
        {onShift.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
              {m.initials}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between whitespace-nowrap">
                <p className="text-[13px] leading-4.5 font-medium">{m.name}</p>
                <p className="text-xs leading-4 text-content-tertiary">{m.role}</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className={cn('h-full w-full rounded-full', barTone[m.tone])} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
