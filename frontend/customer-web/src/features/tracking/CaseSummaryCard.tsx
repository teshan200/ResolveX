import type { ReactNode } from 'react'
import { CheckCircleIcon, LoaderCircleIcon, UtensilsIcon } from '../../components/icons'
import { StatusBadge, Tag } from '../../components/ui'
import type { TicketStatus } from '../../components/ui'
import type { CaseDetail } from './types'

// Only statuses with a designed icon get one; the rest show the label alone.
const statusIcons: Partial<Record<TicketStatus, ReactNode>> = {
  'In Progress': <LoaderCircleIcon />,
  Resolved: <CheckCircleIcon />,
}

function formatSubmitted(iso: string) {
  const date = new Date(iso)
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const isToday = date.toDateString() === new Date().toDateString()
  const day = isToday
    ? 'today'
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `Submitted ${day} at ${time}`
}

export function CaseSummaryCard({ detail }: { detail: CaseDetail }) {
  const where = [detail.branch, detail.table ? `Table ${detail.table}` : null].filter(Boolean)

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl/8 font-semibold tracking-tight text-content">
          Case {detail.caseId}
        </h1>
        <StatusBadge size="md" status={detail.status} icon={statusIcons[detail.status]} />
      </div>
      <p className="text-[13px]/[18px] text-content-secondary">
        {[formatSubmitted(detail.submittedAt), ...where].join(' · ')}
      </p>
      {(detail.categories.length > 0 || detail.orderRef) && (
        <div className="flex flex-wrap gap-2">
          {detail.categories.length > 0 && (
            <Tag tone="brand" icon={<UtensilsIcon />}>
              {detail.categories.join(' · ')}
            </Tag>
          )}
          {detail.orderRef && <Tag>Order #{detail.orderRef}</Tag>}
        </div>
      )}
    </section>
  )
}
