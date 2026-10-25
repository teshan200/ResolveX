import { Button, Select } from '../../../components/ui'
import {
  branchOptions,
  categoryOptions,
  defaultAnalyticsFilters,
  periodOptions,
  priorityOptions,
} from '../mocks'
import type { AnalyticsFilters } from '../mocks'

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilters
  onChange: (next: AnalyticsFilters) => void
}

/** Four filters and Reset, at the widths used in the Figma Analytics frame. */
export function AnalyticsFilterBar({ filters, onChange }: AnalyticsFilterBarProps) {
  const set = (key: keyof AnalyticsFilters, value: string) => onChange({ ...filters, [key]: value })

  return (
    <div className="flex min-h-25 flex-wrap items-start gap-3">
      <div className="w-[260px]">
        <Select
          aria-label="Period"
          options={periodOptions}
          value={filters.period}
          onChange={(e) => set('period', e.target.value)}
        />
      </div>
      <div className="w-[180px]">
        <Select
          aria-label="Branch"
          options={branchOptions}
          value={filters.branch}
          onChange={(e) => set('branch', e.target.value)}
        />
      </div>
      <div className="w-[180px]">
        <Select
          aria-label="Category"
          options={categoryOptions}
          value={filters.category}
          onChange={(e) => set('category', e.target.value)}
        />
      </div>
      <div className="w-[160px]">
        <Select
          aria-label="Priority"
          options={priorityOptions}
          value={filters.priority}
          onChange={(e) => set('priority', e.target.value)}
        />
      </div>
      <div className="min-w-0 flex-1" aria-hidden />
      <Button
        variant="ghost"
        className="font-semibold! text-content-secondary!"
        onClick={() => onChange(defaultAnalyticsFilters)}
      >
        Reset
      </Button>
    </div>
  )
}
