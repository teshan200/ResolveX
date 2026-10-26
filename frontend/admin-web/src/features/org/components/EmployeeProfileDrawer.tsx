import { CircleArrowUp, CircleCheck, UserCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar, Button, Drawer } from '../../../components/ui'
import { getEmployeeProfile } from '../../../services/orgService'
import type { EmployeeProfile } from '../../../services/orgService'
import type { ComplaintState } from '../types'

const states: Record<ComplaintState, { Icon: LucideIcon; tone: string }> = {
  Claimed: { Icon: UserCheck, tone: 'text-content-brand' },
  Escalated: { Icon: CircleArrowUp, tone: 'text-danger-fg' },
  Resolved: { Icon: CircleCheck, tone: 'text-success-fg' },
}

function Row({ label, children }: { label: string; children: string | number }) {
  return (
    <div className="flex items-center justify-between py-2.25 text-sm leading-5">
      <span className="text-content-secondary">{label}</span>
      <span className="font-semibold">{children}</span>
    </div>
  )
}

// Read-only profile a Branch Manager sees for someone in their branch. Designation and level are set by the Tenant Admin.
export function EmployeeProfileDrawer({ employeeId, onClose }: { employeeId: string; onClose: () => void }) {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null)

  useEffect(() => {
    getEmployeeProfile(employeeId).then(setProfile)
  }, [employeeId])

  const employee = profile?.employee

  return (
    <Drawer
      open
      title={employee?.name ?? 'Employee'}
      description={employee ? `${employee.branchName} · employee profile` : undefined}
      onClose={onClose}
      footer={
        <Button variant="outline" className="font-semibold!" onClick={onClose}>
          Close
        </Button>
      }
    >
      {profile && employee && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <Avatar initials={employee.initials} className="size-14 text-lg" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xl leading-7 font-semibold">{employee.name}</span>
              <span className="text-[13px] leading-4.5 font-medium text-content-brand">
                {employee.designation}
                {employee.level !== null && ` · Level ${employee.level}`}
              </span>
              <span className="truncate text-xs leading-4 text-content-tertiary">{employee.email}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <Row label="Branch">{employee.branchName}</Row>
            <Row label="Status">{employee.status}</Row>
            <Row label="Last active">{employee.lastActive}</Row>
            <Row label="Open tickets">{employee.openTickets}</Row>
            <Row label="SLA met (7 days)">{profile.slaMet}</Row>
          </div>

          <div className="flex flex-col gap-2 rounded-lg bg-canvas px-4 py-3.5">
            <span className="text-[11px] leading-4 font-semibold tracking-[0.6px] text-content-tertiary uppercase">
              Assigned complaints
            </span>
            {profile.complaints.length === 0 && (
              <p className="text-[13px] leading-4.5 text-content-secondary">No complaints assigned.</p>
            )}
            {profile.complaints.map((complaint) => {
              const { Icon, tone } = states[complaint.state]
              return (
                <div key={complaint.id} className="flex items-center gap-2 text-[13px] leading-4.5">
                  <span className="font-mono text-xs font-semibold">{complaint.id}</span>
                  <span className="min-w-0 flex-1 truncate">{complaint.title}</span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${tone}`}>
                    <Icon size={14} />
                    {complaint.state}
                  </span>
                </div>
              )
            })}
          </div>

          <p className="text-xs leading-4 text-content-secondary">
            Designation and level are set by your company’s hierarchy. Contact your Tenant Admin to change them.
          </p>
        </div>
      )}
    </Drawer>
  )
}
