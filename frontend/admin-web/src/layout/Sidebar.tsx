import { NavLink } from 'react-router-dom'
import { cn } from '../components/ui/cn'
import type { NavArea } from './navigation'

export function Sidebar({ area }: { area: NavArea }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-surface">
      <div className="px-6 py-5 text-xl font-bold text-brand">ResolveX</div>
      <nav className="flex flex-col gap-1 px-3">
        {area.items.map((item) => (
          <NavLink
            key={item.path}
            to={`${area.basePath}/${item.path}`}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-subtle text-content-brand'
                  : 'text-content-secondary hover:bg-muted',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
