import { ArrowRight } from 'lucide-react'
import { Avatar, Button } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import { initials } from '../../escalation/escalations'
import { staffPerformance } from '../mocks'

const head =
  'h-10 overflow-hidden border-b border-line bg-canvas px-4 text-left text-xs leading-4 font-semibold whitespace-nowrap text-content-secondary'
const cell = 'h-[53px] border-b border-line-subtle px-4 text-sm leading-5'

/** SLA-met figures at or above this share are shown in green, anything lower in red. */
const SLA_GOOD = 90

/** "Staff response performance" card from the Figma Analytics frame. */
export function StaffPerformanceTable() {
  return (
    <section
      aria-labelledby="staff-performance"
      className="overflow-hidden rounded-xl border border-line bg-surface"
    >
      <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        <div className="min-w-0 flex-1 whitespace-nowrap">
          <h2 id="staff-performance" className="text-base leading-6 font-semibold">
            Staff response performance
          </h2>
          <p className="text-xs leading-4 text-content-tertiary">
            Top performers and those who need support
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-content-secondary!">
          See all staff
          <ArrowRight size={16} aria-hidden />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] table-fixed border-separate border-spacing-0">
          <thead>
            <tr>
              <th scope="col" className={head}>
                Staff
              </th>
              <th scope="col" className={`${head} w-[100px]`}>
                Tickets
              </th>
              <th scope="col" className={`${head} w-[110px]`}>
                Avg. ack
              </th>
              <th scope="col" className={`${head} w-[140px]`}>
                Avg. resolution
              </th>
              <th scope="col" className={`${head} w-[140px]`}>
                SLA met
              </th>
              <th scope="col" className={`${head} w-[140px]`}>
                Post-resolution CSAT
              </th>
            </tr>
          </thead>
          <tbody>
            {staffPerformance.map((s) => (
              <tr key={s.name}>
                <td className={cell}>
                  <div className="flex items-center gap-2">
                    <Avatar initials={initials(s.name)} size="sm" />
                    <div className="min-w-0 whitespace-nowrap">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs leading-4 text-content-tertiary">{s.role}</p>
                    </div>
                  </div>
                </td>
                <td className={cell}>{s.tickets}</td>
                <td className={cell}>{s.avgAck}</td>
                <td className={cell}>{s.avgResolution}</td>
                <td
                  className={cn(
                    cell,
                    'text-[13px] leading-4.5',
                    s.slaMet >= SLA_GOOD ? 'text-success-fg' : 'text-danger-fg',
                  )}
                >
                  {s.slaMet}%
                </td>
                <td className={cell}>{s.csat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
