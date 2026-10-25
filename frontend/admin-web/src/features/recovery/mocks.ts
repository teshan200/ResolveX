import type { ApprovalStatus, ResolutionApproval } from './types'

// Mock data only, taken from the Figma "Resolution approvals" frame.
export const resolutionApprovals: ResolutionApproval[] = [
  {
    id: '#1042',
    title: 'Food was cold',
    location: 'Table 7',
    resolvedBy: 'Dinesh K.',
    note: 'Re-prepared biryani & naan, served hot. Apologized to guest.',
    time: '24 min',
    sla: 'Met',
    status: 'waiting',
  },
  {
    id: '#1029',
    title: 'Wrong drink served',
    location: 'Table 2',
    resolvedBy: 'Nadeesha J.',
    note: 'Replaced with correct mocktail within 4 min.',
    time: '6 min',
    sla: 'Met',
    status: 'waiting',
  },
  {
    id: '#1031',
    title: 'Foreign object in soup',
    location: 'Table 4',
    resolvedBy: 'Kavinda P.',
    note: 'Replaced dish and logged a kitchen incident; manager spoke with the guest.',
    time: '58 min',
    sla: 'Breached',
    status: 'waiting',
  },
  {
    id: '#1036',
    title: 'Delivery missing items',
    location: 'Online',
    resolvedBy: 'Dinesh K.',
    note: 'Missing naan sent via rider within 20 minutes.',
    time: '31 min',
    sla: 'Met',
    status: 'waiting',
  },
]

/** Decisions already made earlier today. The Figma chips show these as counts only. */
export const decidedEarlier: Record<Exclude<ApprovalStatus, 'waiting'>, number> = {
  approved: 17,
  reopened: 2,
}

export const approvalChips = [
  { key: 'waiting', label: 'Waiting' },
  { key: 'approved', label: 'Approved today' },
  { key: 'reopened', label: 'Reopened' },
] as const
