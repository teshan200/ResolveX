import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from './cn'

export type PillTone = 'resolved' | 'new' | 'reopened' | 'escalated' | 'assigned' | 'neutral'

const tones: Record<PillTone, string> = {
  resolved: 'bg-status-resolved-bg text-status-resolved-fg',
  new: 'bg-status-new-bg text-status-new-fg',
  reopened: 'bg-status-reopened-bg text-status-reopened-fg',
  escalated: 'bg-status-escalated-bg text-status-escalated-fg',
  assigned: 'bg-status-assigned-bg text-status-assigned-fg',
  neutral: 'bg-muted text-content-secondary',
}

interface StatusPillProps {
  tone: PillTone
  icon: LucideIcon
  children: ReactNode
}

// Small status label with an icon, e.g. "Active" or "Past due".
export function StatusPill({ tone, icon: Icon, children }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-2 text-xs leading-4 font-semibold whitespace-nowrap',
        tones[tone],
      )}
    >
      <Icon size={12} />
      {children}
    </span>
  )
}
