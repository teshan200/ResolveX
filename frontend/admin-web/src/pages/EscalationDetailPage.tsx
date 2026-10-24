import { useState } from 'react'
import { ArrowLeft, CircleArrowUp, FileText, History, MessageSquare, Sparkles, UserCheck } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button, PriorityBadge, SlaTimer } from '../components/ui'
import { AiConfidenceBadge } from '../features/escalation/components/AiConfidenceBadge'
import { DetailPanel, DetailRow } from '../features/escalation/components/DetailPanel'
import {
  AiEscalatedPill,
  EscalatedPill,
  EscalationStatePill,
} from '../features/escalation/components/EscalationBadges'
import { EscalationBanner } from '../features/escalation/components/EscalationBanner'
import { EscalationHistory } from '../features/escalation/components/EscalationHistory'
import { getEscalationDetail } from '../features/escalation/detail'
import { formatSince } from '../features/escalation/escalations'
import { escalations } from '../features/escalation/mocks'
import type { EscalationState } from '../features/escalation/types'

export function EscalationDetailPage() {
  const { escalationId } = useParams()
  const id = `#${escalationId}`
  const escalation = escalations.find((e) => e.id === id)
  const detail = getEscalationDetail(id)
  // Simulated: acknowledging only changes this screen. No backend is connected.
  const [state, setState] = useState<EscalationState | null>(null)

  if (!escalation || !detail) return <Navigate to="/tenant/escalated" replace />

  const current = state ?? escalation.state
  const awaiting = current === 'awaiting'
  const since = formatSince(escalation.minutesSince)

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/tenant/escalated"
        className="flex w-fit items-center gap-1.5 text-[13px] leading-4.5 font-semibold text-content-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
      >
        <ArrowLeft size={14} aria-hidden />
        Escalated to me
      </Link>

      <header className="flex flex-wrap items-center gap-3">
        <p className="shrink-0 font-mono text-[13px] leading-5 font-medium text-content-tertiary">
          {escalation.id}
        </p>
        <h1 className="min-w-64 flex-1 text-xl leading-7 font-semibold tracking-[-0.05px]">
          {escalation.title}
        </h1>
        <AiEscalatedPill />
        <PriorityBadge priority={escalation.priority} />
        <EscalatedPill />
        <EscalationStatePill state={current} />
      </header>

      <EscalationBanner
        title={`AI escalated this complaint to you · ${since}`}
        description={detail.bannerDescription}
      />

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-5">
          <DetailPanel icon={MessageSquare} title="Guest complaint">
            <blockquote className="rounded-lg bg-canvas p-4 text-base leading-6">
              {detail.guestComplaint}
            </blockquote>
          </DetailPanel>

          <DetailPanel icon={Sparkles} title="AI escalation">
            <DetailRow label="Reason">{detail.reasonLabel}</DetailRow>
            <DetailRow label="AI confidence (sample)">
              <AiConfidenceBadge percent={detail.confidence} />
            </DetailRow>
            <DetailRow label="Branch Manager involved">{detail.managerLine}</DetailRow>
            <DetailRow label="Escalated">{detail.escalatedAt}</DetailRow>
          </DetailPanel>

          <DetailPanel icon={History} title="Complaint history">
            <EscalationHistory entries={detail.timeline} />
          </DetailPanel>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-5 lg:w-[360px]">
          <DetailPanel icon={CircleArrowUp} title="Escalation status">
            <DetailRow label="Escalation">
              <EscalationStatePill state={current} />
            </DetailRow>
            <DetailRow label="Time since escalation">
              <SlaTimer state={awaiting ? 'breached' : 'paused'} label={since} />
            </DetailRow>
            {awaiting && (
              <>
                <Button className="w-full font-semibold!" onClick={() => setState('acknowledged')}>
                  <UserCheck size={18} aria-hidden />
                  Acknowledge escalation
                </Button>
                <p className="text-xs leading-4 text-content-tertiary">
                  Acknowledging records that you are reviewing this complaint against the Branch
                  Manager.
                </p>
              </>
            )}
          </DetailPanel>

          <DetailPanel icon={FileText} title="Complaint details">
            <DetailRow label="Branch">{escalation.branch}</DetailRow>
            <DetailRow label="Branch Manager">{escalation.manager}</DetailRow>
            <DetailRow label="Complaint status">
              <EscalatedPill />
            </DetailRow>
            <DetailRow label="Customer case">{detail.customerCase}</DetailRow>
          </DetailPanel>
        </div>
      </div>
    </div>
  )
}
