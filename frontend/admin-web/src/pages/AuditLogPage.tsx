import { PageHeader } from '../components/ui'

export function AuditLogPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit log"
        description="Every sign-in, permission change, override and admin action — tamper-evident and exportable."
      />
    </div>
  )
}
