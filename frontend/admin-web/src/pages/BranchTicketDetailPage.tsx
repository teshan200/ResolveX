import { ArrowLeft, CircleArrowUp, FileText, History, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { PriorityBadge, StatusBadge } from '../components/ui/StatusBadge'
import { DetailPanel, DetailRow } from '../features/escalation/components/DetailPanel'
import { EscalationHistory } from '../features/escalation/components/EscalationHistory'
import { SlaProgressCard } from '../features/tickets/SlaProgressCard'
import { ticket1042 } from '../features/tickets/mocks'

/** Branch manager "Ticket detail" screen for #1042 (Figma node 267:5821). Sample data only. */
export function BranchTicketDetailPage() {
  return (
    <div className="flex flex-col items-start gap-6">
      <Link
        to="/branch/tickets"
        className="flex items-center gap-1.5 text-[13px] leading-4.5 font-semibold text-content-link"
      >
        <ArrowLeft size={14} aria-hidden />
        Tickets
      </Link>
      <header className="flex w-full items-center gap-3">
        <p className="font-mono text-[13px] leading-5 font-medium text-content-tertiary">{ticket1042.id}</p>
        <h1 className="min-w-0 flex-1 text-2xl leading-8 font-semibold tracking-[-0.12px]">{ticket1042.title}</h1>
        <StatusBadge status="Claimed" />
        <PriorityBadge priority="High" />
        <Button variant="ghost" className="text-content-secondary font-semibold!">
          <CircleArrowUp size={18} aria-hidden />
          Escalate to Tenant Admin
        </Button>
      </header>
      <p className="text-[13px] leading-4.5 whitespace-nowrap text-content-secondary">{ticket1042.subtitle}</p>
      <div className="flex w-full items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex gap-4">
            <SlaProgressCard
              title="Acknowledgement SLA"
              state="On time"
              value="Met · 08:12"
              tone="success"
              percent={65}
              note="Target 15:00 · claimed by Dinesh Kumara"
            />
            <SlaProgressCard
              title="Resolution SLA"
              state="At risk"
              value="08:42 left"
              tone="warning"
              percent={65}
              note="Target 45:00 · warning at 80%"
            />
          </div>
          <DetailPanel icon={MessageSquare} title="Guest complaint">
            <div className="rounded-lg bg-canvas p-4">
              <p className="text-base leading-6">{ticket1042.guestComplaint}</p>
            </div>
          </DetailPanel>
          <DetailPanel icon={History} title="Progress history">
            <EscalationHistory entries={ticket1042.timeline} />
          </DetailPanel>
        </div>
        <div className="flex w-[360px] shrink-0 flex-col gap-5">
          <DetailPanel icon={FileText} title="Details">
            {ticket1042.details.map(([label, value]) => (
              <DetailRow key={label} label={label}>
                {value}
              </DetailRow>
            ))}
          </DetailPanel>
        </div>
      </div>
    </div>
  )
}
