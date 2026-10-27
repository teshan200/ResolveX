import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Button, Pagination, SearchField, Select } from '../components/ui'
import { EscalationStatusChips } from '../features/escalation/components/EscalationStatusChips'
import { downloadCsv, exportFilename, reportToCsv } from '../features/export/csv'
import {
  assignedOptions,
  chipCounts,
  pageCount,
  priorityOptions,
  priorityRank,
  rangeOptions,
  slaOptions,
  statusOptions,
  ticketChips,
  tickets,
  totalTickets,
} from '../features/branch-tickets/mocks'
import type { BranchTicket, TicketChip } from '../features/branch-tickets/mocks'
import { TicketsTable } from '../features/branch-tickets/TicketsTable'
import type { TicketSort, TicketSortKey } from '../features/branch-tickets/TicketsTable'

const defaults = {
  search: '',
  status: statusOptions[0],
  priority: priorityOptions[0],
  assigned: assignedOptions[0],
  sla: slaOptions[0],
  range: rangeOptions[0],
}

const matchesChip = (t: BranchTicket, chip: TicketChip) => {
  switch (chip) {
    case 'new':
      return t.status === 'New'
    case 'active':
      return ['New', 'Assigned', 'Claimed', 'In Progress', 'Reopened'].includes(t.status)
    case 'overdue':
      return t.slaState === 'breached'
    case 'escalated':
      return t.status === 'Escalated'
    case 'closed':
      return t.status === 'Closed' || t.status === 'Resolved'
    default:
      return true
  }
}

const matchesSla = (t: BranchTicket, value: string) =>
  value === slaOptions[0] ||
  (value === 'On track' && t.slaState === 'on-track') ||
  (value === 'At risk' && t.slaState === 'warning') ||
  (value === 'Breached' && t.slaState === 'breached') ||
  (value === 'Met' && t.slaState === 'paused' && t.sla.startsWith('Met'))

/** Branch manager "Tickets" tab (Figma node 267:4903). Sample data only. */
export function BranchTicketsPage() {
  const [filters, setFilters] = useState(defaults)
  const [chip, setChip] = useState<TicketChip>('all')
  const [sort, setSort] = useState<TicketSort | null>(null)
  const [page, setPage] = useState(1)

  const set = (key: keyof typeof defaults, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }))
    setPage(1)
  }
  const filtered = chip !== 'all' || JSON.stringify(filters) !== JSON.stringify(defaults)

  const rows = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    const list = tickets.filter(
      (t) =>
        matchesChip(t, chip) &&
        (!q || t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)) &&
        (filters.status === defaults.status || t.status === filters.status) &&
        (filters.priority === defaults.priority || t.priority === filters.priority) &&
        (filters.assigned === defaults.assigned ||
          (filters.assigned === 'Unassigned' ? !t.assignee : t.assignee?.name === filters.assigned)) &&
        matchesSla(t, filters.sla),
    )
    if (!sort) return list
    const value = (t: BranchTicket) =>
      sort.key === 'id'
        ? Number(t.id.slice(1))
        : sort.key === 'priority'
          ? priorityRank[t.priority]
          : sort.key === 'submitted'
            ? t.submittedOrder
            : t.updatedOrder
    return [...list].sort((a, b) => (sort.direction === 'asc' ? 1 : -1) * (value(a) - value(b)))
  }, [filters, chip, sort])

  const onSort = (key: TicketSortKey) =>
    setSort((s) => (s?.key === key && s.direction === 'asc' ? { key, direction: 'desc' } : { key, direction: 'asc' }))

  const exportCsv = () =>
    downloadCsv(
      exportFilename('Colombo Branch tickets'),
      reportToCsv({
        title: 'Colombo Branch tickets',
        meta: [['Exported', new Date().toLocaleString('en-GB')]],
        sections: [
          {
            title: 'Tickets',
            columns: ['Ticket', 'Subject', 'Place', 'Submitted', 'Priority', 'Status', 'Assigned to', 'SLA', 'Last updated'],
            rows: rows.map((t) => [t.id, t.title, t.place, t.submitted, t.priority, t.status, t.assignee?.name ?? 'Unassigned', t.sla, t.updated]),
          },
        ],
      }),
    )

  const summary = filtered
    ? `Showing ${rows.length ? `1–${rows.length}` : '0'} of ${rows.length} Colombo Branch tickets`
    : `Showing 1–${rows.length} of ${totalTickets} Colombo Branch tickets`

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Tickets</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Every complaint at Colombo Branch — from just submitted to closed.
          </p>
        </div>
        <Button variant="outline" className="font-semibold!" onClick={exportCsv}>
          <Download size={18} aria-hidden />
          Export CSV
        </Button>
      </header>

      <EscalationStatusChips
        label="Ticket status"
        chips={ticketChips}
        selected={chip}
        counts={chipCounts}
        onSelect={(c) => {
          setChip(c)
          setPage(1)
        }}
      />

      <div className="flex items-center gap-3">
        <SearchField
          className="w-[250px]"
          placeholder="Search ticket ID or subject…"
          aria-label="Search tickets"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
        />
        <div className="w-[140px]">
          <Select aria-label="Status" options={statusOptions} value={filters.status} onChange={(e) => set('status', e.target.value)} />
        </div>
        <div className="w-[140px]">
          <Select aria-label="Priority" options={priorityOptions} value={filters.priority} onChange={(e) => set('priority', e.target.value)} />
        </div>
        <div className="w-[170px]">
          <Select aria-label="Assigned to" options={assignedOptions} value={filters.assigned} onChange={(e) => set('assigned', e.target.value)} />
        </div>
        <div className="w-[130px]">
          <Select aria-label="SLA" options={slaOptions} value={filters.sla} onChange={(e) => set('sla', e.target.value)} />
        </div>
        <div className="w-[150px]">
          <Select aria-label="Date range" options={rangeOptions} value={filters.range} onChange={(e) => set('range', e.target.value)} />
        </div>
      </div>

      <section className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
        <TicketsTable rows={rows} sort={sort} onSort={onSort} />
        {rows.length === 0 && (
          <p className="px-5 py-10 text-center text-sm leading-5 text-content-secondary">No tickets match these filters.</p>
        )}
        <div className="px-5 py-3">
          <Pagination summary={summary} page={page} pageCount={filtered ? 1 : pageCount} onPageChange={setPage} />
        </div>
      </section>
    </div>
  )
}
