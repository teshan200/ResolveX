import { ChevronRight, ChevronsUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PriorityBadge, SlaTimer } from '../../components/ui'
import { cn } from '../../components/ui/cn'
import { StatusPill } from '../complaints/ComplaintsTable'
import type { BranchTicket } from './mocks'

export type TicketSortKey = 'id' | 'submitted' | 'priority' | 'updated'
export interface TicketSort {
  key: TicketSortKey
  direction: 'asc' | 'desc'
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
  sortKey?: TicketSortKey
  sort: TicketSort | null
  onSort: (key: TicketSortKey) => void
}) {
  return (
    <div
      role="columnheader"
      aria-sort={sortKey && sort?.key === sortKey ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
      className={cn(head, className)}
    >
      {sortKey ? (
        <button type="button" onClick={() => onSort(sortKey)} className="flex cursor-pointer items-center gap-1 hover:text-content">
          {label}
          <ChevronsUpDown size={14} className="text-content-tertiary" aria-hidden />
        </button>
      ) : (
        label
      )}
    </div>
  )
}

function Row({ ticket: t }: { ticket: BranchTicket }) {
  const cls = 'flex w-full border-b border-line-subtle bg-surface'
  const cells = (
    <>
      <div className={cn(cell, 'w-20 shrink-0')}>
        <p className="min-w-0 flex-1 truncate font-mono text-[13px] leading-5 font-medium">{t.id}</p>
      </div>
      <div className={cn(cell, 'min-w-0 flex-1')}>
        <div className="flex min-w-0 flex-1 flex-col whitespace-nowrap">
          <p className="truncate text-sm leading-5 font-medium">{t.title}</p>
          <p className="truncate text-xs leading-4 text-content-tertiary">{t.place}</p>
        </div>
      </div>
      <div className={cn(cell, 'w-[110px] shrink-0')}>
        <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 text-content-secondary">{t.submitted}</p>
      </div>
      <div className={cn(cell, 'w-[104px] shrink-0')}>
        <PriorityBadge priority={t.priority} />
      </div>
      <div className={cn(cell, 'w-[150px] shrink-0')}>
        <StatusPill status={t.status} />
      </div>
      <div className={cn(cell, 'w-[150px] shrink-0')}>
        {t.assignee ? (
          <>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
              {t.assignee.initials}
            </span>
            <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 font-medium">{t.assignee.name}</p>
          </>
        ) : (
          <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 font-medium text-warning-fg">Unassigned</p>
        )}
      </div>
      <div className={cn(cell, 'w-[150px] shrink-0')}>
        <SlaTimer state={t.slaState} label={t.sla} />
      </div>
      <div className={cn(cell, 'w-[110px] shrink-0')}>
        <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 text-content-secondary">{t.updated}</p>
      </div>
      <div className={cn(cell, 'w-10 shrink-0')}>
        <ChevronRight size={16} className="text-content-tertiary" aria-hidden />
      </div>
    </>
  )
  // Only #1042 has a ticket detail screen in the designs.
  return t.id === '#1042' ? (
    <Link role="row" to={`/branch/tickets/${t.id.slice(1)}`} className={cn(cls, 'transition-colors hover:bg-canvas')}>
      {cells}
    </Link>
  ) : (
    <div role="row" className={cls}>
      {cells}
    </div>
  )
}

/** Table from the Figma branch manager "Tickets" frame. */
export function TicketsTable({
  rows,
  sort,
  onSort,
}: {
  rows: BranchTicket[]
  sort: TicketSort | null
  onSort: (key: TicketSortKey) => void
}) {
  const h = { sort, onSort }
  return (
    <div role="table" aria-label="Tickets">
      <div role="row" className="flex w-full">
        <HeadCell label="Ticket" sortKey="id" className="w-20 shrink-0" {...h} />
        <HeadCell label="Subject" className="min-w-0 flex-1" {...h} />
        <HeadCell label="Submitted" sortKey="submitted" className="w-[110px] shrink-0" {...h} />
        <HeadCell label="Priority" sortKey="priority" className="w-[104px] shrink-0" {...h} />
        <HeadCell label="Status" className="w-[150px] shrink-0" {...h} />
        <HeadCell label="Assigned to" className="w-[150px] shrink-0" {...h} />
        <HeadCell label="SLA" className="w-[150px] shrink-0" {...h} />
        <HeadCell label="Last updated" sortKey="updated" className="w-[110px] shrink-0" {...h} />
        <HeadCell label="" className="w-10 shrink-0" {...h} />
      </div>
      {rows.map((t) => (
        <Row key={t.id} ticket={t} />
      ))}
    </div>
  )
}
