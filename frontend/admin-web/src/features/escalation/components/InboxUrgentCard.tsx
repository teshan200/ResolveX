import { CircleArrowUp, ExternalLink, UserCheck, Users } from 'lucide-react'
import { Button, PriorityBadge, SlaTimer } from '../../../components/ui'
import type { InboxEscalation } from '../inbox'
import { MetaItem, metaValueClass } from './MetaItem'

interface InboxUrgentCardProps {
  escalation: InboxEscalation
  onAcknowledge: () => void
}

/** The red "needs acknowledgement" card from the Figma Escalation Inbox. */
export function InboxUrgentCard({ escalation: e, onAcknowledge }: InboxUrgentCardProps) {
  return (
    <section
      aria-label={`Needs acknowledgement: ${e.title}`}
      className="flex flex-col gap-4 rounded-xl border border-danger-border bg-danger-bg px-6 py-5"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-solid text-on-brand">
          <CircleArrowUp size={20} aria-hidden />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <p className="font-mono text-[13px] leading-5 font-medium">{e.id}</p>
            <h2 className="text-lg leading-[26px] font-semibold whitespace-nowrap">{e.title}</h2>
            <PriorityBadge priority={e.priority} />
          </div>
          <p className="text-[13px] leading-4.5 whitespace-nowrap text-content-secondary">
            {e.route} · {e.breach} · escalated {e.escalatedAgo}
          </p>
        </div>
        <SlaTimer state="breached" label={e.ackDue} />
      </div>

      <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
        <MetaItem label="Current owner">
          <p className={metaValueClass}>{e.currentOwner}</p>
        </MetaItem>
        <MetaItem label="Guest">
          <p className={metaValueClass}>{e.guest}</p>
        </MetaItem>
        <MetaItem label="Guest update">
          <p className={metaValueClass}>{e.guestUpdate}</p>
        </MetaItem>
      </div>

      <div className="flex flex-wrap items-start gap-3">
        <Button className="font-semibold!" onClick={onAcknowledge}>
          <UserCheck size={18} aria-hidden />
          Acknowledge &amp; take ownership
        </Button>
        <Button variant="outline" className="font-semibold!">
          <Users size={18} aria-hidden />
          Reassign
        </Button>
        <Button variant="ghost" className="font-semibold! text-content-secondary!">
          Open ticket
          <ExternalLink size={18} aria-hidden />
        </Button>
      </div>
    </section>
  )
}
