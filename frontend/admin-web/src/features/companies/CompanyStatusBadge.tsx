import { CircleArrowUp, CircleCheck, CircleDot, RotateCw, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { CompanyStatus } from '../../types/company'

const styles: Record<CompanyStatus, { style: string; icon: LucideIcon }> = {
  Active: { style: 'bg-status-resolved-bg text-status-resolved-fg', icon: CircleCheck },
  Trial: { style: 'bg-status-new-bg text-status-new-fg', icon: CircleDot },
  'Past due': { style: 'bg-status-reopened-bg text-status-reopened-fg', icon: RotateCw },
  Suspended: { style: 'bg-status-escalated-bg text-status-escalated-fg', icon: CircleArrowUp },
  'Pending verification': {
    style: 'bg-status-assigned-bg text-status-assigned-fg',
    icon: User,
  },
}

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  const { style, icon: Icon } = styles[status]
  return (
    <span
      className={`inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-2 text-xs leading-4 font-semibold whitespace-nowrap ${style}`}
    >
      <Icon size={12} />
      {status}
    </span>
  )
}
