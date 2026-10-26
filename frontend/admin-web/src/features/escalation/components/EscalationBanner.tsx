import { Info } from 'lucide-react'

interface EscalationBannerProps {
  title: string
  description: string
}

/** Info banner from the Figma escalation detail screen. */
export function EscalationBanner({ title, description }: EscalationBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-info-border bg-info-bg px-4 py-3">
      <Info size={20} className="shrink-0 text-info-fg" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm leading-5 font-semibold text-info-fg">{title}</p>
        <p className="text-[13px] leading-4.5 text-content-secondary">{description}</p>
      </div>
    </div>
  )
}
