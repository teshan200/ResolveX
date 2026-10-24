import { CircleAlert, Clock, Pause, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from './cn'

export type SlaState = 'on-track' | 'warning' | 'breached' | 'paused'

const states: Record<SlaState, { style: string; icon: LucideIcon }> = {
  'on-track': { style: 'bg-sla-on-track-bg text-sla-on-track-fg', icon: Clock },
  warning: { style: 'bg-sla-warning-bg text-sla-warning-fg', icon: Timer },
  breached: { style: 'bg-sla-breached-bg text-sla-breached-fg', icon: CircleAlert },
  paused: { style: 'bg-sla-paused-bg text-sla-paused-fg', icon: Pause },
}

interface SlaTimerProps {
  state: SlaState
  label: string
}

export function SlaTimer({ state, label }: SlaTimerProps) {
  const { style, icon: Icon } = states[state]
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-2 font-mono text-xs leading-4 font-medium whitespace-nowrap',
        style,
      )}
    >
      <Icon size={14} />
      {label}
    </span>
  )
}
