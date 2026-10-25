import { CircleArrowUp, CircleDot, Sparkles, UserCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../../components/ui/cn'
import type { EscalationState } from '../types'

/** Small (20px) status pill used across the Figma escalation screens. */
export function SmallStatusPill({
  style,
  icon: Icon,
  children,
}: {
  style: string
  icon: typeof CircleDot
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-2 text-xs leading-4 font-semibold whitespace-nowrap',
        style,
      )}
    >
      <Icon size={12} aria-hidden />
      {children}
    </span>
  )
}

export function EscalatedPill() {
  return (
    <SmallStatusPill style="bg-status-escalated-bg text-status-escalated-fg" icon={CircleArrowUp}>
      Escalated
    </SmallStatusPill>
  )
}

/** "Awaiting acknowledgement" or "Acknowledged", depending on the escalation state. */
export function EscalationStatePill({ state }: { state: EscalationState }) {
  if (state === 'awaiting') {
    return (
      <SmallStatusPill style="bg-status-new-bg text-status-new-fg" icon={CircleDot}>
        Awaiting acknowledgement
      </SmallStatusPill>
    )
  }
  return (
    <SmallStatusPill style="bg-status-claimed-bg text-status-claimed-fg" icon={UserCheck}>
      Acknowledged
    </SmallStatusPill>
  )
}

export function AiEscalatedPill() {
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-full border border-line-brand bg-brand-subtle px-2 py-0.5 text-xs leading-4 font-semibold whitespace-nowrap text-content-brand">
      <Sparkles size={12} aria-hidden />
      AI escalated
    </span>
  )
}
