import { useEffect, useState } from 'react'
import { Check, Info } from 'lucide-react'
import { Button } from '../components/ui'
import { EscalationStatusChips } from '../features/escalation/components/EscalationStatusChips'
import { ReviewPanel } from '../features/ai-review/components/ReviewPanel'
import { ReviewQueueCard } from '../features/ai-review/components/ReviewQueueCard'
import { ReviewToast } from '../features/ai-review/components/ReviewToast'
import { reviewChips, reviewItems, startingCounts } from '../features/ai-review/mocks'
import type { AssignedSummary, ReviewChip } from '../features/ai-review/types'

// The Figma design only specifies the review panel for the first complaint.
const openItem = reviewItems[0]

export function AiReviewQueuePage() {
  const [chip, setChip] = useState<ReviewChip>('waiting')
  // Simulated: assigning only changes this screen. No backend or AI model is connected.
  const [assigned, setAssigned] = useState<AssignedSummary | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(id)
  }, [toast])

  const counts: Record<ReviewChip, number> = {
    waiting: startingCounts.waiting - (assigned ? 1 : 0),
    reviewed: startingCounts.reviewed + (assigned ? 1 : 0),
    overridden: startingCounts.overridden,
  }

  const onAssigned = (summary: AssignedSummary) => {
    setAssigned(summary)
    setToast(`${summary.id} assigned to ${summary.employee} · ${summary.priority} priority`)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-64 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">AI review queue</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Complaints below 75% AI confidence wait here. Check the classification, set the priority
            and assign an employee by designation.
          </p>
        </div>
        <Button variant="outline" className="font-semibold!">
          <Check size={18} aria-hidden />
          Confirm all high-agreement
        </Button>
      </header>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
          <EscalationStatusChips
            label="Review status"
            chips={reviewChips}
            selected={chip}
            counts={counts}
            onSelect={setChip}
          />
          <p className="flex items-center gap-1.5 text-xs leading-4 text-content-tertiary">
            <Info size={12} aria-hidden />
            Confidence scores shown are sample values for this prototype.
          </p>
          {reviewItems.map((item) => (
            <ReviewQueueCard
              key={item.id}
              item={item}
              selected={item.id === openItem.id}
              assigned={assigned?.id === item.id ? assigned : undefined}
            />
          ))}
        </div>

        <ReviewPanel item={openItem} onAssigned={onAssigned} />
      </div>

      <ReviewToast message={toast} />
    </div>
  )
}
