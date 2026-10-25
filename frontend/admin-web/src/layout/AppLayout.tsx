import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BreadcrumbContext } from './breadcrumb'
import { navItems } from './navigation'
import type { NavArea } from './navigation'

export function AppLayout({ area }: { area: NavArea }) {
  const { pathname } = useLocation()
  const [crumbOverride, setCrumbOverride] = useState<string[] | null>(null)
  // Detail pages (e.g. a single complaint) sit under their list's path, so match by prefix.
  const current = navItems(area).find((item) => pathname.startsWith(`${area.basePath}/${item.path}`))

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar area={area} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar crumb={crumbOverride ?? current?.crumb ?? []} initials={area.user.initials} />
        <main className="flex-1 p-8">
          <BreadcrumbContext.Provider value={setCrumbOverride}>
            <Outlet />
          </BreadcrumbContext.Provider>
        </main>
      </div>
    </div>
  )
}
