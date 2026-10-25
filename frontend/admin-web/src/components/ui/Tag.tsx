import type { ReactNode } from 'react'
import { cn } from './cn'

export type TagTone = 'neutral' | 'brand' | 'info'

const tones: Record<TagTone, string> = {
  neutral: 'bg-muted text-content-secondary',
  brand: 'bg-brand-subtle text-content-brand',
  info: 'bg-info-bg text-info-fg',
}

export function Tag({ tone = 'neutral', children }: { tone?: TagTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-5.5 shrink-0 items-center rounded-xs px-2 text-xs leading-4 font-medium whitespace-nowrap',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}
