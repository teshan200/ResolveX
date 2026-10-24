import { ChevronRight, CircleArrowUp, CircleDot, Sparkles, UserCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { PriorityBadge, SlaTimer } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import { formatSince, initials } from '../escalations'
import type { Escalation } from '../types'

/** Small (20px) status pill used in the Figma escalation list. */
function SmallStatusPill({ style, icon: Icon, children }: { style: string; icon: typeof CircleDot; children: ReactNode }) {
  return (
    <span
      className={cn(
        'flex h-5 shrink-0 items-center gap-1 rounded-full px-2 text-xs leading-4 font-semibold whitespace-nowrap',
        style,
      )}
    >
      <Icon size={12} aria-hidden />
      {children}
    </span>
  )
}

function MetaItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <p className="text-[11px] leading-4 font-semibold tracking-[0.66px] whitespace-nowrap text-content-tertiary uppercase">
        {label}
      </p>
      {children}
    </div>
  )
}

const valueText = 'text-sm leading-5 font-medium whitespace-nowrap'

export function EscalationCard({ escalation: e }: { escalation: Escalation }) {
  const awaiting = e.state === 'awaiting'

  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-xl bg-surface px-5 py-4',
        awaiting ? 'border-[1.5px] border-danger-border' : 'border border-line',
      )}
    >
      <div className="flex items-center gap-3">
        <p className="shrink-0 font-mono text-[13px] leading-5 font-medium text-content-tertiary">{e.id}</p>
        <h2 className="min-w-0 flex-1 truncate text-base leading-6 font-semibold">{e.title}</h2>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-line-brand bg-brand-subtle px-2 py-0.5 text-xs leading-4 font-semibold whitespace-nowrap text-content-brand">
          <Sparkles size={12} aria-hidden />
          AI escalated
        </span>
        <PriorityBadge priority={e.priority} />
        <SmallStatusPill style="bg-status-escalated-bg text-status-escalated-fg" icon={CircleArrowUp}>
          Escalated
        </SmallStatusPill>
        {awaiting ? (
          <SmallStatusPill style="bg-status-new-bg text-status-new-fg" icon={CircleDot}>
            Awaiting acknowledgement
          </SmallStatusPill>
        ) : (
          <SmallStatusPill style="bg-status-claimed-bg text-status-claimed-fg" icon={UserCheck}>
            Acknowledged
          </SmallStatusPill>
        )}
        <ChevronRight size={18} className="shrink-0 text-content-secondary" aria-hidden />
      </div>

      <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
        <MetaItem label="Branch">
          <p className={valueText}>{e.branch}</p>
        </MetaItem>
        <MetaItem label="Branch Manager involved">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
              {initials(e.manager)}
            </span>
            <p className={valueText}>{e.manager}</p>
          </div>
        </MetaItem>
        <MetaItem label="Date escalated">
          <p className={valueText}>{e.escalatedOn}</p>
        </MetaItem>
        <MetaItem label="Time since escalation">
          <SlaTimer state={awaiting ? 'breached' : 'paused'} label={formatSince(e.minutesSince)} />
        </MetaItem>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-canvas px-3 py-2">
        <Sparkles size={14} className="mt-0.5 shrink-0 text-content-brand" aria-hidden />
        <p className="min-w-0 flex-1 text-[13px] leading-4.5 text-content-secondary">
          AI escalation reason: {e.reason}
        </p>
      </div>
    </article>
  )
}
