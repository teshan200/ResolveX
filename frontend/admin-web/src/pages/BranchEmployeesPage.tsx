import { PageHeader } from '../components/ui'

export function BranchEmployeesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Employees"
        description="People at Colombo Branch. You can add employees to this branch only."
      />
    </div>
  )
}
