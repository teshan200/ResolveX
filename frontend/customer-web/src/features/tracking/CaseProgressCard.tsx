import type { ReactNode } from 'react'
import { CheckCircleIcon, CircleDotIcon, PencilIcon, UserIcon } from '../../components/icons'
import { cn } from '../../components/ui/cn'
import type { CaseDetail, TimelineEventKind } from './types'

const kinds: Record<TimelineEventKind, { icon: ReactNode; node: string }> = {
  received: { icon: <CircleDotIcon />, node: 'bg-status-new-bg text-status-new-fg' },
  assigned: { icon: <UserIcon />, node: 'bg-status-assigned-bg text-status-assigned-fg' },
  'in-progress': {
    icon: <PencilIcon />,
    node: 'bg-status-in-progress-bg text-status-in-progress-fg',
  },
  resolved: { icon: <CheckCircleIcon />, node: 'bg-status-resolved-bg text-status-resolved-fg' },
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function CaseProgressCard({ detail }: { detail: CaseDetail }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex-1 text-base font-semibold text-content">Case progress</h2>
        <span className="shrink-0 text-xs/4 font-medium text-content-tertiary">
          {detail.updatedLabel}
        </span>
      </div>

      <ol>
        {detail.timeline.map((event, index) => {
          const isLast = index === detail.timeline.length - 1
          return (
            <li key={event.title} className="flex items-start gap-3">
              <div className="flex flex-col items-center self-stretch">
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full [&>svg]:size-4',
                    kinds[event.kind].node,
                  )}
                >
                  {kinds[event.kind].icon}
                </span>
                {!isLast && <span aria-hidden className="w-0.5 min-h-px flex-1 bg-line" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1 pb-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm/5 font-semibold text-content">{event.title}</p>
                  <time dateTime={event.at} className="shrink-0 text-xs/4 text-content-tertiary">
                    {formatTime(event.at)}
                  </time>
                </div>
                <p className="text-xs/4 font-medium text-content-secondary">{event.location}</p>
                <p className="text-[13px]/[18px] text-content-secondary">{event.message}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
