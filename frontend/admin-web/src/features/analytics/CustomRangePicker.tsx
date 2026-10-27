import { Calendar } from 'lucide-react'
import { useId, useState } from 'react'
import { Button } from '../../components/ui'
import { cn } from '../../components/ui/cn'
import { dayCount, rangeLabel, toDate } from '../../services/analyticsService'
import type { CustomRange } from '../../types/analytics'

const MAX_DAYS = 90
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatDate = (iso: string) => {
  if (!iso) return 'Select a date'
  const date = toDate(iso)
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

interface DateFieldProps {
  label: string
  value: string
  invalid?: boolean
  onChange: (value: string) => void
}

function DateField({ label, value, invalid = false, onChange }: DateFieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] leading-4 font-medium">
        {label}
      </label>
      <div
        className={cn(
          'relative flex h-10 w-39 items-center justify-between rounded-md border bg-surface px-3 text-sm leading-[17px] focus-within:border-line-focus',
          invalid ? 'border-[1.5px] border-danger-solid' : 'border-line',
        )}
      >
        <span>{formatDate(value)}</span>
        <Calendar size={16} className="text-neutral-700" />
        <input
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={(event) => event.currentTarget.showPicker?.()}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}

interface CustomRangePickerProps {
  value: CustomRange
  onApply: (range: CustomRange) => void
  onCancel: () => void
}

export function CustomRangePicker({ value, onApply, onCancel }: CustomRangePickerProps) {
  const [start, setStart] = useState(value.start)
  const [end, setEnd] = useState(value.end)

  const days = start && end ? dayCount(toDate(start), toDate(end)) : 0
  const error =
    !start || !end
      ? 'Choose both a start and an end date.'
      : days < 1
        ? 'End date must be on or after the start date.'
        : days > MAX_DAYS
          ? `Choose a range of up to ${MAX_DAYS} days.`
          : null

  return (
    <div
      role="dialog"
      aria-label="Custom range"
      className="flex w-96 flex-col gap-4 rounded-xl border border-line bg-surface p-6 shadow-[0_12px_24px_-4px_rgba(11,19,18,0.1),0_4px_8px_-4px_rgba(11,19,18,0.05)]"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-base leading-[19px] font-semibold">Custom range</h2>
        <p className="text-xs leading-[15px] text-content-secondary">
          Choose a start and end date (up to {MAX_DAYS} days).
        </p>
      </div>
      <div className="flex gap-6">
        <DateField label="Start date" value={start} onChange={setStart} />
        <DateField label="End date" value={end} invalid={days < 1 && Boolean(start && end)} onChange={setEnd} />
      </div>
      {error ? (
        <p className="text-xs leading-[15px] text-danger-solid">{error}</p>
      ) : (
        <p className="text-xs leading-[15px] text-content-secondary">
          {days} {days === 1 ? 'day' : 'days'} selected · {rangeLabel(toDate(start), toDate(end), true)}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" disabled={Boolean(error)} onClick={() => onApply({ start, end })}>
          Apply range
        </Button>
      </div>
    </div>
  )
}
