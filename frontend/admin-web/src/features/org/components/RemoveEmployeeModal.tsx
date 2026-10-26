import { useState } from 'react'
import { Avatar, Button, Modal } from '../../../components/ui'
import type { EmployeeRow } from '../../../services/orgService'

interface RemoveEmployeeModalProps {
  employee: EmployeeRow | null
  onClose: () => void
  onConfirm: (employee: EmployeeRow) => Promise<void>
}

export function RemoveEmployeeModal({ employee, onClose, onConfirm }: RemoveEmployeeModalProps) {
  const [removing, setRemoving] = useState(false)

  const confirm = async () => {
    if (!employee) return
    setRemoving(true)
    await onConfirm(employee)
    setRemoving(false)
  }

  return (
    <Modal
      open={employee !== null}
      title={`Remove ${employee?.name}?`}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" className="font-semibold!" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" className="font-semibold!" loading={removing} onClick={confirm}>
            Remove employee
          </Button>
        </>
      }
    >
      {employee && (
        <>
          <p className="text-sm leading-5 text-content-secondary">
            {employee.name.split(' ')[0]} loses access to ResolveX straight away. Complaints and follow-ups they handled
            keep their full history.
          </p>
          <div className="flex items-center gap-3 rounded-lg border border-line px-3 py-3">
            <Avatar initials={employee.initials} />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm leading-5 font-semibold">{employee.name}</span>
              <span className="truncate text-xs leading-4 text-content-tertiary">
                {employee.designation}
                {employee.level !== null && ` · Level ${employee.level}`} · {employee.branchName.replace(/ Branch$/, '')}
              </span>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
