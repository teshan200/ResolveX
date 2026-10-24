import { Sparkles } from 'lucide-react'

/** "AI · 92%" confidence chip from the Figma design. */
export function AiConfidenceBadge({ percent }: { percent: number }) {
  return (
    <span className="flex h-[22px] items-center gap-1 rounded-full border border-line-subtle bg-brand-subtle px-2 text-xs leading-4 font-semibold whitespace-nowrap">
      <Sparkles size={12} className="text-content-brand" aria-hidden />
      <span className="text-content-brand">AI</span>
      <span aria-hidden className="size-1.5 rounded-full bg-success-solid" />
      <span className="text-success-fg">{percent}%</span>
    </span>
  )
}
