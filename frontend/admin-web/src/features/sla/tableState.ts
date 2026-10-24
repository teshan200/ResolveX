import type { TicketPriority } from '../../components/ui'
import { getSlaTiming } from './sla'
import type { SlaTiming } from './sla'
import type { SlaComplaint, SlaStatus } from './types'

export type SortKey = 'complaint' | 'branch' | 'priority' | 'status' | 'remaining'
export type SortDirection = 'asc' | 'desc'

export interface SlaFilters {
  search: string
  status: SlaStatus | 'all'
  priority: TicketPriority | 'all'
  branch: string | 'all'
}

export const emptyFilters: SlaFilters = { search: '', status: 'all', priority: 'all', branch: 'all' }

export const slaStatuses: SlaStatus[] = ['On Track', 'Warning', 'Breached', 'Paused']
export const priorities: TicketPriority[] = ['Critical', 'High', 'Medium', 'Normal']

const priorityRank: Record<TicketPriority, number> = { Critical: 0, High: 1, Medium: 2, Normal: 3 }
const statusRank: Record<SlaStatus, number> = { Breached: 0, Warning: 1, 'On Track': 2, Paused: 3 }

export interface SlaRow {
  complaint: SlaComplaint
  timing: SlaTiming
}

export function hasActiveFilters(f: SlaFilters): boolean {
  return f.search.trim() !== '' || f.status !== 'all' || f.priority !== 'all' || f.branch !== 'all'
}

export function selectRows(
  complaints: SlaComplaint[],
  nowMs: number,
  filters: SlaFilters,
  sortKey: SortKey,
  direction: SortDirection,
): SlaRow[] {
  const query = filters.search.trim().toLowerCase()

  const rows = complaints
    .map((complaint) => ({ complaint, timing: getSlaTiming(complaint, nowMs) }))
    .filter(({ complaint, timing }) => {
      if (filters.status !== 'all' && timing.status !== filters.status) return false
      if (filters.priority !== 'all' && complaint.priority !== filters.priority) return false
      if (filters.branch !== 'all' && complaint.branch !== filters.branch) return false
      if (!query) return true
      return [complaint.id, complaint.title, complaint.customer, complaint.assignee ?? '']
        .join(' ')
        .toLowerCase()
        .includes(query)
    })

  const compare = (a: SlaRow, b: SlaRow): number => {
    switch (sortKey) {
      case 'complaint':
        return a.complaint.id.localeCompare(b.complaint.id, undefined, { numeric: true })
      case 'branch':
        return a.complaint.branch.localeCompare(b.complaint.branch)
      case 'priority':
        return priorityRank[a.complaint.priority] - priorityRank[b.complaint.priority]
      case 'status':
        return statusRank[a.timing.status] - statusRank[b.timing.status]
      case 'remaining':
        return a.timing.remainingMs - b.timing.remainingMs
    }
  }

  const sign = direction === 'asc' ? 1 : -1
  return rows.sort((a, b) => sign * compare(a, b))
}
