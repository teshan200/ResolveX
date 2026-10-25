import { CircleArrowUp, CircleCheck, CircleDot, RotateCw, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { StatusPill } from '../../components/ui'
import type { PillTone } from '../../components/ui'
import type { CompanyStatus } from '../../types/company'

const styles: Record<CompanyStatus, { tone: PillTone; icon: LucideIcon }> = {
  Active: { tone: 'resolved', icon: CircleCheck },
  Trial: { tone: 'new', icon: CircleDot },
  'Past due': { tone: 'reopened', icon: RotateCw },
  Suspended: { tone: 'escalated', icon: CircleArrowUp },
  'Pending verification': { tone: 'assigned', icon: User },
}

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  const { tone, icon } = styles[status]
  return (
    <StatusPill tone={tone} icon={icon}>
      {status}
    </StatusPill>
  )
}
