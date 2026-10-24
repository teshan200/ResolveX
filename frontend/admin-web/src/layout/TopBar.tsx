import { Bell, ChevronRight, CircleHelp, Search } from 'lucide-react'
import { Avatar, IconButton } from '../components/ui'

interface TopBarProps {
  crumb: string[]
  initials: string
  notifications?: number
}

export function TopBar({ crumb, initials, notifications = 5 }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-surface px-8">
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        {crumb.map((label, index) => {
          const last = index === crumb.length - 1
          return (
            <span key={label} className="flex shrink-0 items-center gap-1.5">
              <span
                className={
                  last
                    ? 'text-[13px] leading-4.5 font-medium whitespace-nowrap'
                    : 'text-[13px] leading-4.5 font-medium whitespace-nowrap text-content-tertiary'
                }
              >
                {label}
              </span>
              {!last && <ChevronRight size={14} className="text-content-tertiary" />}
            </span>
          )
        })}
      </nav>

      <label className="flex h-10 w-70 shrink-0 items-center gap-2 rounded-md border border-line bg-surface px-3 text-content-tertiary focus-within:border-line-focus">
        <Search size={18} className="shrink-0" />
        <input
          type="search"
          placeholder="Search tickets, cases, branches…"
          className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-content outline-none placeholder:text-content-tertiary"
        />
        <kbd className="rounded-xs bg-muted px-1.5 font-sans text-xs leading-4 font-medium text-content-tertiary">
          ⌘K
        </kbd>
      </label>

      <div className="relative flex shrink-0">
        <IconButton icon={Bell} label="Notifications" />
        {notifications > 0 && (
          <span className="pointer-events-none absolute top-0.5 left-6 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger-solid px-1.5 text-xs leading-4 font-semibold text-on-brand">
            {notifications}
          </span>
        )}
      </div>
      <IconButton icon={CircleHelp} label="Help" />
      <Avatar initials={initials} size="sm" />
    </header>
  )
}
