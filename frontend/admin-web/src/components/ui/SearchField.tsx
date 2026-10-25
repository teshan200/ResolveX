import { Search } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from './cn'

interface SearchFieldProps extends Omit<ComponentProps<'input'>, 'type'> {
  // Keyboard hint shown on the right, e.g. "⌘K".
  shortcut?: string
}

export function SearchField({
  shortcut,
  className,
  placeholder = 'Search tickets, cases, branches…',
  ...props
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        'flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3 text-content-tertiary',
        'focus-within:border-line-focus focus-within:shadow-[inset_0_0_0_0.5px_var(--color-line-focus),0_0_0_3px_rgba(42,140,126,0.35)]',
        className,
      )}
    >
      <Search size={18} className="shrink-0" aria-hidden />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={props['aria-label'] ?? placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-content outline-none placeholder:text-content-tertiary"
        {...props}
      />
      {shortcut && (
        <kbd className="shrink-0 rounded-xs bg-muted px-1.5 font-sans text-xs leading-4 font-medium text-content-tertiary">
          {shortcut}
        </kbd>
      )}
    </div>
  )
}
