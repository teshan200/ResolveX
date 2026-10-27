import {
  ChevronRight,
  ChevronsUpDown,
  CircleAlert,
  CircleArrowUp,
  CircleCheck,
  CircleDot,
  CircleX,
  Loader,
  Lock,
  RotateCcw,
  User,
  UserCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PriorityBadge } from '../../components/ui'
import type { TicketStatus } from '../../components/ui'
import { cn } from '../../components/ui/cn'
import type { ComplaintRow } from './mocks'

export type ComplaintSortKey = 'id' | 'priority' | 'created' | 'updated'

const statusStyle: Record<TicketStatus, { style: string; icon: LucideIcon }> = {
  New: { style: 'bg-status-new-bg text-status-new-fg', icon: CircleDot },
  Assigned: { style: 'bg-status-assigned-bg text-status-assigned-fg', icon: User },
  Claimed: { style: 'bg-status-claimed-bg text-status-claimed-fg', icon: UserCheck },
  'In Progress': { style: 'bg-status-in-progress-bg text-status-in-progress-fg', icon: Loader },
  Resolved: { style: 'bg-status-resolved-bg text-status-resolved-fg', icon: CircleCheck },
  Escalated: { style: 'bg-status-escalated-bg text-status-escalated-fg', icon: CircleArrowUp },
  Reopened: { style: 'bg-status-reopened-bg text-status-reopened-fg', icon: RotateCcw },
  Cancelled: { style: 'bg-status-cancelled-bg text-status-cancelled-fg', icon: CircleX },
  'Unable to Resolve': { style: 'bg-status-unable-bg text-status-unable-fg', icon: CircleAlert },
  Closed: { style: 'bg-status-closed-bg text-status-closed-fg', icon: Lock },
}

/** Small (20px) status pill used in the table rows. */
export function StatusPill({ status }: { status: TicketStatus }) {
  const { style, icon: Icon } = statusStyle[status]
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-full px-2 text-xs leading-4 font-semibold whitespace-nowrap',
        style,
      )}
    >
      <Icon size={12} aria-hidden />
      {status}
    </span>
  )
}

const cell = 'flex h-14 items-center gap-2 overflow-hidden px-4 text-left'
const head =
  'flex h-10 items-center gap-1 border-b border-line bg-canvas px-4 text-xs leading-4 font-semibold whitespace-nowrap text-content-secondary'

function HeadCell({
  label,
  className,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  className?: string
  sortKey?: ComplaintSortKey
  sort: { key: ComplaintSortKey; direction: 'asc' | 'desc' } | null
  onSort: (key: ComplaintSortKey) => void
}) {
  return (
    <div
      role="columnheader"
      aria-sort={
        sortKey && sort?.key === sortKey ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
      }
      className={cn(head, className)}
    >
      {sortKey ? (
        <button
          type="button"
          onClick={() => onSort(sortKey)}
          className="flex cursor-pointer items-center gap-1 hover:text-content"
        >
          {label}
          <ChevronsUpDown size={14} className="text-content-tertiary" aria-hidden />
        </button>
      ) : (
        label
      )}
    </div>
  )
}

function Row({ row }: { row: ComplaintRow }) {
  const cls = 'flex w-full border-b border-line-subtle bg-surface'
  const cells = (
    <>
      <div className={cn(cell, 'w-[90px] shrink-0')}>
        <p className="min-w-0 flex-1 truncate font-mono text-[13px] leading-5 font-medium">{row.id}</p>
      </div>
      <div className={cn(cell, 'min-w-0 flex-1')}>
        <div className="flex min-w-0 flex-1 flex-col whitespace-nowrap">
          <p className="truncate text-sm leading-5 font-medium">{row.title}</p>
          <p className="truncate text-xs leading-4 text-content-tertiary">{row.place}</p>
        </div>
      </div>
      <div className={cn(cell, 'w-[110px] shrink-0')}>
        <p className="min-w-0 flex-1 truncate text-sm leading-5">{row.branch}</p>
      </div>
      <div className={cn(cell, 'w-[110px] shrink-0')}>
        <PriorityBadge priority={row.priority} />
      </div>
      <div className={cn(cell, 'w-40 shrink-0')}>
        <StatusPill status={row.status} />
      </div>
      <div className={cn(cell, 'w-[170px] shrink-0')}>
        {row.assignee ? (
          <>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
              {row.assignee.initials}
            </span>
            <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 font-medium">{row.assignee.name}</p>
          </>
        ) : (
          <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 text-content-tertiary">Not assigned yet</p>
        )}
      </div>
      <div className={cn(cell, 'w-[110px] shrink-0')}>
        <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 text-content-secondary">{row.created}</p>
      </div>
      <div className={cn(cell, 'w-[120px] shrink-0')}>
        <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 text-content-secondary">{row.updated}</p>
      </div>
      <div className={cn(cell, 'w-12 shrink-0 justify-end')}>
        <ChevronRight size={16} className="text-content-tertiary" aria-hidden />
      </div>
    </>
  )
  // Only #1042 has a complaint detail screen in the designs.
  return row.id === '#1042' ? (
    <Link role="row" to={`/tenant/complaints/${row.id.slice(1)}`} className={cn(cls, 'transition-colors hover:bg-canvas')}>
      {cells}
    </Link>
  ) : (
    <div role="row" className={cls}>
      {cells}
    </div>
  )
}

interface ComplaintsTableProps {
  rows: ComplaintRow[]
  sort: { key: ComplaintSortKey; direction: 'asc' | 'desc' } | null
  onSort: (key: ComplaintSortKey) => void
}

/** Table from the Figma "Complaints overview" frame (read-only). */
export function ComplaintsTable({ rows, sort, onSort }: ComplaintsTableProps) {
  const h = { sort, onSort }
  return (
    <div role="table" aria-label="Complaints">
      <div role="row" className="flex w-full">
        <HeadCell label="Ticket" sortKey="id" className="w-[90px] shrink-0" {...h} />
        <HeadCell label="Subject" className="min-w-0 flex-1" {...h} />
        <HeadCell label="Branch" className="w-[110px] shrink-0" {...h} />
        <HeadCell label="Priority" sortKey="priority" className="w-[110px] shrink-0" {...h} />
        <HeadCell label="Status" className="w-40 shrink-0" {...h} />
        <HeadCell label="Assigned to" className="w-[170px] shrink-0" {...h} />
        <HeadCell label="Created" sortKey="created" className="w-[110px] shrink-0" {...h} />
        <HeadCell label="Last updated" sortKey="updated" className="w-[120px] shrink-0" {...h} />
        <HeadCell label="" className="w-12 shrink-0" {...h} />
      </div>
      {rows.map((row) => (
        <Row key={row.id} row={row} />
      ))}
    </div>
  )
}
