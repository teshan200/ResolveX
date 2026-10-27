import { CirclePause, UserCheck } from 'lucide-react'
import type { ShiftStatus } from '../types'

// "In Shift" (green) or "On Break" (blue).
export function ShiftStatusChip({ shift }: { shift: ShiftStatus | null }) {
  if (shift === null) return <span className="text-sm leading-5 text-content-tertiary">—</span>
  const onBreak = shift === 'On Break'
  const Icon = onBreak ? CirclePause : UserCheck
  return (
    <span
      className={`inline-flex h-5.5 items-center gap-1 rounded-xs px-2 text-xs leading-4 font-medium whitespace-nowrap ${
        onBreak ? 'bg-info-bg text-info-fg' : 'bg-success-bg text-success-fg'
      }`}
    >
      <Icon size={12} />
      {shift}
    </span>
  )
}
