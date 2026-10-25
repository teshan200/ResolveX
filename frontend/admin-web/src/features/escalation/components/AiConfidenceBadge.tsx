import { Sparkles } from 'lucide-react'

/** Dot and number colour: high (75%+) is green, medium amber, low (under 50%) red. */
function tone(percent: number) {
  if (percent >= 75) return { dot: 'bg-success-solid', text: 'text-success-fg' }
  if (percent >= 50) return { dot: 'bg-warning-solid', text: 'text-warning-fg' }
  return { dot: 'bg-danger-solid', text: 'text-danger-fg' }
}

/** "AI · 92%" confidence chip from the Figma design. The score is a mock value. */
export function AiConfidenceBadge({ percent }: { percent: number }) {
  const { dot, text } = tone(percent)
  return (
    <span className="flex h-[22px] shrink-0 items-center gap-1 rounded-full border border-line-subtle bg-brand-subtle px-2 text-xs leading-4 font-semibold whitespace-nowrap">
      <Sparkles size={12} className="text-content-brand" aria-hidden />
      <span className="text-content-brand">AI</span>
      <span aria-hidden className={`size-1.5 rounded-full ${dot}`} />
      <span className={text}>{percent}%</span>
    </span>
  )
}
