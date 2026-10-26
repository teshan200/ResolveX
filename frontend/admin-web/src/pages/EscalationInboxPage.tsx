import { useState } from 'react'
import { History } from 'lucide-react'
import { AcknowledgedTable } from '../features/escalation/components/AcknowledgedTable'
import { EscalationHistory } from '../features/escalation/components/EscalationHistory'
import { EscalationStatusChips } from '../features/escalation/components/EscalationStatusChips'
import { InboxUrgentCard } from '../features/escalation/components/InboxUrgentCard'
import {
  acknowledgedBy,
  acknowledgedEscalations,
  historyCount,
  inboxChips,
  urgentEscalation,
  urgentHistory,
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
    history: historyCount,
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

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <AcknowledgedTable rows={rows} />
        <section
          aria-labelledby="inbox-history"
          className="w-full shrink-0 overflow-hidden rounded-xl border border-line bg-surface lg:w-[420px]"
        >
          <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
            <History size={18} className="shrink-0 text-content-brand" aria-hidden />
            <h2 id="inbox-history" className="min-w-0 flex-1 text-base leading-6 font-semibold">
              Escalation history · {urgentEscalation.id}
            </h2>
          </div>
          <div className="px-5 py-4">
            <EscalationHistory entries={urgentHistory} tight />
          </div>
        </section>
      </div>
    </div>
  )
}
