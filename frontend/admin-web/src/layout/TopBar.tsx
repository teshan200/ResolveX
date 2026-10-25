import { Bell, ChevronRight, CircleHelp } from 'lucide-react'
import { Avatar, IconButton, SearchField } from '../components/ui'

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

      <SearchField className="w-70" placeholder="Search tickets, cases, branches…" />

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
