import type { ReactNode } from 'react'
import { Ban, CircleCheck, TriangleAlert } from 'lucide-react'
import { StatusPill } from '../../../components/ui'
import type { ActiveStatus } from '../types'

// "Active" (green check) or "Inactive" (grey ban), used on branches and employees.
export function ActiveStatusPill({ status }: { status: ActiveStatus }) {
  return status === 'Active' ? (
    <StatusPill tone="resolved" icon={CircleCheck}>
      Active
    </StatusPill>
  ) : (
    <StatusPill tone="neutral" icon={Ban}>
      Inactive
    </StatusPill>
  )
}

// Orange note with a warning icon, e.g. "Unassigned" (no branch manager) or "Not in hierarchy".
export function WarningNote({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs leading-4 font-semibold whitespace-nowrap text-warning-fg">
      <TriangleAlert size={12} />
      {children}
    </span>
  )
}
