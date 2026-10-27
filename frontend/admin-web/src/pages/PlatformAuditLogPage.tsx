import { ChevronRight, Download } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Button,
  FilterChip,
  IconButton,
  PageHeader,
  Pagination,
  SearchField,
  Table,
  Tag,
} from '../components/ui'
import type { Column } from '../components/ui'
import { getAuditLog } from '../services/platformService'
import type { AuditCategory, AuditEvent, AuditLogData } from '../types/platform'

type AuditFilter = 'All' | AuditCategory

// Each chip shows a plural label and filters on one event category.
const FILTERS: { label: string; category: AuditFilter }[] = [
  { label: 'All', category: 'All' },
  { label: 'Tenant activation', category: 'Activation' },
  { label: 'Plan changes', category: 'Plan change' },
  { label: 'Grace periods', category: 'Grace period' },
  { label: 'Suspensions', category: 'Suspension' },
]
const PAGE_SIZE = 10

const columns: Column<AuditEvent>[] = [
  {
    key: 'time',
    header: 'Time',
    width: 170,
    render: (event) => (
      <span className="truncate font-mono text-xs leading-4 font-medium text-content-secondary">
        {event.time}
      </span>
    ),
  },
  {
    key: 'actor',
    header: 'Actor',
    width: 170,
    render: (event) => (
      <>
        <Avatar initials={event.actorInitials} size="sm" />
        <span className="truncate text-sm leading-5 font-medium">{event.actorName}</span>
      </>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    render: (event) => (
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm leading-5 font-medium">{event.action}</span>
        <span className="truncate text-xs leading-4 text-content-tertiary">{event.detail}</span>
      </span>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    width: 160,
    render: (event) => <Tag tone={event.categoryTone}>{event.category}</Tag>,
  },
  {
    key: 'target',
    header: 'Target',
    width: 150,
    render: (event) => (
      <span className="truncate font-mono text-xs leading-4 font-medium">{event.target}</span>
    ),
  },
  {
    key: 'open',
    header: '',
    width: 52,
    render: (event) => <IconButton icon={ChevronRight} label={`Open ${event.action}`} size="sm" />,
  },
]

export function PlatformAuditLogPage() {
  const [data, setData] = useState<AuditLogData | null>(null)
  const [filter, setFilter] = useState<AuditFilter>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    getAuditLog().then(setData)
  }, [])

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (data?.events ?? []).filter(
      (event) =>
        (filter === 'All' || event.category === filter) &&
        (!query ||
          [event.action, event.detail, event.actorName, event.target].some((value) =>
            value.toLowerCase().includes(query),
          )),
    )
  }, [data, filter, search])

  const filtered = filter !== 'All' || search.trim() !== ''
  const total = filtered ? rows.length : (data?.total ?? 0)
  const start = (page - 1) * PAGE_SIZE + 1
  const summary = rows.length
    ? `Showing ${start}–${start + rows.length - 1} of ${total.toLocaleString('en-US')} ${total === 1 ? 'event' : 'events'}`
    : 'No events to show'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Platform audit log"
        description="Tenant activations, subscription plan changes, grace period extensions and tenant suspensions."
        actions={
          <Button variant="outline" className="font-semibold!">
            <Download size={18} />
            Export
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 gap-2">
          {FILTERS.map((item) => (
            <FilterChip
              key={item.label}
              label={item.label}
              selected={filter === item.category}
              onClick={() => {
                setFilter(item.category)
                setPage(1)
              }}
            />
          ))}
        </div>
        <SearchField
          className="w-65"
          placeholder="Search tickets, cases, branches…"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <Table
          columns={columns}
          rows={rows}
          rowKey={(event) => event.id}
          rowHeight={56}
          empty={
            <p className="px-4 py-10 text-center text-sm leading-5 text-content-secondary">
              {data ? 'No events match these filters.' : 'Loading events…'}
            </p>
          }
        />
        <div className="px-5 py-3">
          <Pagination
            summary={summary}
            page={page}
            pageCount={data?.pageCount ?? 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
