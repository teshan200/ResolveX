import { PageHeader } from '../components/ui'

export function EmployeesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Employees"
        description="Add employees to a branch with a designation from your hierarchy — their level follows the designation. Tenant Admins aren’t listed."
      />
    </div>
  )
}
