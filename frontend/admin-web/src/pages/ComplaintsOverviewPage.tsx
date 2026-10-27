import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Button, Pagination, SearchField, Select } from '../components/ui'
import { ComplaintsTable } from '../features/complaints/ComplaintsTable'
import type { ComplaintSortKey } from '../features/complaints/ComplaintsTable'
import {
  branchOptions,
  complaints,
  pageCount,
  priorityOptions,
  priorityRank,
  rangeOptions,
  statusOptions,
  totalComplaints,
} from '../features/complaints/mocks'
import { EscalationBanner } from '../features/escalation/components/EscalationBanner'
import { downloadCsv, exportFilename, reportToCsv } from '../features/export/csv'

const defaults = {
  search: '',
  branch: branchOptions[0],
  priority: priorityOptions[0],
  status: statusOptions[0],
  range: rangeOptions[0],
}

/** Tenant admin "Complaints overview" tab (Figma node 38:844). Read-only, sample data. */
export function ComplaintsOverviewPage() {
  const [filters, setFilters] = useState(defaults)
  const [sort, setSort] = useState<{ key: ComplaintSortKey; direction: 'asc' | 'desc' } | null>(null)
  const [page, setPage] = useState(1)

  const set = (key: keyof typeof defaults, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }))
    setPage(1)
  }
  const filtered = JSON.stringify(filters) !== JSON.stringify(defaults)

  const rows = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    const list = complaints.filter(
      (c) =>
        (!q || c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)) &&
        (filters.branch === defaults.branch || c.branch === filters.branch) &&
        (filters.priority === defaults.priority || c.priority === filters.priority) &&
        (filters.status === defaults.status || c.status === filters.status),
    )
    if (!sort) return list
    const value = (c: (typeof complaints)[number]) =>
      sort.key === 'id'
        ? Number(c.id.slice(1))
        : sort.key === 'priority'
          ? priorityRank[c.priority]
          : sort.key === 'created'
            ? c.createdOrder
            : c.updatedOrder
    return [...list].sort((a, b) => (sort.direction === 'asc' ? 1 : -1) * (value(a) - value(b)))
  }, [filters, sort])

  const onSort = (key: ComplaintSortKey) =>
    setSort((s) => (s?.key === key && s.direction === 'asc' ? { key, direction: 'desc' } : { key, direction: 'asc' }))

  const exportCsv = () =>
    downloadCsv(
      exportFilename('Complaints overview'),
      reportToCsv({
        title: 'Complaints overview',
        meta: [['Exported', new Date().toLocaleString('en-GB')]],
        sections: [
          {
            title: 'Complaints',
            columns: ['Ticket', 'Subject', 'Place', 'Branch', 'Priority', 'Status', 'Assigned to', 'Created', 'Last updated'],
            rows: rows.map((c) => [c.id, c.title, c.place, c.branch, c.priority, c.status, c.assignee?.name ?? 'Not assigned yet', c.created, c.updated]),
          },
        ],
      }),
    )

  const summary = filtered
    ? `Showing ${rows.length ? `1–${rows.length}` : '0'} of ${rows.length} complaints`
    : `Showing 1–${rows.length} of ${totalComplaints} complaints`

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Complaints overview</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Every complaint across your 32 branches, in one read-only view.
          </p>
        </div>
        <Button variant="outline" className="font-semibold!" onClick={exportCsv}>
          <Download size={18} aria-hidden />
          Export CSV
        </Button>
      </header>

      <EscalationBanner
        title="View only"
        description="Complaints are assigned, prioritised and resolved by each branch’s Branch Manager and staff. You can follow progress here; escalations to you appear in “Escalated to me”."
      />

      <div className="flex items-center gap-3">
        <SearchField
          className="w-[280px]"
          placeholder="Search ticket ID or subject…"
          aria-label="Search complaints"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
        />
        <div className="w-[170px]">
          <Select aria-label="Branch" options={branchOptions} value={filters.branch} onChange={(e) => set('branch', e.target.value)} />
        </div>
        <div className="w-[150px]">
          <Select aria-label="Priority" options={priorityOptions} value={filters.priority} onChange={(e) => set('priority', e.target.value)} />
        </div>
        <div className="w-[150px]">
          <Select aria-label="Status" options={statusOptions} value={filters.status} onChange={(e) => set('status', e.target.value)} />
        </div>
        <div className="w-[150px]">
          <Select aria-label="Date range" options={rangeOptions} value={filters.range} onChange={(e) => set('range', e.target.value)} />
        </div>
        <div className="min-w-0 flex-1" aria-hidden />
        <Button
          variant="ghost"
          className="font-semibold! text-content-secondary!"
          onClick={() => {
            setFilters(defaults)
            setPage(1)
          }}
        >
          Reset filters
        </Button>
      </div>

      <section className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
        <ComplaintsTable rows={rows} sort={sort} onSort={onSort} />
        {rows.length === 0 && (
          <p className="px-5 py-10 text-center text-sm leading-5 text-content-secondary">
            No complaints match these filters.
          </p>
        )}
        <div className="px-5 py-3">
          <Pagination summary={summary} page={page} pageCount={filtered ? 1 : pageCount} onPageChange={setPage} />
        </div>
      </section>
    </div>
  )
}
