import { PageHeader } from '../components/ui'
import { branchTotals } from '../features/org/mocks'

export function BranchesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Branches"
        description={`${branchTotals.all} branches/outlets. Each branch has one Branch Manager who sees only that branch.`}
      />
    </div>
  )
}
