import type { ReactNode } from 'react'

// Rounded chip used for designations in the hierarchy tree and the "Not in the hierarchy" list.
export function DesignationTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 shrink-0 items-center rounded-full border border-line bg-muted px-3 text-xs leading-4 font-medium whitespace-nowrap text-content-secondary">
      {children}
    </span>
  )
}
