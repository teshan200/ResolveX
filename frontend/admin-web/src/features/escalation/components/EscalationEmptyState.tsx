import { CircleCheck } from 'lucide-react'

interface EscalationEmptyStateProps {
  /** Selected branch, or null when all branches are shown. */
  branch: string | null
  days: number
}

/** Empty panel from the Figma "Escalated to me: Empty" frame. */
export function EscalationEmptyState({ branch, days }: EscalationEmptyStateProps) {
  const name = branch?.replace(/ Branch$/, '')
  return (
    <div className="flex flex-col items-center rounded-xl border border-line bg-surface">
      <div className="flex w-full max-w-[480px] flex-col items-center gap-3 px-4 py-12">
        <span className="flex size-[72px] items-center justify-center rounded-full bg-brand-subtle text-content-brand">
          <CircleCheck size={32} aria-hidden />
        </span>
        <h2 className="text-lg leading-[26px] font-semibold">
          {branch ? `No AI escalations for ${branch}` : 'No AI escalations'}
        </h2>
        <p className="text-center text-sm leading-5 text-content-secondary">
          {name
            ? `No complaints against ${name}’s Branch Manager have been escalated to you in the last ${days} days.`
            : `No complaints have been escalated to you in the last ${days} days.`}
        </p>
      </div>
    </div>
  )
}
