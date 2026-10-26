import { Check, CircleAlert, CircleCheck, RotateCw } from 'lucide-react'
import { Avatar, Button } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import { SmallStatusPill } from '../../escalation/components/EscalationBadges'
import { initials } from '../../escalation/escalations'
import type { ResolutionApproval } from '../types'

const head =
  'h-10 border-b border-line bg-canvas px-4 text-left text-xs leading-4 font-semibold text-content-secondary'
const cell = 'h-[61px] border-b border-line-subtle px-4'

interface ApprovalsTableProps {
  rows: ResolutionApproval[]
  /** Show the Reopen and Approve buttons. Only rows still waiting can be decided. */
  actionable: boolean
  onApprove: (id: string) => void
  onReopen: (id: string) => void
}

/** Table from the Figma "Resolution approvals" frame. Breached rows are tinted red. */
export function ApprovalsTable({ rows, actionable, onApprove, onReopen }: ApprovalsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] table-fixed border-separate border-spacing-0">
          <caption className="sr-only">Resolutions waiting for approval</caption>
          <thead>
            <tr>
              <th scope="col" className={`${head} w-[90px]`}>
                Ticket
              </th>
              <th scope="col" className={`${head} w-[200px]`}>
                Complaint
              </th>
              <th scope="col" className={`${head} w-[150px]`}>
                Resolved by
              </th>
              <th scope="col" className={head}>
                Resolution note
              </th>
              <th scope="col" className={`${head} w-[90px]`}>
                Time
              </th>
              <th scope="col" className={`${head} w-[110px]`}>
                SLA
              </th>
              <th scope="col" className={`${head} w-[220px]`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const breached = row.sla === 'Breached'
              const bg = breached ? 'bg-danger-bg' : ''
              return (
                <tr key={row.id}>
                  <td className={cn(cell, bg, 'font-mono text-[13px] leading-5 font-medium')}>
                    {row.id}
                  </td>
                  <td className={cn(cell, bg, 'max-w-[200px]')}>
                    <p className="truncate text-sm leading-5 font-medium">{row.title}</p>
                    <p className="truncate text-xs leading-4 text-content-tertiary">{row.location}</p>
                  </td>
                  <td className={cn(cell, bg, 'max-w-[150px]')}>
                    <div className="flex items-center gap-2">
                      <Avatar initials={initials(row.resolvedBy)} size="sm" />
                      <p className="truncate text-sm leading-5 font-medium">{row.resolvedBy}</p>
                    </div>
                  </td>
                  <td className={cn(cell, bg, 'max-w-0 text-[13px] leading-4.5 text-content-secondary')}>
                    <p className="truncate">{row.note}</p>
                  </td>
                  <td className={cn(cell, bg, 'text-[13px] leading-4.5 whitespace-nowrap text-content-secondary')}>
                    {row.time}
                  </td>
                  <td className={cn(cell, bg)}>
                    {breached ? (
                      <SmallStatusPill
                        style="bg-status-escalated-bg text-status-escalated-fg"
                        icon={CircleAlert}
                      >
                        Breached
                      </SmallStatusPill>
                    ) : (
                      <SmallStatusPill
                        style="bg-status-resolved-bg text-status-resolved-fg"
                        icon={CircleCheck}
                      >
                        Met
                      </SmallStatusPill>
                    )}
                  </td>
                  <td className={cn(cell, bg)}>
                    {actionable && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-medium! text-content-secondary!"
                          onClick={() => onReopen(row.id)}
                          aria-label={`Reopen ${row.id}`}
                        >
                          <RotateCw size={16} aria-hidden />
                          Reopen
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onApprove(row.id)}
                          aria-label={`Approve ${row.id}`}
                        >
                          <Check size={16} aria-hidden />
                          Approve
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
