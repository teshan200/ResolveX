import { Check, Mail, Trash2, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { Button, Checkbox, Drawer, Input, Select, Toggle } from '../../../components/ui'
import { OrgError, addEmployee, updateEmployee } from '../../../services/orgService'
import type { BranchOption, DesignationGroup, EmployeeRow } from '../../../services/orgService'
import { BRANCH_MANAGER_DESIGNATION } from '../mocks'
import { AssignmentChecks } from './AssignmentChecks'
import { Callout } from './Callout'
import { DesignationPicker } from './DesignationPicker'
import { RoleSwitch } from './RoleSwitch'
import type { Role } from './RoleSwitch'

export interface EmployeeDrawerResult {
  /** Text for the toast, when the change deserves one. */
  message?: string
  /** Row to highlight in the list. */
  highlight?: EmployeeRow
}

interface EmployeeDrawerProps {
  mode: 'add' | 'edit'
  employee?: EmployeeRow
  /** Branch to preselect when adding. */
  defaultBranchId?: string
  branches: BranchOption[]
  groups: DesignationGroup[]
  unusedCount: number
  onClose: () => void
  onRemove: (employee: EmployeeRow) => void
  onDone: (result: EmployeeDrawerResult) => void
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const firstName = (name: string) => name.split(' ')[0]
const lastActiveText = (label: string) => label.charAt(0).toLowerCase() + label.slice(1)

// One panel for three jobs: add an employee, edit one (including making them Branch Manager),
// and reassign the designation of someone who is no longer in the hierarchy.
export function EmployeeDrawer({
  mode,
  employee,
  defaultBranchId,
  branches,
  groups,
  unusedCount,
  onClose,
  onRemove,
  onDone,
}: EmployeeDrawerProps) {
  const adding = mode === 'add'
  const reassign = !adding && employee?.level === null
  const eligible = groups.flatMap((group) => group.designations.map((name) => ({ name, level: group.level })))
  const wasManager = employee?.designation === BRANCH_MANAGER_DESIGNATION
  const managerLevel = Math.max(0, ...groups.map((group) => group.level)) + 1

  const [name, setName] = useState(employee?.name ?? '')
  const [email, setEmail] = useState(employee?.email ?? '')
  const [branchId, setBranchId] = useState(employee?.branchId ?? defaultBranchId ?? branches[0]?.id ?? '')
  const [role, setRole] = useState<Role>(wasManager ? 'manager' : 'ordinary')
  const [designation, setDesignation] = useState(
    adding ? '' : wasManager ? (eligible[0]?.name ?? '') : (employee?.designation ?? ''),
  )
  const [active, setActive] = useState(employee ? employee.status === 'Active' : true)
  const [previousDesignation, setPreviousDesignation] = useState(eligible[0]?.name ?? '')
  const [confirmed, setConfirmed] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const branch = branches.find((b) => b.id === branchId)
  const isManager = !adding && role === 'manager'
  const replacing = isManager && Boolean(branch?.managerId) && branch?.managerId !== employee?.id
  const otherBranch = isManager ? branches.find((b) => b.managerId === employee?.id && b.id !== branchId) : undefined
  const chosenLevel = eligible.find((item) => item.name === designation)?.level
  const designationValid = chosenLevel !== undefined

  const nameError = attempted && !name.trim() ? 'Enter the full name' : undefined
  const emailError = attempted && !emailPattern.test(email.trim()) ? 'Enter a valid work email' : undefined
  const designationError =
    reassign && !designationValid
      ? 'Not eligible — pick a designation from your hierarchy.'
      : attempted && !isManager && !designationValid
        ? 'Choose a designation from your hierarchy'
        : undefined

  const blocked =
    (adding && groups.length === 0) ||
    (reassign && !designationValid) ||
    (replacing && !previousDesignation) ||
    Boolean(otherBranch)

  const title = adding ? 'Add employee' : reassign ? 'Reassign designation' : 'Edit employee'
  const description = adding
    ? 'They’ll get an email invite to set their password.'
    : reassign
      ? `${employee?.name} · ${employee?.branchName}`
      : role === 'ordinary'
        ? `${employee?.name} · last active ${lastActiveText(employee?.lastActive ?? '')}`
        : `${employee?.name} · ${employee?.designation} · ${employee?.branchName}`

  const submitLabel = adding
    ? 'Send invite'
    : replacing
      ? 'Replace Branch Manager'
      : isManager && !wasManager
        ? 'Assign as Branch Manager'
        : 'Save changes'
  const SubmitIcon = isManager && !wasManager ? UserCheck : Check

  const save = async () => {
    setAttempted(true)
    const needsEmail = !isManager
    const needsDesignation = !isManager
    if (
      !name.trim() ||
      (needsEmail && !emailPattern.test(email.trim())) ||
      (needsDesignation && !designationValid) ||
      (replacing && !confirmed) ||
      blocked
    ) {
      return
    }
    setSaving(true)
    setServerError(null)
    try {
      const shortBranch = branch?.name ?? ''
      if (adding) {
        const row = await addEmployee({ name: name.trim(), email: email.trim(), designation, branchId })
        onDone({
          message: `${row.name} added · ${row.designation} · Level ${row.level} · ${shortBranch.replace(/ Branch$/, '')}`,
          highlight: row,
        })
      } else if (employee && isManager) {
        const row = await updateEmployee(employee.id, {
          name: name.trim(),
          branchId,
          designation: BRANCH_MANAGER_DESIGNATION,
          replaceManager: replacing,
          previousManagerDesignation: previousDesignation,
        })
        onDone({
          message: wasManager ? undefined : `${row.name} is now Branch Manager of ${shortBranch}`,
          highlight: wasManager ? undefined : row,
        })
      } else if (employee) {
        await updateEmployee(employee.id, {
          name: name.trim(),
          email: email.trim(),
          branchId,
          designation,
          status: active ? 'Active' : 'Inactive',
        })
        onDone({})
      }
      onClose()
    } catch (error) {
      setServerError(error instanceof OrgError ? error.message : 'Something went wrong. Try again.')
      setSaving(false)
    }
  }

  const branchSelect = (
    <Select
      label="Branch"
      options={branches.map((b) => b.name)}
      value={branch?.name}
      onChange={(event) => setBranchId(branches.find((b) => b.name === event.target.value)?.id ?? branchId)}
    />
  )

  return (
    <Drawer
      open
      title={title}
      description={description}
      onClose={onClose}
      footer={
        <>
          {!adding && !reassign && role === 'ordinary' && employee && (
            <Button
              variant="ghost"
              className="mr-auto font-semibold! text-danger-fg hover:bg-danger-bg"
              onClick={() => onRemove(employee)}
            >
              <Trash2 size={18} />
              Remove employee
            </Button>
          )}
          <Button variant="outline" className="font-semibold!" onClick={onClose}>
            Cancel
          </Button>
          <Button className="font-semibold!" loading={saving} disabled={blocked} onClick={save}>
            <SubmitIcon size={18} />
            {submitLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {reassign && (
          <Callout tone="warning" title="Designation no longer in the hierarchy">
            {employee?.designation} was removed from the hierarchy. Choose an eligible designation — nothing changed
            automatically.
          </Callout>
        )}

        <Input label="Full name" value={name} error={nameError} onChange={(event) => setName(event.target.value)} />

        {!isManager && (
          <Input
            label="Work email"
            type="email"
            value={email}
            error={emailError}
            leadingIcon={<Mail size={18} className="shrink-0 text-content-tertiary" />}
            onChange={(event) => setEmail(event.target.value)}
          />
        )}

        {branchSelect}
        {!isManager && (
          <p className="text-xs leading-4 text-content-tertiary">Choose from your company’s branches.</p>
        )}

        {!adding && !reassign && <RoleSwitch value={role} onChange={setRole} />}

        {adding && (
          <DesignationPicker
            groups={groups}
            value={designation}
            onChange={setDesignation}
            unusedCount={unusedCount}
            error={designationError}
          />
        )}

        {!adding && !isManager && (
          <>
            <Select
              label="Designation"
              options={designationValid || eligible.length === 0 ? eligible.map((e) => e.name) : [designation, ...eligible.map((e) => e.name)]}
              value={designation}
              error={designationError}
              errorIcon
              onChange={(event) => setDesignation(event.target.value)}
            />
            <Select
              label="Hierarchy level"
              disabled
              options={[chosenLevel === undefined ? '— (no level until reassigned)' : `Level ${chosenLevel}`]}
            />
            <p className="-mt-2 text-xs leading-4 text-content-tertiary">
              Set automatically from the designation’s level in Hierarchy.
            </p>
            <Toggle checked={active} onChange={setActive} label="Account active — can sign in" />
          </>
        )}

        {isManager && (
          <>
            <Select label="Designation" disabled options={['Branch Manager (reserved)']} />
            <Select label="Hierarchy level" disabled options={[`Level ${managerLevel} · n+1 (reserved)`]} />

            {replacing ? (
              <>
                <Callout tone="warning" title={`${branch?.name} already has a Branch Manager`}>
                  {branch?.managerName} manages {branch?.name.replace(/ Branch$/, '')}. A branch can have only one, so
                  choose {firstName(branch?.managerName ?? '')}’s new designation before replacing them.
                </Callout>
                <Select
                  label={`${branch?.managerName}’s new designation`}
                  options={eligible.map((e) => `${e.name} · Level ${e.level}`)}
                  value={`${previousDesignation} · Level ${eligible.find((e) => e.name === previousDesignation)?.level}`}
                  onChange={(event) =>
                    setPreviousDesignation(event.target.value.replace(/ · Level \d+$/, ''))
                  }
                />
                <div className="flex flex-col gap-1.5">
                  <Checkbox
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                    label={`I understand ${firstName(branch?.managerName ?? '')} loses Branch Manager access to ${branch?.name}`}
                  />
                  {attempted && !confirmed && (
                    <p className="text-xs text-danger-fg">Confirm to replace the current Branch Manager</p>
                  )}
                </div>
              </>
            ) : (
              !wasManager && (
                <Callout tone="info" title={`${employee?.designation} will no longer be active`}>
                  Branch Manager is an exclusive designation. {firstName(employee?.name ?? '')}’s Level {employee?.level}{' '}
                  designation is replaced, not kept alongside.
                </Callout>
              )
            )}

            <AssignmentChecks
              checks={[
                replacing
                  ? { ok: false, text: `Current manager ${branch?.managerName} will be replaced` }
                  : { ok: true, text: `${branch?.name} has no Branch Manager` },
                { ok: true, text: `${firstName(employee?.name ?? '')} belongs to ${branch?.name}` },
                otherBranch
                  ? { ok: false, text: `${firstName(employee?.name ?? '')} already manages ${otherBranch.name}` }
                  : { ok: true, text: `${firstName(employee?.name ?? '')} doesn’t manage another branch` },
              ]}
            />
          </>
        )}

        {serverError && (
          <Callout tone="warning" title="Couldn’t save">
            {serverError}
          </Callout>
        )}
      </div>
    </Drawer>
  )
}
