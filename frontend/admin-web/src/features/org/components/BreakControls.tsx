import { Calendar, Check, UserCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, FilterChip } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import { RETURN_DATE_LONG, RETURN_DATE_SHORT, RETURN_TIMES, returnLabel, to24Hour } from '../shift'
import type { Employee } from '../types'

/** What the cells need to know about an employee. */
type ShiftPerson = Pick<Employee, 'id' | 'name' | 'shift' | 'returnAt'>

const firstName = (name: string) => name.split(' ')[0]

const dash = <span className="text-sm leading-5 text-content-tertiary">—</span>

/** Only active employees, and not the Branch Manager, can be sent on a break. */
const canTakeBreak = (employee: ShiftPerson, isManager: boolean) => employee.shift !== null && !isManager

interface ShiftActionCellProps<T extends ShiftPerson> {
  employee: T
  isManager: boolean
  onApprove: (employee: T) => void
}

// "Approve Break" while someone is in shift, a greyed "On break" once approved.
export function ShiftActionCell<T extends ShiftPerson>({ employee, isManager, onApprove }: ShiftActionCellProps<T>) {
  if (!canTakeBreak(employee, isManager)) return dash
  if (employee.shift === 'On Break') {
    return (
      <button
        type="button"
        disabled
        className="h-8 cursor-not-allowed rounded-md bg-muted px-3.25 text-[13px] leading-4.5 font-medium whitespace-nowrap text-content-disabled"
      >
        On break
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onApprove(employee)}
      className="h-8 cursor-pointer rounded-md border border-line bg-surface px-3 text-[13px] leading-4.5 font-medium whitespace-nowrap transition-colors hover:bg-muted"
    >
      Approve Break
    </button>
  )
}

interface BackToShiftCellProps<T extends ShiftPerson> {
  employee: T
  isManager: boolean
  onSchedule: (employee: T, returnAt: string) => void
  onBack: (employee: T) => void
}

// Set the expected return of someone on break, or mark them back in shift.
export function BackToShiftCell<T extends ShiftPerson>({
  employee,
  isManager,
  onSchedule,
  onBack,
}: BackToShiftCellProps<T>) {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState<string | null>(null)
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null)

  if (!canTakeBreak(employee, isManager)) return dash

  const onBreak = employee.shift === 'On Break'

  // Return already set: show it with a button to bring them back now.
  if (onBreak && employee.returnAt) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="flex w-27 min-w-0 flex-col">
          <span className="text-xs leading-4 text-content-secondary">Returns</span>
          <span className="truncate text-xs leading-4.25 font-medium">{employee.returnAt}</span>
        </span>
        <button
          type="button"
          aria-label={`Back to shift now: ${employee.name}`}
          title="Back to shift now"
          onClick={() => onBack(employee)}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line bg-surface transition-colors hover:bg-muted"
        >
          <UserCheck size={16} />
        </button>
      </div>
    )
  }

  const commit = () => {
    if (!time) return
    setOpen(false)
    onSchedule(employee, returnLabel(time))
    setTime(null)
  }
  const cancel = () => {
    setOpen(false)
    setTime(null)
  }

  return (
    <div ref={setAnchor} className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={!onBreak}
        onClick={() => setOpen(true)}
        aria-label={`Set expected return for ${employee.name}`}
        className={cn(
          'flex h-8 w-27 items-center rounded-md border bg-surface text-xs leading-4.25 whitespace-nowrap',
          time ? 'gap-1 px-1.75' : 'gap-1.5 px-2.25',
          onBreak
            ? 'cursor-pointer border-line-strong text-content'
            : 'cursor-not-allowed border-line-subtle text-content-disabled',
        )}
      >
        <Calendar size={time ? 12 : 14} className="shrink-0" />
        {time ? `${RETURN_DATE_SHORT}, ${to24Hour(time)}` : 'Date & time'}
      </button>
      <button
        type="button"
        disabled={!time}
        onClick={commit}
        aria-label={`Confirm return for ${employee.name}`}
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-md border',
          time
            ? 'cursor-pointer border-brand bg-brand text-on-brand hover:bg-brand-hover'
            : 'cursor-not-allowed border-line-subtle text-content-disabled',
        )}
      >
        <Check size={16} />
      </button>

      {open && (
        <ReturnPopover
          anchor={anchor}
          name={employee.name}
          time={time}
          onTime={setTime}
          onCancel={cancel}
          onConfirm={commit}
        />
      )}
    </div>
  )
}

interface ReturnPopoverProps {
  anchor: HTMLElement | null
  name: string
  time: string | null
  onTime: (time: string) => void
  onCancel: () => void
  onConfirm: () => void
}

// "Expected return to shift": pick a time, then confirm. Drawn outside the table so the cells don't clip it.
function ReturnPopover({ anchor, name, time, onTime, onCancel, onConfirm }: ReturnPopoverProps) {
  const popover = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (!popover.current?.contains(target) && !anchor?.contains(target)) onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [anchor, onCancel])

  const rect = anchor?.getBoundingClientRect()
  const style = rect ? { top: rect.bottom + 6, right: window.innerWidth - rect.right - 2 } : undefined

  return createPortal(
    <div
      ref={popover}
      role="dialog"
      aria-label="Expected return to shift"
      style={style}
      className="fixed z-50 flex w-75 flex-col gap-3 rounded-xl border border-line bg-surface p-4 shadow-[0_12px_24px_-4px_rgba(11,19,18,0.1),0_4px_8px_-4px_rgba(11,19,18,0.05)]"
    >
      <h3 className="text-sm leading-5 font-semibold">Expected return to shift</h3>
      <p className="text-[13px] leading-4.5 text-content-secondary">
        {firstName(name)} stays On Break until you mark them back in shift.
      </p>

      <span className="text-[13px] leading-4.5 font-medium">Date</span>
      <div className="flex h-9.25 items-center gap-2 rounded-md border border-brand px-2.75 text-[13px] leading-4.75">
        <Calendar size={16} className="shrink-0" />
        {RETURN_DATE_LONG}
      </div>

      <span className="text-[13px] leading-4.5 font-medium">Time</span>
      <div className="flex flex-wrap gap-1.5">
        {RETURN_TIMES.map((option) => (
          <FilterChip key={option} label={option} selected={option === time} onClick={() => onTime(option)} />
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" disabled={!time} onClick={onConfirm}>
          Confirm return
        </Button>
      </div>
    </div>,
    document.body,
  )
}
