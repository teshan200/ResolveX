import type { SlaState } from '../../components/ui'
import type { SlaComplaint, SlaStatus, SlaSummary } from './types'

/** Fixed "current time" for the mock data, so screens look the same on every load. */
export const MOCK_NOW_MS = new Date('2026-10-24T10:00:00+05:30').getTime()

/** Share of the SLA window that must elapse before a complaint is flagged as a warning. */
export const WARNING_THRESHOLD = 0.75

/** Tailwind background class used for progress bars of each status. */
export const slaBarColor: Record<SlaStatus, string> = {
  'On Track': 'bg-success-solid',
  Warning: 'bg-warning-solid',
  Breached: 'bg-danger-solid',
  Paused: 'bg-neutral-400',
}

export interface SlaTiming {
  status: SlaStatus
  /** Milliseconds until the due time. Negative once breached. */
  remainingMs: number
  /** Share of the SLA window elapsed, clamped to 0..1. */
  elapsed: number
}

export function getSlaTiming(complaint: SlaComplaint, nowMs: number): SlaTiming {
  const opened = new Date(complaint.openedAt).getTime()
  const due = new Date(complaint.dueAt).getTime()
  const remainingMs = due - nowMs
  const elapsed = Math.min(1, Math.max(0, (nowMs - opened) / (due - opened)))

  let status: SlaStatus = 'On Track'
  if (complaint.paused) status = 'Paused'
  else if (remainingMs <= 0) status = 'Breached'
  else if (elapsed >= WARNING_THRESHOLD) status = 'Warning'

  return { status, remainingMs, elapsed }
}

export function summarizeSla(complaints: SlaComplaint[], nowMs: number): SlaSummary {
  const summary: SlaSummary = { total: complaints.length, onTrack: 0, warning: 0, breached: 0, paused: 0 }
  for (const c of complaints) {
    const { status } = getSlaTiming(c, nowMs)
    if (status === 'On Track') summary.onTrack++
    else if (status === 'Warning') summary.warning++
    else if (status === 'Breached') summary.breached++
    else summary.paused++
  }
  return summary
}

/** Route for a complaint's SLA detail page. Ids look like "#1042"; the "#" is dropped from the URL. */
export function slaDetailPath(complaintId: string): string {
  return `/tenant/sla-monitoring/${complaintId.replace('#', '')}`
}

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Colombo',
})

export function formatDateTime(ms: number): string {
  return dateTimeFormat.format(ms)
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** Compact duration such as "1d 2h", "3h 20m" or "45m". */
export function formatDuration(ms: number): string {
  const abs = Math.abs(ms)
  if (abs < MINUTE) return '<1m'
  const days = Math.floor(abs / DAY)
  const hours = Math.floor((abs % DAY) / HOUR)
  const minutes = Math.floor((abs % HOUR) / MINUTE)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

/** Maps a complaint's SLA status to the shared SlaTimer state. */
export function toTimerState(status: SlaStatus): SlaState {
  if (status === 'On Track') return 'on-track'
  if (status === 'Warning') return 'warning'
  if (status === 'Breached') return 'breached'
  return 'paused'
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Countdown digits: mm:ss under an hour (as in the Figma SLA Timer), compact h/d beyond that. */
export function formatTimer(ms: number): string {
  const abs = Math.abs(ms)
  if (abs >= HOUR) return formatDuration(abs)
  const seconds = Math.floor(abs / 1000)
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

/** Text shown inside an SLA timer pill or panel. */
export function timerLabel(timing: SlaTiming): string {
  if (timing.status === 'Paused') return 'Paused'
  const digits = formatTimer(timing.remainingMs)
  return timing.status === 'Breached' ? `${digits} overdue` : `${digits} left`
}
