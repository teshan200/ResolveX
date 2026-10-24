import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Input, PriorityBadge } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import { slaDetailPath } from '../sla'
import {
  emptyFilters,
  hasActiveFilters,
  priorities,
  selectRows,
  slaStatuses,
} from '../tableState'
import type { SlaFilters, SortDirection, SortKey } from '../tableState'
import type { SlaComplaint } from '../types'
import { SlaCountdown } from './SlaCountdown'
import { SlaStatusBadge } from './SlaStatusBadge'

interface SlaComplaintTableProps {
  complaints: SlaComplaint[]
  nowMs: number
}

const columns: { key: SortKey; label: string }[] = [
  { key: 'complaint', label: 'Complaint' },
  { key: 'branch', label: 'Branch' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'SLA status' },
  { key: 'remaining', label: 'Time remaining' },
]

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-content">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-line bg-surface px-3 text-sm text-content focus:border-line-focus focus:outline-2 focus:outline-line-focus/30"
      >
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

export function SlaComplaintTable({ complaints, nowMs }: SlaComplaintTableProps) {
  const [filters, setFilters] = useState<SlaFilters>(emptyFilters)
  const [sortKey, setSortKey] = useState<SortKey>('remaining')
  const [direction, setDirection] = useState<SortDirection>('asc')

  const branches = useMemo(
    () => [...new Set(complaints.map((c) => c.branch))].sort(),
    [complaints],
  )
  const rows = selectRows(complaints, nowMs, filters, sortKey, direction)
  const filtered = hasActiveFilters(filters)

  const update = <K extends keyof SlaFilters>(key: K, value: SlaFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }))

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setDirection('asc')
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-0">
      <div className="flex flex-wrap items-end gap-3 border-b border-line p-4 [&>*]:min-w-36 [&>*]:flex-1">
        <Input
          className="w-full"
          label="Search"
          type="search"
          placeholder="ID, title, customer or assignee"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
        />
        <FilterSelect
          label="SLA status"
          value={filters.status}
          onChange={(v) => update('status', v as SlaFilters['status'])}
          options={slaStatuses}
        />
        <FilterSelect
          label="Priority"
          value={filters.priority}
          onChange={(v) => update('priority', v as SlaFilters['priority'])}
          options={priorities}
        />
        <FilterSelect
          label="Branch"
          value={filters.branch}
          onChange={(v) => update('branch', v)}
          options={branches}
        />
        <Button
          variant="outline"
          className="min-w-0! flex-none!"
          disabled={!filtered} onClick={() => setFilters(emptyFilters)}>
          Clear filters
        </Button>
      </div>

      <p role="status" className="px-4 text-sm text-content-secondary">
        Showing {rows.length} of {complaints.length} complaints
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <caption className="sr-only">Complaints with SLA status and time remaining</caption>
          <thead className="border-y border-line bg-canvas text-xs text-content-secondary">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={
                    sortKey === c.key ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'
                  }
                  className="px-4 py-2.5 font-medium"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(c.key)}
                    className="inline-flex cursor-pointer items-center gap-1 font-medium hover:text-content focus-visible:outline-2 focus-visible:outline-line-focus"
                  >
                    {c.label}
                    <span aria-hidden="true" className={cn(sortKey === c.key ? 'text-content' : 'opacity-30')}>
                      {sortKey === c.key && direction === 'desc' ? '▼' : '▲'}
                    </span>
                  </button>
                </th>
              ))}
              <th scope="col" className="px-4 py-2.5 font-medium">
                Assignee
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ complaint, timing }) => (
              <tr key={complaint.id}>
                <td className="max-w-64 px-4 py-3">
                  <p className="truncate font-medium">
                    <Link
                      to={slaDetailPath(complaint.id)}
                      className="hover:text-content-link hover:underline focus-visible:outline-2 focus-visible:outline-line-focus"
                    >
                      <span className="text-content-tertiary">{complaint.id}</span> {complaint.title}
                    </Link>
                  </p>
                  <p className="truncate text-xs text-content-secondary">{complaint.customer}</p>
                </td>
                <td className="px-4 py-3">{complaint.branch}</td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={complaint.priority} />
                </td>
                <td className="px-4 py-3">
                  <SlaStatusBadge status={timing.status} />
                </td>
                <td className="w-52 px-4 py-3">
                  <SlaCountdown timing={timing} />
                </td>
                <td className="px-4 py-3 text-content-secondary">
                  {complaint.assignee ?? 'Unassigned'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-content-secondary">
            No complaints match these filters.
          </p>
        )}
      </div>
    </Card>
  )
}
