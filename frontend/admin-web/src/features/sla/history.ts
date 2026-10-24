import { slaAuditLog, slaTimelineEvents } from './historyMocks'
import { WARNING_THRESHOLD } from './sla'
import type { SlaAuditEntry, SlaComplaint, SlaTimelineEvent } from './types'

const time = (iso: string) => new Date(iso).getTime()

/**
 * Chronological timeline for one complaint. Opened, warning and breach events are derived
 * from the complaint's times and the simulated clock; the rest come from mock data.
 */
export function buildTimeline(complaint: SlaComplaint, nowMs: number): SlaTimelineEvent[] {
  const opened = time(complaint.openedAt)
  const due = time(complaint.dueAt)
  const warnAt = opened + (due - opened) * WARNING_THRESHOLD
  const pct = Math.round(WARNING_THRESHOLD * 100)

  const events: SlaTimelineEvent[] = [
    {
      id: `${complaint.id}-opened`,
      complaintId: complaint.id,
      at: complaint.openedAt,
      kind: 'opened',
      title: 'Complaint received',
      actor: 'System',
      note: `From ${complaint.customer} · ${complaint.branch}. SLA clock started.`,
    },
  ]

  if (warnAt <= nowMs) {
    events.push({
      id: `${complaint.id}-warning`,
      complaintId: complaint.id,
      at: new Date(warnAt).toISOString(),
      kind: 'warning',
      title: `Warning: ${pct}% of SLA time used`,
      actor: 'System',
    })
  }

  if (due <= nowMs && !complaint.paused) {
    events.push({
      id: `${complaint.id}-breached`,
      complaintId: complaint.id,
      at: complaint.dueAt,
      kind: 'breached',
      title: 'SLA breached',
      actor: 'System',
      note: 'The due time passed without a resolution.',
    })
  }

  return [...events, ...slaTimelineEvents.filter((e) => e.complaintId === complaint.id)].sort(
    (a, b) => time(a.at) - time(b.at),
  )
}

/** Audit entries, newest first. Pass a complaint id to limit them to one complaint. */
export function getAuditEntries(complaintId?: string): SlaAuditEntry[] {
  return slaAuditLog
    .filter((e) => !complaintId || e.complaintId === complaintId)
    .sort((a, b) => time(b.at) - time(a.at))
}

/** Share of the SLA window used, uncapped: 1.5 means 150% of the target time. */
export function timeUsedRatio(complaint: SlaComplaint, nowMs: number): number {
  const opened = time(complaint.openedAt)
  return (nowMs - opened) / (time(complaint.dueAt) - opened)
}
