import { Timer } from 'lucide-react'
import { cn } from '../../components/ui/cn'

interface SlaProgressCardProps {
  title: string
  state: string
  value: string
  /** Colour of the value text and the bar. */
  tone: 'success' | 'warning'
  percent: number
  note: string
  /** The tenant admin view has no header row; the card title is the left label instead. */
  headed?: boolean
}

const tones = {
  success: { text: 'text-success-fg', bar: 'bg-success-solid' },
  warning: { text: 'text-warning-fg', bar: 'bg-warning-solid' },
}

/** Acknowledgement / Resolution SLA card from the Figma branch ticket detail frame. */
export function SlaProgressCard({ title, state, value, tone, percent, note, headed = true }: SlaProgressCardProps) {
  const t = tones[tone]
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface">
      {headed && (
        <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
          <Timer size={18} className="shrink-0 text-brand" aria-hidden />
          <h2 className="min-w-0 flex-1 text-base leading-6 font-semibold">{title}</h2>
        </div>
      )}
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-start justify-between whitespace-nowrap">
          <p className="text-[13px] leading-4.5 font-medium text-content-secondary">{headed ? state : title}</p>
          <p className={cn('text-sm leading-5 font-semibold', t.text)}>{value}</p>
        </div>
        <div
          role="progressbar"
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-2 overflow-hidden rounded-full bg-muted"
        >
          <div className={cn('h-full rounded-full', t.bar)} style={{ width: `${percent}%` }} />
        </div>
        <p className="text-xs leading-4 whitespace-nowrap text-content-tertiary">{note}</p>
      </div>
    </section>
  )
}
