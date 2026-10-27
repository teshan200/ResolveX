import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, PageHeader, Pagination, SearchField, Select } from '../components/ui'
import type { SortState } from '../components/ui'
import { ComplaintsTable } from '../features/complaints/components/ComplaintsTable'
import {
  BRANCH_FILTERS,
  PERIOD_FILTERS,
  PRIORITY_FILTERS,
  STATUS_FILTERS,
} from '../features/complaints/mocks'
import type { ComplaintPeriod } from '../features/complaints/types'
import { EscalationBanner } from '../features/escalation/components/EscalationBanner'
import { downloadCsv, exportFilename, reportToCsv } from '../features/export/csv'
import { listComplaints, listComplaintsForExport } from '../services/complaintService'
import type { ComplaintPage, ComplaintSortKey } from '../services/complaintService'

const PAGE_SIZE = 9

const DEFAULTS = {
  search: '',
  branch: BRANCH_FILTERS[0],
  priority: PRIORITY_FILTERS[0],
  status: STATUS_FILTERS[0],
  period: 'Last 7 days' as ComplaintPeriod,
}

// Tenant Admin's read-only view of every complaint across all branches.
export function ComplaintsOverviewPage() {
  const [data, setData] = useState<ComplaintPage | null>(null)
  const [search, setSearch] = useState(DEFAULTS.search)
  const [branch, setBranch] = useState(DEFAULTS.branch)
  const [priority, setPriority] = useState(DEFAULTS.priority)
  const [status, setStatus] = useState(DEFAULTS.status)
  const [period, setPeriod] = useState<ComplaintPeriod>(DEFAULTS.period)
  const [sort, setSort] = useState<SortState | undefined>()
  const [page, setPage] = useState(1)

  useEffect(() => {
    listComplaints({
      search,
      branch,
      priority,
      status,
      period,
      sort: sort ? { key: sort.key as ComplaintSortKey, direction: sort.direction } : undefined,
      page,
      pageSize: PAGE_SIZE,
    }).then(setData)
  }, [search, branch, priority, status, period, sort, page])

  const changeFilter = <T,>(set: (value: T) => void) => (value: T) => {
    set(value)
    setPage(1)
  }

  const resetFilters = () => {
    setSearch(DEFAULTS.search)
    setBranch(DEFAULTS.branch)
    setPriority(DEFAULTS.priority)
    setStatus(DEFAULTS.status)
    setPeriod(DEFAULTS.period)
    setSort(undefined)
    setPage(1)
  }

  const toggleSort = (key: string) =>
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )

  const exportCsv = async () => {
    const rows = await listComplaintsForExport({ search, branch, priority, status, period })
    downloadCsv(
      exportFilename('Complaints overview'),
      reportToCsv({
        title: 'Complaints overview',
        meta: [
          ['Branch', branch],
          ['Priority', priority],
          ['Status', status],
          ['Period', period],
          ['Search', search.trim() || '—'],
        ],
        sections: [
          {
            title: 'Complaints',
            columns: ['Ticket', 'Subject', 'Service point', 'Branch', 'Priority', 'Status', 'Assigned to', 'Created', 'Last updated'],
            rows: rows.map((r) => [
              r.id,
              r.subject,
              r.servicePoint,
              r.branch,
              r.priority,
              r.status,
              r.assignee?.name ?? 'Not assigned yet',
              r.created,
              r.updated,
            ]),
          },
        ],
      }),
    )
  }

  const rows = data?.items ?? []
  const total = data?.total ?? 0
  const start = (page - 1) * PAGE_SIZE + 1
  const summary = rows.length
    ? `Showing ${start}–${start + rows.length - 1} of ${total.toLocaleString('en-US')} ${total === 1 ? 'complaint' : 'complaints'}`
    : 'No complaints to show'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Complaints overview"
        description="Every complaint across your 32 branches, in one read-only view."
        actions={
          <Button variant="outline" className="font-semibold!" onClick={exportCsv}>
            <Download size={18} />
            Export CSV
          </Button>
        }
      />

      <EscalationBanner
        title="View only"
        description="Complaints are assigned, prioritised and resolved by each branch’s Branch Manager and staff. You can follow progress here; escalations to you appear in “Escalated to me”."
      />

      <div className="my-7.5 flex items-center gap-3">
        <SearchField
          className="w-70"
          placeholder="Search ticket ID or subject…"
          value={search}
          onChange={(event) => changeFilter(setSearch)(event.target.value)}
        />
        <div className="w-42.5">
          <Select
            aria-label="Filter by branch"
            options={BRANCH_FILTERS}
            value={branch}
            onChange={(event) => changeFilter(setBranch)(event.target.value)}
          />
        </div>
        <div className="w-37.5">
          <Select
            aria-label="Filter by priority"
            options={PRIORITY_FILTERS}
            value={priority}
            onChange={(event) => changeFilter(setPriority)(event.target.value)}
          />
        </div>
        <div className="w-37.5">
          <Select
            aria-label="Filter by status"
            options={STATUS_FILTERS}
            value={status}
            onChange={(event) => changeFilter(setStatus)(event.target.value)}
          />
        </div>
        <div className="w-37.5">
          <Select
            aria-label="Filter by period"
            options={PERIOD_FILTERS}
            value={period}
            onChange={(event) => changeFilter(setPeriod)(event.target.value as ComplaintPeriod)}
          />
        </div>
        <Button variant="ghost" className="ml-auto font-semibold!" onClick={resetFilters}>
          Reset filters
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <ComplaintsTable rows={rows} loading={data === null} sort={sort} onSort={toggleSort} />
        <div className="px-5 py-3">
          <Pagination summary={summary} page={page} pageCount={data?.pageCount ?? 1} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
