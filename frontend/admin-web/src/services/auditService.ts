import { auditEvents, auditPageCount, auditTotal } from '../features/audit/mocks'
import type { AuditCategory, AuditEvent } from '../features/audit/types'

// Mock implementation. Replace the bodies with real calls when the backend is ready.

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface AuditFilter {
  category?: AuditCategory | 'All'
  search?: string
}

export interface AuditPage {
  items: AuditEvent[]
  /** Events in the whole log that match the filter. */
  total: number
  pageCount: number
}

const matches = (event: AuditEvent, { category = 'All', search = '' }: AuditFilter) => {
  const query = search.trim().toLowerCase()
  return (
    (category === 'All' || event.category === category) &&
    (!query ||
      [event.actorName, event.action, event.detail, event.target, event.source].some((value) =>
        value.toLowerCase().includes(query),
      ))
  )
}

// GET /audit-logs
export async function listAuditEvents(filter: AuditFilter & { page?: number; pageSize?: number } = {}): Promise<AuditPage> {
  await delay()
  const { page = 1, pageSize = 8 } = filter
  const matched = auditEvents.filter((event) => matches(event, filter))
  // The unfiltered log reports its real size (12,904 events); a filtered one reports what it found.
  const unfiltered = (filter.category ?? 'All') === 'All' && !filter.search?.trim()
  const total = unfiltered ? auditTotal : matched.length
  return {
    items: matched.slice((page - 1) * pageSize, page * pageSize),
    total,
    pageCount: unfiltered ? auditPageCount : Math.max(1, Math.ceil(total / pageSize)),
  }
}

// GET /audit-logs/export
export async function listAuditEventsForExport(filter: AuditFilter = {}): Promise<AuditEvent[]> {
  await delay(150)
  return auditEvents.filter((event) => matches(event, filter))
}
