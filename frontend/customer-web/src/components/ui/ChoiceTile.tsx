import type { ReactNode } from 'react'
import { cn } from './cn'

interface ChoiceTileProps {
  label: string
  icon: ReactNode
  selected: boolean
  onToggle: () => void
}

// Multi-select tile (role=checkbox) used for the "which area" question.
export function ChoiceTile({ label, icon, selected, onToggle }: ChoiceTileProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={cn(
        'flex h-14 cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-sm/5 font-semibold text-content transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
        selected
          ? 'border-[1.5px] border-line-brand bg-brand-muted'
          : 'border border-line bg-surface hover:bg-muted',
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full [&>svg]:size-4',
          selected ? 'bg-brand text-on-brand' : 'bg-brand-subtle text-content-brand',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">{label}</span>
    </button>
  )
}
