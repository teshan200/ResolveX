import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, PageHeader } from '../components/ui'
import { cn } from '../components/ui/cn'
import { DesignationTag } from '../features/org/components/DesignationTag'
import { HierarchyTree } from '../features/org/components/HierarchyTree'
import type { Hierarchy } from '../features/org/types'
import { getHierarchy } from '../services/orgService'

function Chip({ tone, children }: { tone: 'brand' | 'info' | 'neutral'; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-2.5 text-xs leading-4 font-medium whitespace-nowrap',
        tone === 'brand' && 'bg-brand-subtle text-content-brand',
        tone === 'info' && 'bg-info-bg text-info-fg',
        tone === 'neutral' && 'bg-muted text-content-secondary',
      )}
    >
      {children}
    </span>
  )
}

function SideCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <header className="border-b border-line-subtle px-5 py-4">
        <h2 className="text-base leading-6 font-semibold">{title}</h2>
        {description && <p className="text-xs leading-4 text-content-tertiary">{description}</p>}
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  )
}

// The saved structure: which designation sits on which level. Edited from "Configure hierarchy".
export function HierarchyPage() {
  const navigate = useNavigate()
  const [hierarchy, setHierarchy] = useState<Hierarchy | null>(null)

  useEffect(() => {
    getHierarchy().then(setHierarchy)
  }, [])

  const ordinary = hierarchy?.levels.filter((level) => !level.reserved) ?? []
  const n = ordinary.length
  const inUse = ordinary.reduce((sum, level) => sum + level.designations.length, 0)
  const unused = hierarchy?.unused ?? []

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Hierarchy"
        description="Your saved designation-to-level structure. Branch Manager (n+1) and Tenant Admin (n+2) are placed automatically."
        actions={
          <Button className="font-semibold!" onClick={() => navigate('/tenant/hierarchy/configure')}>
            <Settings size={18} />
            Configure hierarchy
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Chip tone="brand">n = {n} ordinary levels</Chip>
        <Chip tone="info">Branch Manager = Level {n + 1}</Chip>
        <Chip tone="info">Tenant Admin = Level {n + 2}</Chip>
        <Chip tone="neutral">
          {inUse} designations in use · {unused.length} not used
        </Chip>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
        <section className="rounded-xl border border-line bg-surface px-12 py-10">
          {hierarchy ? (
            <HierarchyTree levels={hierarchy.levels} />
          ) : (
            <p className="text-sm leading-5 text-content-secondary">Loading hierarchy…</p>
          )}
        </section>

        <div className="flex flex-col gap-5">
          <SideCard title={`Not in the hierarchy (${unused.length})`} description="Not offered when adding employees">
            <div className="flex flex-wrap gap-2">
              {unused.map((name) => (
                <DesignationTag key={name}>{name}</DesignationTag>
              ))}
            </div>
          </SideCard>

          <SideCard title="How it works">
            <div className="flex flex-col gap-3 text-xs leading-4.5 text-content-secondary">
              <p>1 · Define and name your ordinary levels (Level 1 is required).</p>
              <p>2 · Assign designations to those levels — one level per designation.</p>
              <p>Levels always run 1 … n with no gaps; removing a level renumbers the ones above it.</p>
              <p>Employees take their level from their designation.</p>
            </div>
          </SideCard>
        </div>
      </div>
    </div>
  )
}
