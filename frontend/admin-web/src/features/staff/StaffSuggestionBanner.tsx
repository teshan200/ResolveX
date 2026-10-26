import { TriangleAlert, X } from 'lucide-react'

/** Warning banner from the Figma "Staff & workload" frame. Apply suggestion and dismiss are not wired up. */
export function StaffSuggestionBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg px-4 py-3">
      <TriangleAlert size={20} className="shrink-0 text-warning-fg" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm leading-5 font-semibold text-warning-fg">Ravi Silva has 6 open kitchen tickets</p>
        <p className="text-[13px] leading-4.5 text-content-secondary">
          Suggestion: move #1054 and #1049 to Chathura N. when his shift starts at 5 PM.
        </p>
      </div>
      <button
        type="button"
        className="cursor-pointer text-[13px] leading-4.5 font-medium whitespace-nowrap text-warning-fg hover:underline"
      >
        Apply suggestion
      </button>
      <button type="button" aria-label="Dismiss" className="shrink-0 cursor-pointer text-content-tertiary">
        <X size={16} aria-hidden />
      </button>
    </div>
  )
}
