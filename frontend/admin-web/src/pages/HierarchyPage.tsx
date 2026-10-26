import { PageHeader } from '../components/ui'

export function HierarchyPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Hierarchy"
        description="Your saved designation-to-level structure. Branch Manager (n+1) and Tenant Admin (n+2) are placed automatically."
      />
    </div>
  )
}
