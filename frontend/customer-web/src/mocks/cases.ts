import type { CaseDetail } from '../features/tracking/types'
import { mockBranding } from './branding'

// Stand-in for the case records the backend will hold. Cases submitted in this
// browser session are remembered so the tracking screens work end to end.

export interface KnownCase {
  caseId: string
  /** Present for cases submitted in this session; the demo case has none. */
  submittedAt?: string
  table?: string | null
  areas?: string[]
}

const STORAGE_KEY = 'resolvex.submittedCases'

const demoCase: KnownCase = { caseId: 'RX-1042' }

function readSubmitted(): KnownCase[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as KnownCase[]) : []
  } catch {
    return []
  }
}

export function registerCase(entry: KnownCase) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...readSubmitted(), entry]))
  } catch {
    // Storage can be blocked; the demo case still works.
  }
}

const CONFIRMED_KEY = 'resolvex.confirmedCases'

function readConfirmed(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(CONFIRMED_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

/** Records that the guest confirmed the case is resolved. */
export function markResolved(caseId: string) {
  try {
    sessionStorage.setItem(
      CONFIRMED_KEY,
      JSON.stringify({ ...readConfirmed(), [caseId.toUpperCase()]: new Date().toISOString() }),
    )
  } catch {
    // Storage can be blocked; the confirmation then only lasts until the page reloads.
  }
}

export function findCase(caseId: string): KnownCase | undefined {
  const wanted = caseId.trim().toUpperCase()
  // The newest submission wins, because every mock submission reuses the same case ID.
  return [demoCase, ...readSubmitted()].reverse().find((entry) => entry.caseId.toUpperCase() === wanted)
}

function todayAt(hours: number, minutes: number) {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

function minutesAfter(iso: string, minutes: number) {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString()
}

export function getCaseDetail(known: KnownCase): CaseDetail {
  const isDemo = known.submittedAt === undefined
  const submittedAt = known.submittedAt ?? todayAt(12, 18)
  const table = isDemo ? '7' : (known.table ?? null)
  const branch = mockBranding.branch
  const confirmedAt = readConfirmed()[known.caseId.toUpperCase()]

  return {
    caseId: known.caseId,
    status: confirmedAt ? 'Resolved' : 'In Progress',
    submittedAt,
    branch,
    table,
    categories: isDemo ? ['Food quality', 'Temperature'] : (known.areas ?? []),
    orderRef: isDemo ? 'ORD-8821' : null,
    expected: confirmedAt
      ? {
          label: 'Resolved',
          progress: 100,
          note: 'Your complaint is resolved. Thank you for confirming.',
        }
      : {
          label: 'Under 15 min',
          progress: 62.5,
          note: 'The duty manager and kitchen lead are on it. We’ll email you once your complaint is resolved.',
        },
    // The demo case is still being worked on, so the guest cannot confirm it yet.
    branchResolved: false,
    timeline: [
      {
        kind: 'received',
        title: 'Feedback received',
        at: submittedAt,
        location: branch,
        message: `Logged via the ${branch} QR code${table ? ` · Table ${table}` : ''}`,
      },
      {
        kind: 'assigned',
        title: 'Assigned to duty manager',
        at: minutesAfter(submittedAt, 2),
        location: branch,
        message: 'Kavinda P. is handling your case',
      },
      {
        kind: 'in-progress',
        title: 'Kitchen re-preparing your meal',
        at: minutesAfter(submittedAt, 8),
        location: branch,
        message: 'A fresh biryani is on its way to your table',
      },
      ...(confirmedAt
        ? [
            {
              kind: 'resolved' as const,
              title: 'Resolved',
              at: confirmedAt,
              location: branch,
              message: 'You confirmed that the issue is resolved',
            },
          ]
        : []),
    ],
    updatedLabel: confirmedAt ? 'Updated just now' : 'Updated 2 min ago',
  }
}
