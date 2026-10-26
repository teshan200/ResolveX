import { Check, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { cn } from '../../components/ui/cn'
import { DetailPanel } from '../escalation/components/DetailPanel'
import { ticket1042 } from './mocks'

/** "Assignment & priority" panel from the Figma branch ticket detail frame. Save does nothing yet. */
export function AssignmentPanel() {
  const [priority, setPriority] = useState<string>('High')
  return (
    <DetailPanel icon={UserCheck} title="Assignment & priority">
      <div className="flex flex-col gap-1.5">
        <p className="text-[13px] leading-4.5 font-medium">Priority</p>
        <div role="radiogroup" aria-label="Priority" className="flex gap-1 rounded-md bg-muted p-1">
          {ticket1042.priorities.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={priority === p}
              onClick={() => setPriority(p)}
              className={cn(
                'flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-[13px] leading-4.5 font-medium',
                priority === p
                  ? 'bg-surface text-content shadow-[0_1px_1px_rgba(11,19,18,0.04),0_1px_1.5px_rgba(11,19,18,0.08)]'
                  : 'text-content-secondary',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <Select label="Designation" options={ticket1042.designations} defaultValue="Waiter / Waitress" />
      <Select label="Employee at Colombo Branch" options={ticket1042.employees} defaultValue="Dinesh Kumara" />
      <div className="flex items-center gap-3 rounded-md bg-brand-subtle p-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
          DK
        </span>
        <div className="flex min-w-0 flex-1 flex-col whitespace-nowrap">
          <p className="text-[13px] leading-4.5 font-semibold">Dinesh Kumara</p>
          <p className="text-xs leading-4 text-content-secondary">Waiter / Waitress · Level 1</p>
        </div>
      </div>
      <Button className="w-full font-semibold!">
        <Check size={18} aria-hidden />
        Save changes
      </Button>
    </DetailPanel>
  )
}
