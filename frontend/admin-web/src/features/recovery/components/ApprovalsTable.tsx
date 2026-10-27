import { Check, CircleAlert, CircleCheck, RotateCw, Star } from 'lucide-react'
import { Avatar, Button } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import { SmallStatusPill } from '../../escalation/components/EscalationBadges'
import { initials } from '../../escalation/escalations'
import type { ResolutionApproval } from '../types'

const head =
  'h-12 border-b border-line bg-canvas px-3 py-0! text-left text-xs leading-4 font-semibold text-content-secondary'
const cell = 'h-[61px] border-b border-line-subtle px-3'

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
        <table className="w-full min-w-[1110px] table-fixed border-separate border-spacing-0">
          <caption className="sr-only">Resolutions waiting for approval</caption>
          <thead>
            <tr>
              <th scope="col" className={`${head} w-[70px]`}>
                Ticket
              </th>
              <th scope="col" className={`${head} w-[130px]`}>
                Complaint
              </th>
              <th scope="col" className={`${head} w-[120px]`}>
                Resolved by
              </th>
              <th scope="col" className={`${head} w-[120px]`}>
                Resolution note
              </th>
              <th scope="col" className={`${head} w-[72px]`}>
                Time
              </th>
              <th scope="col" className={`${head} w-[104px]`}>
                SLA
              </th>
              <th scope="col" className={`${head} w-[216px] px-2!`}>
                <span className="sr-only">Actions</span>
              </th>
              <th scope="col" className={`${head} w-[112px]`}>
                Post-Resolution Rating
              </th>
              <th scope="col" className={`${head} w-[166px]`}>
                Post-Resolution Comment
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
                  <td className={cn(cell, bg)}>
                    <p className="truncate text-sm leading-5 font-medium">{row.title}</p>
                    <p className="truncate text-xs leading-4 text-content-tertiary">{row.location}</p>
                  </td>
                  <td className={cn(cell, bg)}>
                    <div className="flex items-center gap-2">
                      <Avatar initials={initials(row.resolvedBy)} size="sm" />
                      <p className="min-w-0 truncate text-sm leading-5 font-medium">{row.resolvedBy}</p>
                    </div>
                  </td>
                  <td className={cn(cell, bg, 'text-[13px] leading-4.5 text-content-secondary')}>
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
                  <td className={cn(cell, bg, 'px-2!')}>
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
                  <td className={cn(cell, bg)}>
                    {row.survey ? (
                      <div className="flex items-center gap-1 text-[13px] leading-4.5 font-medium whitespace-nowrap text-content-secondary">
                        <Star size={14} aria-hidden />
                        {row.survey.rating} / 5
                      </div>
                    ) : (
                      <p className="text-xs leading-[17px] whitespace-nowrap text-content-secondary">
                        Not submitted
                      </p>
                    )}
                  </td>
                  <td className={cn(cell, bg)}>
                    <p className="text-xs leading-[17px] text-content-secondary">
                      {row.survey ? row.survey.comment : 'Not submitted'}
                    </p>
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
