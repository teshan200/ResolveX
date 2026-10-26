import { ArrowLeft, Frown, Image, MessageSquare, Paperclip, ShieldCheck, Sparkles, Star, User, Utensils } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PriorityBadge, StatusBadge } from '../components/ui/StatusBadge'
import { cn } from '../components/ui/cn'
import { AiConfidenceBadge } from '../features/escalation/components/AiConfidenceBadge'
import { DetailPanel, DetailRow } from '../features/escalation/components/DetailPanel'
import { EscalationBanner } from '../features/escalation/components/EscalationBanner'
import { EscalationHistory } from '../features/escalation/components/EscalationHistory'
import { complaint1042 as c } from '../features/tickets/complaintMocks'
import { SlaProgressCard } from '../features/tickets/SlaProgressCard'
import { useBreadcrumb } from '../layout/breadcrumb'

function SentimentChip() {
  return (
    <span className="inline-flex h-[22px] shrink-0 items-center gap-1 rounded-full bg-danger-bg px-2 text-xs leading-4 font-semibold whitespace-nowrap text-danger-fg">
      <Frown size={12} aria-hidden />
      Negative
    </span>
  )
}

function MetaLine({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={14} className="shrink-0 text-content-secondary" aria-hidden />
      <p className="text-[13px] leading-4.5 whitespace-nowrap text-content-secondary">{children}</p>
    </div>
  )
}

/** Tenant admin read-only "Complaint detail" screen for #1042 (Figma node 39:1886). Sample data only. */
export function ComplaintDetailPage() {
  const { complaintId } = useParams()
  useBreadcrumb(['Complaints overview', c.id])
  // #1042 is the only complaint with a design.
  if (complaintId !== c.id.slice(1)) return <Navigate to="/tenant/complaints" replace />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          to="/tenant/complaints"
          className="flex w-fit items-center gap-1.5 text-[13px] leading-4.5 font-semibold text-content-link"
        >
          <ArrowLeft size={14} aria-hidden />
          Complaints overview
        </Link>
        <div className="flex items-center gap-3">
          <p className="font-mono text-[13px] leading-5 font-medium text-content-tertiary">{c.id}</p>
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px] whitespace-nowrap">{c.title}</h1>
          <StatusBadge status="Claimed" />
          <PriorityBadge priority="High" />
        </div>
        <p className="text-sm leading-5 whitespace-nowrap text-content-secondary">{c.subtitle}</p>
      </div>

      <EscalationBanner title={c.banner.title} description={c.banner.description} />

      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex gap-4">
            <SlaProgressCard
              headed={false}
              title="Acknowledgement SLA"
              state=""
              value="Met · 08:12"
              tone="success"
              percent={65}
              note="Target 15:00 · claimed by Dinesh K."
            />
            <SlaProgressCard
              headed={false}
              title="Resolution SLA"
              state=""
              value="21:18 left"
              tone="warning"
              percent={65}
              note="Target 45:00 · escalates to Supervisor"
            />
          </div>

          <DetailPanel icon={MessageSquare} title="Guest complaint" action={<SentimentChip />}>
            <blockquote className="rounded-lg bg-canvas p-4 text-base leading-6">{c.guestComplaint}</blockquote>
            <div className="flex gap-6">
              <MetaLine icon={Star}>{c.meta.rating}</MetaLine>
              <MetaLine icon={Utensils}>{c.meta.channel}</MetaLine>
              <MetaLine icon={User}>{c.meta.guest}</MetaLine>
              <MetaLine icon={Paperclip}>{c.meta.photos}</MetaLine>
            </div>
            <div className="flex h-20 w-[120px] items-center justify-center rounded-md bg-muted text-content-secondary">
              <Image size={24} aria-hidden />
            </div>
          </DetailPanel>

          <section className="overflow-hidden rounded-xl border border-line bg-surface">
            <div role="tablist" className="flex items-start gap-5 border-b border-line px-5">
              {c.tabs.map((tab, i) => (
                <div key={tab.label} role="tab" aria-selected={i === 0} className="flex flex-col items-center gap-2 pt-3">
                  <span className="flex items-center gap-1.5 px-1">
                    <span
                      className={cn(
                        'text-sm leading-5 font-medium whitespace-nowrap',
                        i === 0 ? 'text-content-brand' : 'text-content-secondary',
                      )}
                    >
                      {tab.label}
                    </span>
                    {tab.count !== undefined && (
                      <span
                        className={cn(
                          'rounded-full px-1.5 text-xs leading-4 font-semibold',
                          i === 0 ? 'bg-brand-muted text-content-brand' : 'bg-muted text-content-secondary',
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </span>
                  <span className={cn('h-0.5 w-full', i === 0 && 'bg-brand')} />
                </div>
              ))}
            </div>
            <div className="px-5 py-4">
              <EscalationHistory entries={c.timeline} tight />
            </div>
          </section>
        </div>

        <div className="flex w-[360px] shrink-0 flex-col gap-5">
          <DetailPanel icon={Sparkles} title="AI classification" action={<AiConfidenceBadge percent={c.ai.percent} />}>
            {c.ai.rows.map(([label, value]) => (
              <DetailRow key={label} label={label}>
                {value}
              </DetailRow>
            ))}
            <DetailRow label="Sentiment">
              <SentimentChip />
            </DetailRow>
            <DetailRow label="Recommended priority">
              <PriorityBadge priority="High" />
            </DetailRow>
            <div className="flex items-center gap-2 rounded-md bg-success-bg px-3 py-2">
              <ShieldCheck size={14} className="shrink-0 text-success-fg" aria-hidden />
              <p className="text-xs leading-4 font-medium whitespace-nowrap text-success-fg">{c.ai.rules}</p>
            </div>
          </DetailPanel>

          <DetailPanel title="Details">
            {c.details.map(([label, value]) => (
              <DetailRow key={label} label={label}>
                {value}
              </DetailRow>
            ))}
            <DetailRow label="Assignee">
              <span className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
                  DK
                </span>
                Dinesh Kumara
              </span>
            </DetailRow>
          </DetailPanel>

          <DetailPanel title="Customer case">
            <DetailRow label="Case">
              <span className="font-mono text-xs leading-4 font-medium">RX-1042</span>
            </DetailRow>
            {c.customerCase.map(([label, value]) => (
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
