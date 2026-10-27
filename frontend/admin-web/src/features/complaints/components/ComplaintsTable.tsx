import { ChevronRight } from 'lucide-react'
import { Table } from '../../../components/ui'
import type { Column, SortState } from '../../../components/ui'
import { PriorityBadge, StatusBadge } from '../../../components/ui/StatusBadge'
import type { ComplaintRow } from '../types'

const columns: Column<ComplaintRow>[] = [
  {
    key: 'id',
    header: 'Ticket',
    width: 90,
    sortable: true,
    render: (row) => <span className="truncate font-mono text-sm leading-5 font-medium">{row.id}</span>,
  },
  {
    key: 'subject',
    header: 'Subject',
    width: 192,
    render: (row) => (
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm leading-5 font-medium">{row.subject}</span>
        <span className="truncate text-xs leading-4 text-content-tertiary">{row.servicePoint}</span>
      </span>
    ),
  },
  {
    key: 'branch',
    header: 'Branch',
    width: 110,
    render: (row) => <span className="truncate text-sm leading-5">{row.branch}</span>,
  },
  {
    key: 'priority',
    header: 'Priority',
    width: 110,
    sortable: true,
    render: (row) => <PriorityBadge priority={row.priority} />,
  },
  {
    key: 'status',
    header: 'Status',
    width: 160,
    render: (row) => <StatusBadge status={row.status} size="sm" />,
  },
  {
    key: 'assignee',
    header: 'Assigned to',
    width: 170,
    render: (row) =>
      row.assignee ? (
        <>
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-muted text-[10px] leading-4 font-semibold text-content-brand">
            {row.assignee.initials}
          </span>
          <span className="truncate text-[13px] leading-4.5">{row.assignee.name}</span>
        </>
      ) : (
        <span className="truncate text-[13px] leading-4.5 text-content-tertiary">Not assigned yet</span>
      ),
  },
  {
    key: 'created',
    header: 'Created',
    width: 110,
    sortable: true,
    render: (row) => <span className="truncate text-[13px] leading-4.5 text-content-secondary">{row.created}</span>,
  },
  {
    key: 'updated',
    header: 'Last updated',
    width: 120,
    sortable: true,
    render: (row) => <span className="truncate text-[13px] leading-4.5 text-content-secondary">{row.updated}</span>,
  },
  {
    key: 'open',
    header: '',
    width: 48,
    render: () => <ChevronRight size={16} className="text-content-tertiary" aria-hidden />,
  },
]

interface ComplaintsTableProps {
  rows: ComplaintRow[]
  loading: boolean
  sort: SortState | undefined
  onSort: (key: string) => void
}

// Read-only list of every complaint. A row opens the complaint detail.
export function ComplaintsTable({ rows, loading, sort, onSort }: ComplaintsTableProps) {
  return (
    <Table
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      rowHref={(row) => `/tenant/complaints/${row.id.slice(1)}`}
      rowHeight={56}
      sort={sort}
      onSort={onSort}
      empty={
        <p className="px-4 py-10 text-center text-sm leading-5 text-content-secondary">
          {loading ? 'Loading complaints…' : 'No complaints match these filters.'}
        </p>
      }
    />
  )
}
