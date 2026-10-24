import type { Escalation, EscalationChip, EscalationFilters } from './types'

export const defaultFilters: EscalationFilters = {
  search: '',
  branch: 'All branches',
  priority: 'All priorities',
  status: 'All statuses',
  days: 30,
}

/** Escalations that match the filters. The status chips are applied separately. */
export function applyFilters(all: Escalation[], f: EscalationFilters): Escalation[] {
  const query = f.search.trim().toLowerCase()
  return all.filter((e) => {
    if (f.branch !== 'All branches' && e.branch !== f.branch) return false
    if (f.priority !== 'All priorities' && e.priority !== f.priority) return false
    if (f.status !== 'All statuses' && e.ticketStatus !== f.status) return false
    if (e.escalatedDaysAgo > f.days) return false
    if (!query) return true
    return [e.id, e.title, e.manager].join(' ').toLowerCase().includes(query)
  })
}

/** Open escalations are the ones shown in the list. Closed ones only count toward "this month". */
export const isOpen = (e: Escalation) => e.state !== 'closed'

export function matchesChip(e: Escalation, chip: EscalationChip): boolean {
  if (!isOpen(e)) return false
  return chip === 'all' || e.state === chip
}

export function chipCounts(filtered: Escalation[]): Record<EscalationChip, number> {
  const open = filtered.filter(isOpen)
  return {
    awaiting: open.filter((e) => e.state === 'awaiting').length,
    acknowledged: open.filter((e) => e.state === 'acknowledged').length,
    all: open.length,
  }
}

/** "3 h 41 m ago" */
export function formatSince(minutes: number): string {
  return `${Math.floor(minutes / 60)} h ${minutes % 60} m ago`
}

/** "6 h 12 m" */
export function formatSpan(minutes: number): string {
  return `${Math.floor(minutes / 60)} h ${minutes % 60} m`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Route for an escalation's detail page. Ids look like "#1055"; the "#" is dropped from the URL. */
export function escalationDetailPath(id: string): string {
  return `/tenant/escalated/${id.replace('#', '')}`
}
