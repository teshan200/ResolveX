import { Search } from 'lucide-react'
import { Input, Select } from '../../../components/ui'
import { branchOptions, dateOptions, priorityOptions, statusOptions } from '../mocks'
import type { EscalationFilters } from '../types'

interface EscalationFilterBarProps {
  filters: EscalationFilters
  onChange: (next: EscalationFilters) => void
}

/** Search and dropdown filters, laid out with the widths from the Figma frame. */
export function EscalationFilterBar({ filters, onChange }: EscalationFilterBarProps) {
  const set = <K extends keyof EscalationFilters>(key: K, value: EscalationFilters[K]) =>
    onChange({ ...filters, [key]: value })
  const dateLabel = dateOptions.find((o) => o.days === filters.days)?.label

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-[280px]">
        <Input
          type="search"
          aria-label="Search escalations"
          placeholder="Search ticket, subject or manager…"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          leadingIcon={<Search size={18} className="shrink-0" aria-hidden />}
          trailing={
            <kbd className="rounded-xs bg-muted px-1.5 font-sans text-xs leading-4 font-medium text-content-tertiary">
              ⌘K
            </kbd>
          }
        />
      </div>
      <div className="w-[170px]">
        <Select
          aria-label="Branch"
          options={branchOptions}
          value={filters.branch}
          onChange={(e) => set('branch', e.target.value)}
        />
      </div>
      <div className="w-[150px]">
        <Select
          aria-label="Priority"
          options={priorityOptions}
          value={filters.priority}
          onChange={(e) => set('priority', e.target.value)}
        />
      </div>
      <div className="w-[150px]">
        <Select
          aria-label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(e) => set('status', e.target.value)}
        />
      </div>
      <div className="w-[210px]">
        <Select
          aria-label="Escalated within"
          options={dateOptions.map((o) => o.label)}
          value={dateLabel}
          onChange={(e) =>
            set('days', dateOptions.find((o) => o.label === e.target.value)?.days ?? 30)
          }
        />
      </div>
    </div>
  )
}
