import { Link } from 'react-router-dom'
import { formatDateTime, slaDetailPath } from '../sla'
import type { SlaAuditEntry } from '../types'

interface SlaAuditHistoryProps {
  entries: SlaAuditEntry[]
  /** Show which complaint each entry belongs to, for lists that span complaints. */
  showComplaint?: boolean
}

/** Audit entries as a list, newest first as supplied by the caller. */
export function SlaAuditHistory({ entries, showComplaint = false }: SlaAuditHistoryProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-content-secondary">No audit entries recorded.</p>
  }

  return (
    <ul className="flex flex-col divide-y divide-line-subtle">
      {entries.map((entry) => (
        <li key={entry.id} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
          <p className="text-sm font-medium">
            {showComplaint && (
              <Link
                to={slaDetailPath(entry.complaintId)}
                className="text-content-link hover:underline"
              >
                {entry.complaintId}
              </Link>
            )}
            {showComplaint && ' '}
            {entry.action}
          </p>
          {entry.detail && <p className="text-sm text-content-secondary">{entry.detail}</p>}
          <p className="text-xs text-content-tertiary">
            <time dateTime={entry.at}>{formatDateTime(new Date(entry.at).getTime())}</time> ·{' '}
            {entry.actor}
          </p>
        </li>
      ))}
    </ul>
  )
}
