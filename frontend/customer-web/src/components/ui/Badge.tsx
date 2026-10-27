import type { ReactNode } from 'react'
import { cn } from './cn'

type BadgeTone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-muted text-content-secondary',
  brand: 'bg-brand-subtle text-content-brand',
  info: 'bg-info-bg text-info-fg',
  success: 'bg-success-bg text-success-fg',
  warning: 'bg-warning-bg text-warning-fg',
  danger: 'bg-danger-bg text-danger-fg',
}

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
