import { CircleCheck } from 'lucide-react'
import type { AcknowledgedEscalation } from '../inbox'

const head =
  'h-10 border-b border-line bg-canvas px-4 text-left text-xs leading-4 font-semibold text-content-secondary'
const cell = 'h-[61px] border-b border-line-subtle px-4'

/** "Acknowledged · still open" table from the Figma Escalation Inbox. */
export function AcknowledgedTable({ rows }: { rows: AcknowledgedEscalation[] }) {
  return (
    <section
      aria-labelledby="acknowledged-open"
      className="min-w-0 flex-1 overflow-hidden rounded-xl border border-line bg-surface"
    >
      <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        <CircleCheck size={18} className="shrink-0 text-content-brand" aria-hidden />
        <h2 id="acknowledged-open" className="text-base leading-6 font-semibold whitespace-nowrap">
          Acknowledged · still open
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th scope="col" className={`${head} w-[90px]`}>
                Ticket
              </th>
              <th scope="col" className={head}>
                Complaint
              </th>
              <th scope="col" className={`${head} w-[190px]`}>
                Level
              </th>
              <th scope="col" className={`${head} w-[140px]`}>
                Acknowledged
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={`${cell} font-mono text-[13px] leading-5 font-medium`}>{row.id}</td>
                <td className={cell}>
                  <p className="truncate text-sm leading-5 font-medium">{row.title}</p>
                  <p className="truncate text-xs leading-4 text-content-tertiary">{row.detail}</p>
                </td>
                <td className={`${cell} text-[13px] leading-4.5 text-content-secondary`}>
                  {row.level}
                </td>
                <td
                  className={`${cell} max-w-[140px] truncate text-[13px] leading-4.5 text-content-secondary`}
                >
                  {row.acknowledged}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
