import { Search } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from './cn'

// Search box with the ⌘K hint. Pass the width through className.
export function SearchField({ className, ...props }: ComponentProps<'input'>) {
  return (
    <label
      className={cn(
        'flex h-10 shrink-0 items-center gap-2 rounded-md border border-line bg-surface px-3 text-content-tertiary focus-within:border-line-focus',
        className,
      )}
    >
      <Search size={18} className="shrink-0" />
      <input
        type="search"
        className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-content outline-none placeholder:text-content-tertiary"
        {...props}
      />
      <kbd className="rounded-xs bg-muted px-1.5 font-sans text-xs leading-4 font-medium text-content-tertiary">
        ⌘K
      </kbd>
    </label>
  )
}
