import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import type { NavArea } from './navigation'

export function AppLayout({ area }: { area: NavArea }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar area={area} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar roleLabel={area.roleLabel} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
