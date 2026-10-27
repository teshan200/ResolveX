import { Check, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Button, Drawer, Input, Select, Toggle } from '../../../components/ui'
import { OrgError, addEmployee } from '../../../services/orgService'
import type { DesignationGroup, EmployeeRow } from '../../../services/orgService'
import { Callout } from './Callout'
import { DesignationPicker } from './DesignationPicker'

interface BranchEmployeeDrawerProps {
  /** The branch the signed-in Branch Manager looks after. People can only be added here. */
  branch: { id: string; name: string }
  groups: DesignationGroup[]
  unusedCount: number
  onClose: () => void
  onAdded: (employee: EmployeeRow) => void
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// "Add employee" panel for a Branch Manager: the branch is fixed and only hierarchy designations are offered.
export function BranchEmployeeDrawer({ branch, groups, unusedCount, onClose, onAdded }: BranchEmployeeDrawerProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [designation, setDesignation] = useState('')
  const [active, setActive] = useState(true)
  const [attempted, setAttempted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const chosenLevel = groups.find((group) => group.designations.includes(designation))?.level
  const noDesignations = groups.length === 0

  const nameError = attempted && !name.trim() ? 'Enter the full name' : undefined
  const emailError = attempted && !emailPattern.test(email.trim()) ? 'Enter a valid work email' : undefined
  const designationError =
    attempted && chosenLevel === undefined ? 'Choose a designation from your hierarchy' : undefined

  const save = async () => {
    setAttempted(true)
    if (!name.trim() || !emailPattern.test(email.trim()) || chosenLevel === undefined) return
    setSaving(true)
    setServerError(null)
    try {
      const row = await addEmployee({
        name: name.trim(),
        email: email.trim(),
        designation,
        branchId: branch.id,
        status: active ? 'Active' : 'Inactive',
      })
      onAdded(row)
      onClose()
    } catch (error) {
      setServerError(error instanceof OrgError ? error.message : 'Something went wrong. Try again.')
      setSaving(false)
    }
  }

  return (
    <Drawer
      open
      title="Add employee"
      description={`Joins ${branch.name}. They’ll get an email invite.`}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" className="font-semibold!" onClick={onClose}>
            Cancel
          </Button>
          <Button className="font-semibold!" loading={saving} disabled={noDesignations} onClick={save}>
            <Check size={18} />
            Send invite
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Select label="Branch" disabled options={[branch.name]} />
        <p className="flex items-center gap-1.5 text-xs leading-4 text-content-tertiary">
          <Lock size={12} />
          Fixed to the branch you manage
        </p>

        <Input label="Full name" value={name} error={nameError} onChange={(event) => setName(event.target.value)} />
        <Input
          label="Work email"
          type="email"
          value={email}
          error={emailError}
          leadingIcon={<Mail size={18} className="shrink-0 text-content-tertiary" />}
          onChange={(event) => setEmail(event.target.value)}
        />

        <DesignationPicker
          variant="branch"
          groups={groups}
          value={designation}
          onChange={setDesignation}
          unusedCount={unusedCount}
          error={designationError}
        />

        <Select
          label="Hierarchy level"
          disabled
          options={[chosenLevel === undefined ? '—' : `Level ${chosenLevel}`]}
        />
        <p className="text-xs leading-4 text-content-tertiary">
          Set automatically from the designation’s level in Hierarchy.
        </p>
        <Toggle checked={active} onChange={setActive} label="Account active — can sign in" />

        {serverError && (
          <Callout tone="warning" title="Couldn’t save">
            {serverError}
          </Callout>
        )}
      </div>
    </Drawer>
  )
}
