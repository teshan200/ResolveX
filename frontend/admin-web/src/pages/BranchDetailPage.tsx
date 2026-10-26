import { Activity, ArrowLeft, CircleCheck, CircleX, Pencil, Power, Store, UserCheck, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, Button, Panel, PanelRow } from '../components/ui'
import { BranchDrawer } from '../features/org/components/BranchDrawer'
import { ActiveStatusPill, WarningNote } from '../features/org/components/OrgStatus'
import type { BranchFormValues } from '../features/org/branchSchema'
import { useBreadcrumb } from '../layout/breadcrumb'
import { getBranchDetail, setBranchStatus, updateBranch } from '../services/orgService'
import type { BranchDetailResult } from '../services/orgService'

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[28px] leading-9 font-semibold tracking-[-0.2px]">{value}</span>
      <span className="text-[13px] leading-4.5 text-content-secondary">{label}</span>
    </div>
  )
}

export function BranchDetailPage() {
  const { branchId = '' } = useParams()
  // undefined while loading, null when the branch does not exist.
  const [data, setData] = useState<BranchDetailResult | null | undefined>()
  const [editing, setEditing] = useState(false)

  const load = useCallback(() => {
    getBranchDetail(branchId)
      .then(setData)
      .catch(() => setData(null))
  }, [branchId])

  useEffect(() => {
    load()
  }, [load])

  useBreadcrumb(data ? ['Branches', data.branch.name] : null)
  const closeEditor = useCallback(() => setEditing(false), [])

  if (data === undefined) {
    return <p className="text-sm leading-5 text-content-secondary">Loading branch…</p>
  }

  if (data === null) {
    return (
      <div className="flex flex-col items-start gap-3">
        <h1 className="text-2xl leading-8 font-semibold">Branch not found</h1>
        <Link
          to="/tenant/branches"
          className="text-[13px] leading-4.5 font-semibold text-content-link hover:underline"
        >
          Back to branches
        </Link>
      </div>
    )
  }

  const { branch, manager, detail } = data
  const active = branch.status === 'Active'

  const toggleStatus = async () => {
    await setBranchStatus(branch.id, active ? 'Inactive' : 'Active')
    load()
  }

  const save = async (values: BranchFormValues) => {
    const { active: isActive, ...fields } = values
    await updateBranch(branch.id, { ...fields, status: isActive ? 'Active' : 'Inactive' })
    load()
  }

  return (
    <div className="flex flex-col gap-13.5">
      <div className="flex flex-col gap-13.5">
        <Link
          to="/tenant/branches"
          className="flex w-fit items-center gap-1.5 text-[13px] leading-4.5 font-semibold text-content-link hover:underline"
        >
          <ArrowLeft size={14} />
          Branches
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] leading-9 font-semibold tracking-[-0.2px]">{branch.name}</h1>
          <ActiveStatusPill status={branch.status} />
          <div className="ml-auto flex gap-3">
            <Button variant="ghost" className="font-semibold!" onClick={toggleStatus}>
              <Power size={18} />
              {active ? 'Deactivate' : 'Activate'}
            </Button>
            <Button variant="outline" className="font-semibold!" onClick={() => setEditing(true)}>
              <Pencil size={18} />
              Edit branch
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_380px] items-start gap-6">
        <div className="flex flex-col gap-5">
          <Panel title="Branch details" icon={Store}>
            <PanelRow label="Address">{branch.address}</PanelRow>
            <PanelRow label="Phone">{branch.phone}</PanelRow>
            <PanelRow label="Email">{branch.email}</PanelRow>
            <PanelRow label="Created">{detail.createdAt}</PanelRow>
            <PanelRow label="Status">
              <ActiveStatusPill status={branch.status} />
            </PanelRow>
          </Panel>

          <Panel title="Branch at a glance" icon={Activity}>
            <div className="grid grid-cols-4 gap-4">
              <Stat value={branch.staffCount} label="employees" />
              <Stat value={detail.qrCodes} label="QR codes" />
              <Stat value={detail.openComplaints} label="open complaints" />
              <Stat value={detail.slaBreachRate} label="SLA breach rate" />
            </div>
          </Panel>
        </div>

        <section className="overflow-hidden rounded-xl border border-line bg-surface">
          <header className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
            <UserCheck size={18} className="shrink-0 text-brand" />
            <h2 className="min-w-0 flex-1 text-base leading-6 font-semibold">Branch Manager</h2>
            <Link to="/tenant/employees" className="shrink-0">
              <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-[13px] font-medium hover:bg-muted">
                <Users size={16} />
                Manage in Employees
              </span>
            </Link>
          </header>
          <div className="flex flex-col gap-4 px-5 py-4">
            {manager ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar initials={manager.initials} className="size-14 text-lg" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-base leading-6 font-semibold">{manager.name}</span>
                    <span className="text-[13px] leading-4.5 font-medium text-content-brand">
                      Branch Manager · Level {manager.level}
                    </span>
                    <span className="truncate text-xs leading-4 text-content-tertiary">{manager.email}</span>
                  </div>
                </div>
                <PanelRow label="Assigned since">{detail.managerSince}</PanelRow>
                <div className="flex flex-col gap-2 rounded-lg bg-canvas px-3 py-3">
                  <span className="text-xs leading-4 font-semibold tracking-[0.6px] text-content-tertiary uppercase">
                    Access
                  </span>
                  <p className="flex items-center gap-2 text-[13px] leading-4.5">
                    <CircleCheck size={16} className="shrink-0 text-success-fg" />
                    Branch Manager dashboard · {branch.name} only
                  </p>
                  <p className="flex items-center gap-2 text-[13px] leading-4.5">
                    <CircleX size={16} className="shrink-0 text-content-tertiary" />
                    No access to other branches
                  </p>
                  <p className="flex items-center gap-2 text-[13px] leading-4.5">
                    <CircleX size={16} className="shrink-0 text-content-tertiary" />
                    No tenant administration features
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-start gap-2">
                <WarningNote>Unassigned</WarningNote>
                <p className="text-[13px] leading-4.5 text-content-secondary">
                  Assign a Branch Manager from Employees › Edit employee › Role.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <BranchDrawer open={editing} branch={branch} onClose={closeEditor} onSubmit={save} />
    </div>
  )
}
