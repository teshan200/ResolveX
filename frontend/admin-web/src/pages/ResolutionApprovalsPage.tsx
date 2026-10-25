import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '../components/ui'
import { EscalationStatusChips } from '../features/escalation/components/EscalationStatusChips'
import { ApprovalsTable } from '../features/recovery/components/ApprovalsTable'
import { approvalChips, decidedEarlier, resolutionApprovals } from '../features/recovery/mocks'
import type { ApprovalStatus } from '../features/recovery/types'

export function ResolutionApprovalsPage() {
  const [rows, setRows] = useState(resolutionApprovals)
  const [chip, setChip] = useState<ApprovalStatus>('waiting')

  // Simulated: decisions only change this screen. No backend is connected.
  const decide = (ids: string[], status: ApprovalStatus) =>
    setRows((current) => current.map((r) => (ids.includes(r.id) ? { ...r, status } : r)))

  const count = (status: ApprovalStatus) => rows.filter((r) => r.status === status).length
  const counts: Record<ApprovalStatus, number> = {
    waiting: count('waiting'),
    approved: decidedEarlier.approved + count('approved'),
    reopened: decidedEarlier.reopened + count('reopened'),
  }
  const slaMet = rows.filter((r) => r.status === 'waiting' && r.sla === 'Met').map((r) => r.id)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-64 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Resolution approvals</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Staff marked these resolved. Approve to close the ticket — the guest then gets one
            resolution email with a short survey — or reopen.
          </p>
        </div>
        <Button
          variant="outline"
          className="font-semibold!"
          disabled={slaMet.length === 0}
          onClick={() => decide(slaMet, 'approved')}
        >
          <Check size={18} aria-hidden />
          Approve all SLA-met
        </Button>
      </header>

      <EscalationStatusChips
        label="Approval status"
        chips={[...approvalChips]}
        selected={chip}
        counts={counts}
        onSelect={setChip}
      />

      <ApprovalsTable
        rows={rows.filter((r) => r.status === chip)}
        actionable={chip === 'waiting'}
        onApprove={(id) => decide([id], 'approved')}
        onReopen={(id) => decide([id], 'reopened')}
      />
    </div>
  )
}
