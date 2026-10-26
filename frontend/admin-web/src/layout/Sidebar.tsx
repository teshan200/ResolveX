import { ChevronsUpDown, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Avatar, IconButton, Logo } from '../components/ui'
import { cn } from '../components/ui/cn'
import type { NavArea, NavItem } from './navigation'

function NavRow({ item, basePath }: { item: NavItem; basePath: string }) {
  const Icon = item.icon

  return (
    <NavLink
      to={`${basePath}/${item.path}`}
      className={({ isActive }) =>
        cn(
          'flex h-9 items-center gap-3 rounded-md px-3 text-sm leading-5 font-medium transition-colors',
          isActive
            ? 'bg-brand-subtle text-content-brand'
            : 'text-content-secondary hover:bg-muted',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={cn('shrink-0', isActive ? 'text-brand' : 'text-content-tertiary')}
          />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.count !== undefined && (
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-muted px-1.5 text-xs leading-4 font-semibold text-content-secondary">
              {item.count}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar({ area }: { area: NavArea }) {
  const navigate = useNavigate()
  const { workspace, user } = area

  return (
    <aside className="sticky top-0 flex h-screen w-66 shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex flex-col gap-5 px-4 pt-5">
        <Logo />
        <button
          type="button"
          className="flex items-center gap-3 rounded-md border border-line px-3 py-2 text-left transition-colors hover:bg-muted"
        >
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-sm text-xs leading-4 font-semibold',
              workspace.tone === 'dark'
                ? 'bg-inverse text-content-inverse'
                : 'bg-brand-muted text-content-brand',
            )}
          >
            {workspace.initials}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13px] leading-4.5 font-medium">{workspace.name}</span>
            <span className="truncate text-xs leading-4 text-content-tertiary">
              {workspace.subtitle}
            </span>
          </span>
          <ChevronsUpDown size={16} className="shrink-0 text-content-tertiary" />
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pt-2 pb-4">
        {area.sections.map((section, index) => (
          <div key={section.heading ?? index} className="flex flex-col gap-0.5">
            {section.heading && (
              <p className="px-3 pb-1 text-[11px] leading-4 font-semibold tracking-[0.66px] text-content-tertiary uppercase">
                {section.heading}
              </p>
            )}
            {section.items.map((item) => (
              <NavRow key={item.path} item={item} basePath={area.basePath} />
            ))}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-line p-4">
        <Avatar initials={user.initials} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13px] leading-4.5 font-medium">{user.name}</span>
          <span className="truncate text-xs leading-4 text-content-tertiary">{user.role}</span>
        </div>
        <IconButton icon={LogOut} label="Log out" size="sm" onClick={() => navigate('/login')} />
      </div>
    </aside>
  )
}
