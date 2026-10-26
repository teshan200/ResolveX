import { CircleCheck, TriangleAlert } from 'lucide-react'

export interface AssignmentCheck {
  ok: boolean
  text: string
}

// "Assignment checks" list under the Branch Manager role: green ticks, orange for a warning.
export function AssignmentChecks({ checks }: { checks: AssignmentCheck[] }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-canvas px-4 py-3">
      <span className="text-[11px] leading-4 font-semibold tracking-[0.6px] text-content-tertiary uppercase">
        Assignment checks
      </span>
      {checks.map((check) => (
        <p key={check.text} className="flex items-center gap-2 text-[13px] leading-4.5">
          {check.ok ? (
            <CircleCheck size={16} className="shrink-0 text-success-fg" />
          ) : (
            <TriangleAlert size={16} className="shrink-0 text-warning-fg" />
          )}
          {check.text}
        </p>
      ))}
    </div>
  )
}
