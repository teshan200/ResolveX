import {
  ChevronRight,
  CircleArrowUp,
  CircleDot,
  Frown,
  Sparkles,
  Store,
  Utensils,
  UserCheck,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { PriorityBadge, SlaTimer, StatusBadge } from '../../components/ui'
import type { SlaState, TicketPriority, TicketStatus } from '../../components/ui'
import { cn } from '../../components/ui/cn'

interface PreviewTicket {
  id: string
  title: string
  priority: TicketPriority
  stripe: string
  sla: { state: SlaState; label: string }
  place: string
  status: TicketStatus
  action: { label: string; primary: boolean }
}

const tickets: PreviewTicket[] = [
  {
    id: '#1038',
    title: 'Wrong order delivered',
    priority: 'Critical',
    stripe: 'bg-priority-critical-solid',
    sla: { state: 'warning', label: '08:42 left' },
    place: 'Table 14',
    status: 'Escalated',
    action: { label: 'Resolve', primary: true },
  },
  {
    id: '#1042',
    title: 'Food was cold',
    priority: 'High',
    stripe: 'bg-priority-high-solid',
    sla: { state: 'breached', label: 'Breached −05:20' },
    place: 'Table 7',
    status: 'In Progress',
    action: { label: 'Review', primary: false },
  },
  {
    id: '#1045',
    title: 'Billing discrepancy',
    priority: 'Medium',
    stripe: 'bg-priority-medium-solid',
    sla: { state: 'on-track', label: '24:10 left' },
    place: 'Counter 2',
    status: 'Assigned',
    action: { label: 'Review', primary: false },
  },
]

function TicketCard({ ticket }: { ticket: PreviewTicket }) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-line bg-surface shadow-[0_1px_2px_rgba(11,19,18,0.05)]">
      <span className={cn('w-1 shrink-0', ticket.stripe)} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] leading-5 font-medium">{ticket.id}</span>
            <PriorityBadge priority={ticket.priority} />
          </div>
          <SlaTimer state={ticket.sla.state} label={ticket.sla.label} />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-base leading-6 font-semibold">{ticket.title}</p>
          <p className="flex items-center gap-1.5 text-[13px] leading-4.5 text-content-secondary">
            <Store size={14} />
            Colombo Branch
            <span className="text-content-tertiary">·</span>
            <Utensils size={14} />
            {ticket.place}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={ticket.status} />
          <span
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] leading-4.5 font-medium',
              ticket.action.primary
                ? 'bg-brand text-on-brand'
                : 'bg-brand-subtle text-content-brand',
            )}
          >
            {ticket.action.label}
            <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </div>
  )
}

function TimelineEvent({
  icon,
  tone,
  title,
  time,
  description,
  last = false,
}: {
  icon: ReactNode
  tone: string
  title: string
  time: string
  description: string
  last?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', tone)}>
          {icon}
        </span>
        {!last && <span className="w-0.5 flex-1 bg-line" />}
      </div>
      <div className={cn('flex flex-1 flex-col gap-1', last ? 'pb-3' : 'pb-5')}>
        <div className="flex items-center justify-between">
          <p className="text-sm leading-5 font-semibold">{title}</p>
          <p className="text-xs leading-4 text-content-tertiary">{time}</p>
        </div>
        <p className="text-xs leading-4 font-medium text-content-secondary">System</p>
        <p className="text-[13px] leading-4.5 text-content-secondary">{description}</p>
      </div>
    </div>
  )
}

function TicketDetail() {
  return (
    <div className="flex w-full shrink-0 flex-col gap-4 rounded-lg border border-line bg-surface p-5 lg:w-105 lg:self-start">
      <div className="flex items-center justify-between">
        <p className="text-base leading-6 font-semibold">#1042 · Food was cold</p>
        <SlaTimer state="warning" label="08:42 left" />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex h-5.5 items-center gap-1 rounded-xs bg-brand-subtle px-2 text-xs leading-4 font-medium text-content-brand">
          <Utensils size={12} />
          Food quality › Temperature
        </span>
        <span className="inline-flex h-5.5 items-center gap-1 rounded-full bg-danger-bg px-2 text-xs leading-4 font-semibold text-danger-fg">
          <Frown size={12} />
          Negative
        </span>
        <span className="inline-flex h-5.5 items-center gap-1 rounded-full border border-line-subtle bg-brand-subtle px-2 text-xs leading-4 font-semibold text-content-brand">
          <Sparkles size={12} />
          AI
          <span className="size-1.5 rounded-full bg-success-solid" />
          <span className="text-success-fg">92%</span>
        </span>
        <PriorityBadge priority="High" />
      </div>

      <p className="rounded-md bg-canvas p-3 text-[13px] leading-4.5 text-content-secondary">
        “The chicken biryani arrived barely lukewarm after a 35-minute wait.”
      </p>

      <div className="flex flex-col">
        <TimelineEvent
          icon={<CircleArrowUp size={16} />}
          tone="bg-status-escalated-bg text-status-escalated-fg"
          title="Escalated to Supervisor"
          time="12:33 PM"
          description="Auto-escalated: acknowledgement SLA at 80%"
        />
        <TimelineEvent
          icon={<UserCheck size={16} />}
          tone="bg-status-claimed-bg text-status-claimed-fg"
          title="Ticket claimed"
          time="12:24 PM"
          description="Claimed by Dinesh K. from the mobile app"
        />
        <TimelineEvent
          icon={<CircleDot size={16} />}
          tone="bg-status-new-bg text-status-new-fg"
          title="Ticket created"
          time="12:18 PM"
          description="From QR · Colombo Branch · Table 7"
          last
        />
      </div>
    </div>
  )
}

export function IncidentPreview() {
  return (
    <div className="flex w-full max-w-280 flex-col gap-6 rounded-3xl border border-line bg-canvas p-6 shadow-[0_24px_48px_-12px_rgba(11,19,18,0.16)] lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-base leading-6 font-semibold">Live incident queue</p>
          <span className="flex items-center gap-1.5 text-xs leading-4 font-semibold text-success-fg">
            <span className="size-2 rounded-full bg-success-solid" />
            Live SLA
          </span>
        </div>
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
      <TicketDetail />
    </div>
  )
}
