import { complaintPageCount, complaintTotal, complaints } from '../features/complaints/mocks'
import type { ComplaintPeriod, ComplaintRow } from '../features/complaints/types'

// Mock implementation. Replace the bodies with real calls when the backend is ready.

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export type ComplaintSortKey = 'id' | 'priority' | 'created' | 'updated'

export interface ComplaintFilter {
  search?: string
  /** 'All branches' or a short branch name. */
  branch?: string
  /** 'All priorities' or a priority. */
  priority?: string
  /** 'All statuses' or a status. */
  status?: string
  period?: ComplaintPeriod
  sort?: { key: ComplaintSortKey; direction: 'asc' | 'desc' }
  page?: number
  pageSize?: number
}

export interface ComplaintPage {
  items: ComplaintRow[]
  /** Complaints in the whole company that match the filters. */
  total: number
  pageCount: number
}

const PERIOD_MINUTES: Record<ComplaintPeriod, number> = {
  Today: 24 * 60,
  'Last 7 days': 7 * 24 * 60,
  'Last 30 days': 30 * 24 * 60,
}

const PRIORITY_RANK: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Normal: 1 }

function matching(filter: ComplaintFilter): ComplaintRow[] {
  const query = filter.search?.trim().toLowerCase() ?? ''
  const { branch = 'All branches', priority = 'All priorities', status = 'All statuses', period = 'Last 7 days' } = filter
  const rows = complaints.filter(
    (row) =>
      row.createdAgo <= PERIOD_MINUTES[period] &&
      (branch === 'All branches' || row.branch === branch) &&
      (priority === 'All priorities' || row.priority === priority) &&
      (status === 'All statuses' || row.status === status) &&
      (!query || `${row.id} ${row.subject}`.toLowerCase().includes(query)),
  )

  if (filter.sort) {
    const direction = filter.sort.direction === 'asc' ? 1 : -1
    const value = (row: ComplaintRow) => {
      switch (filter.sort?.key) {
        case 'priority':
          return PRIORITY_RANK[row.priority]
        // Newest first when ascending would read oddly, so these sort by time, oldest to newest.
        case 'created':
          return -row.createdAgo
        case 'updated':
          return -row.updatedAgo
        default:
          return Number(row.id.slice(1))
      }
    }
    rows.sort((a, b) => (value(a) - value(b)) * direction)
  }
  return rows
}

// GET /complaints
export async function listComplaints(filter: ComplaintFilter = {}): Promise<ComplaintPage> {
  await delay()
  const { page = 1, pageSize = 9 } = filter
  const rows = matching(filter)
  // The unfiltered list reports the whole company (248 complaints); a filtered one reports what it found.
  const unfiltered =
    !filter.search?.trim() &&
    (filter.branch ?? 'All branches') === 'All branches' &&
    (filter.priority ?? 'All priorities') === 'All priorities' &&
    (filter.status ?? 'All statuses') === 'All statuses' &&
    (filter.period ?? 'Last 7 days') === 'Last 7 days'
  const total = unfiltered ? complaintTotal : rows.length
  return {
    items: rows.slice((page - 1) * pageSize, page * pageSize),
    total,
    pageCount: unfiltered ? complaintPageCount : Math.max(1, Math.ceil(total / pageSize)),
  }
}

// GET /complaints/export
export async function listComplaintsForExport(filter: ComplaintFilter = {}): Promise<ComplaintRow[]> {
  await delay(150)
  return matching({ ...filter, sort: filter.sort })
}
