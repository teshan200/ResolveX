import { CircleCheck, Frown, Sparkles } from 'lucide-react'
import { PriorityBadge } from '../../../components/ui'
import { cn } from '../../../components/ui/cn'
import { AiConfidenceBadge } from '../../escalation/components/AiConfidenceBadge'
import type { AssignedSummary, ReviewItem } from '../types'

interface ReviewQueueCardProps {
  item: ReviewItem
  /** The card whose review is open in the side panel. */
  selected: boolean
  /** Shown once the branch manager has reviewed and assigned the complaint. */
  assigned?: AssignedSummary
  onSelect?: () => void
}

/** Queue card from the Figma "AI review queue". Everything under "AI suggests" is a mock suggestion. */
export function ReviewQueueCard({ item, selected, assigned, onSelect }: ReviewQueueCardProps) {
  const body = (
    <>
      <div className="flex items-center gap-2">
        <p className="font-mono text-[13px] leading-5 font-medium">{item.id}</p>
        <p className="min-w-0 flex-1 text-xs leading-4 text-content-tertiary">{item.meta}</p>
        <AiConfidenceBadge percent={item.confidence} />
      </div>
      <p className="text-sm leading-5">{item.quote}</p>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs leading-4 font-medium whitespace-nowrap text-content-tertiary">AI suggests</p>
        <span className="flex h-[22px] items-center gap-1 rounded-xs bg-brand-subtle px-2 text-xs leading-4 font-medium whitespace-nowrap text-content-brand">
          <Sparkles size={12} aria-hidden />
          {item.subCategory ? `${item.category} › ${item.subCategory}` : item.category}
        </span>
        <PriorityBadge priority={item.priority} />
        <span className="flex h-[22px] items-center gap-1 rounded-full bg-danger-bg px-2 text-xs leading-4 font-semibold whitespace-nowrap text-danger-fg">
          <Frown size={12} aria-hidden />
          Negative
        </span>
      </div>
      {assigned && (
        <p className="flex items-center gap-2 rounded-md bg-success-bg px-3 py-2 text-xs leading-4 font-medium text-success-fg">
          <CircleCheck size={14} className="shrink-0" aria-hidden />
          Reviewed · assigned to {assigned.employee} ({assigned.designation}) · priority{' '}
          {assigned.priority}
        </p>
      )}
    </>
  )

  const classes = cn(
    'flex w-full flex-col gap-3 rounded-xl px-5 py-4 text-left',
    selected ? 'border-[1.5px] border-line-brand bg-brand-subtle' : 'border border-line bg-surface',
  )

  if (!onSelect) return <article className={classes}>{body}</article>
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        classes,
        'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
      )}
    >
      {body}
    </button>
  )
}
