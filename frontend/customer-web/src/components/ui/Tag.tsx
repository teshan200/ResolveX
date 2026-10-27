import type { ReactNode } from 'react'
import { cn } from './cn'

type TagTone = 'brand' | 'neutral'

const tones: Record<TagTone, string> = {
  brand: 'bg-brand-subtle text-content-brand',
  neutral: 'bg-muted text-content-secondary',
}

interface TagProps {
  tone?: TagTone
  icon?: ReactNode
  children: ReactNode
}

// Category / metadata label, for example the complaint category or an order reference.
export function Tag({ tone = 'neutral', icon, children }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center gap-1 rounded-xs px-2 text-xs/4 font-medium whitespace-nowrap [&>svg]:size-3',
        tones[tone],
      )}
    >
      {icon}
      {children}
    </span>
  )
}
