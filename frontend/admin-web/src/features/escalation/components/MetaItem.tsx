import type { ReactNode } from 'react'

/** Small uppercase label above a value, used in the Figma escalation cards. */
export function MetaItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <p className="text-[11px] leading-4 font-semibold tracking-[0.66px] whitespace-nowrap text-content-tertiary uppercase">
        {label}
      </p>
      {children}
    </div>
  )
}

/** Default style for the value shown under a MetaItem label. */
export const metaValueClass = 'text-sm leading-5 font-medium whitespace-nowrap'
