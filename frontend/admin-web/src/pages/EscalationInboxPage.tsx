import { useState } from 'react'
import { AcknowledgedTable } from '../features/escalation/components/AcknowledgedTable'
import { EscalationStatusChips } from '../features/escalation/components/EscalationStatusChips'
import { InboxUrgentCard } from '../features/escalation/components/InboxUrgentCard'
import {
  acknowledgedBy,
  acknowledgedEscalations,
  inboxChips,
  urgentEscalation,
} from '../features/escalation/inbox'
import type { AcknowledgedEscalation, InboxChip } from '../features/escalation/inbox'

export function EscalationInboxPage() {
  const [chip, setChip] = useState<InboxChip>('needs')
  // Simulated: acknowledging only changes this screen. No backend is connected.
  const [acknowledged, setAcknowledged] = useState(false)

  const rows: AcknowledgedEscalation[] = acknowledged
    ? [
        ...acknowledgedEscalations,
        {
          id: urgentEscalation.id,
          title: urgentEscalation.title,
          detail: `Table 14 · ${urgentEscalation.priority}`,
          level: urgentEscalation.route,
          acknowledged: `${acknowledgedBy.time} · ${acknowledgedBy.name}`,
        },
      ]
    : acknowledgedEscalations

  const counts: Record<InboxChip, number> = {
    needs: acknowledged ? 0 : 1,
    acknowledged: rows.length,
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex min-h-25 flex-col justify-center gap-1">
        <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Escalations to you</h1>
        <p className="text-sm leading-5 text-content-secondary">
          Acknowledge each escalation so the engine knows a manager owns it (SLA-12). Unacknowledged
          ones climb to the regional manager.
        </p>
      </header>

      <EscalationStatusChips
        label="Escalation inbox"
        chips={[...inboxChips]}
        selected={chip}
        counts={counts}
        onSelect={setChip}
      />

      {chip === 'needs' && !acknowledged && (
        <InboxUrgentCard escalation={urgentEscalation} onAcknowledge={() => setAcknowledged(true)} />
      )}

      <AcknowledgedTable rows={rows} />
    </div>
  )
}
