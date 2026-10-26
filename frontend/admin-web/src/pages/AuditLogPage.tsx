import { ChevronRight, Download } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import type { Column, TagTone } from '../components/ui'
import { AUDIT_CATEGORIES } from '../features/audit/mocks'
import type { AuditCategory, AuditEvent } from '../features/audit/types'
import { downloadCsv, exportFilename, reportToCsv } from '../features/export/csv'
import { listAuditEvents, listAuditEventsForExport } from '../services/auditService'
import type { AuditPage } from '../services/auditService'

type CategoryFilter = 'All' | AuditCategory

const FILTERS: CategoryFilter[] = ['All', ...AUDIT_CATEGORIES]
const PAGE_SIZE = 8

const categoryTones: Record<AuditCategory, TagTone> = {
  Authentication: 'neutral',
  'Branches & staff': 'brand',
  Subscription: 'info',
  Tickets: 'neutral',
  Escalations: 'neutral',
  Cases: 'brand',
  'AI overrides': 'info',
  Admin: 'neutral',
}

const columns: Column<AuditEvent>[] = [
  {
    key: 'time',
    header: 'Time',
    width: 170,
    render: (event) => (
      <span className="truncate font-mono text-xs leading-4 font-medium text-content-secondary">{event.time}</span>
    ),
  },
  {
    key: 'actor',
    header: 'Actor',
    width: 190,
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
    width: 150,
    render: (event) => <Tag tone={categoryTones[event.category]}>{event.category}</Tag>,
  },
  {
    key: 'target',
    header: 'Target',
    width: 150,
    render: (event) => <span className="truncate font-mono text-xs leading-4 font-medium">{event.target}</span>,
  },
  {
    key: 'source',
    header: 'Source',
    width: 150,
    render: (event) => (
      <span className="truncate text-[13px] leading-4.5 text-content-secondary">{event.source}</span>
    ),
  },
  {
    key: 'open',
    header: '',
    width: 52,
    render: (event) => <IconButton icon={ChevronRight} label={`Open ${event.action}`} size="sm" />,
  },
]

// Every sign-in, permission change, override and admin action in the company, newest first.
export function AuditLogPage() {
  const [data, setData] = useState<AuditPage | null>(null)
  const [category, setCategory] = useState<CategoryFilter>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    listAuditEvents({ category, search, page, pageSize: PAGE_SIZE }).then(setData)
  }, [category, search, page])

  const exportCsv = async () => {
    const events = await listAuditEventsForExport({ category, search })
    downloadCsv(
      exportFilename('Audit log'),
      reportToCsv({
        title: 'Audit log',
        meta: [
          ['Category', category],
          ['Search', search.trim() || '—'],
        ],
        sections: [
          {
            title: 'Events',
            columns: ['Time', 'Actor', 'Action', 'Details', 'Category', 'Target', 'Source'],
            rows: events.map((e) => [e.time, e.actorName, e.action, e.detail, e.category, e.target, e.source]),
          },
        ],
      }),
    )
  }

  const rows = data?.items ?? []
  const total = data?.total ?? 0
  const start = (page - 1) * PAGE_SIZE + 1
  const unfiltered = category === 'All' && !search.trim()
  const summary = rows.length
    ? `Showing ${start}–${start + rows.length - 1} of ${total.toLocaleString('en-US')} ${total === 1 ? 'event' : 'events'}${unfiltered ? ' · retained 3 years' : ''}`
    : 'No events to show'

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Audit log"
        description="Every sign-in, permission change, override and admin action — tamper-evident and exportable."
        actions={
          <Button variant="outline" className="font-semibold!" onClick={exportCsv}>
            <Download size={18} />
            Export CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            {FILTERS.map((item) => (
              <FilterChip
                key={item}
                label={item}
                selected={category === item}
                onClick={() => {
                  setCategory(item)
                  setPage(1)
                }}
              />
            ))}
          </div>
          <SearchField
            className="w-65"
            placeholder="Search actor, action or target…"
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
            <Pagination summary={summary} page={page} pageCount={data?.pageCount ?? 1} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  )
}
