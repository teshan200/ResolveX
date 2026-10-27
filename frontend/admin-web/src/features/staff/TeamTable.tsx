import { CircleCheck, Loader } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../components/ui/cn'
import { staffMembers } from './mocks'
import type { LoadTone, ShiftStatus, StaffMember } from './mocks'

const cols = {
  status: 'w-[140px]',
  workload: 'w-[200px]',
  ack: 'w-[110px]',
  sla: 'w-[110px]',
}

const statusStyle: Record<ShiftStatus, { style: string; icon: LucideIcon }> = {
  'On shift': { style: 'bg-status-resolved-bg text-status-resolved-fg', icon: CircleCheck },
  'On break': { style: 'bg-status-in-progress-bg text-status-in-progress-fg', icon: Loader },
}

const barTone: Record<LoadTone, string> = {
  brand: 'bg-brand',
  warning: 'bg-warning-solid',
  danger: 'bg-danger-solid',
}

function ShiftBadge({ status }: { status: ShiftStatus }) {
  const { style, icon: Icon } = statusStyle[status]
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-full px-2 text-xs leading-4 font-semibold whitespace-nowrap',
        style,
      )}
    >
      <Icon size={12} aria-hidden />
      {status}
    </span>
  )
}

function Load({ member }: { member: StaffMember }) {
  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-label={`${member.name} workload`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={member.loadPercent}
        className="h-2 w-[110px] shrink-0 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn('h-full rounded-full', barTone[member.loadTone])}
          style={{ width: `${member.loadPercent}%` }}
        />
      </div>
      <p
        className={cn(
          'text-[13px] leading-4.5 font-medium whitespace-nowrap',
          member.loadTone === 'danger' ? 'text-danger-fg' : 'text-content',
        )}
      >
        {member.open} open
      </p>
    </div>
  )
}

const cell = 'flex h-[60px] items-center gap-2 overflow-hidden px-4'

function TeamRow({ member }: { member: StaffMember }) {
  return (
    <div className="flex border-b border-line-subtle bg-surface">
      <div className={cn(cell, 'min-w-0 flex-1')}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
          {member.initials}
        </span>
        <div className="flex flex-col whitespace-nowrap">
          <p className="text-sm leading-5 font-medium">{member.name}</p>
          <p className="text-xs leading-4 text-content-tertiary">{member.role}</p>
        </div>
      </div>
      <div className={cn(cell, cols.status, 'shrink-0')}>
        <ShiftBadge status={member.status} />
      </div>
      <div className={cn(cell, cols.workload, 'shrink-0')}>
        <Load member={member} />
      </div>
      <div className={cn(cell, cols.ack, 'shrink-0')}>
        <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 text-content-secondary">{member.avgAck}</p>
      </div>
      <div className={cn(cell, cols.sla, 'shrink-0')}>
        <p
          className={cn(
            'min-w-0 flex-1 truncate text-[13px] leading-4.5',
            member.slaTone === 'success' && 'text-success-fg',
            member.slaTone === 'danger' && 'text-danger-fg',
            member.slaTone === 'none' && 'text-content-tertiary',
          )}
        >
          {member.slaMet}
        </p>
      </div>
    </div>
  )
}

const headCell =
  'flex h-10 items-center gap-1 border-b border-line bg-canvas px-4 text-xs leading-4 font-semibold whitespace-nowrap text-content-secondary'

/** "Team" card from the Figma "Staff & workload" frame. */
export function TeamTable() {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        <h2 className="flex-1 text-base leading-6 font-semibold">Team</h2>
      </div>
      <div className="flex">
        <div className={cn(headCell, 'min-w-0 flex-1')}>Staff member</div>
        <div className={cn(headCell, cols.status, 'shrink-0')}>Status</div>
        <div className={cn(headCell, cols.workload, 'shrink-0')}>Workload</div>
        <div className={cn(headCell, cols.ack, 'shrink-0')}>Avg. ack</div>
        <div className={cn(headCell, cols.sla, 'shrink-0')}>SLA met</div>
      </div>
      {staffMembers.map((m) => (
        <TeamRow key={m.id} member={m} />
      ))}
    </section>
  )
}
