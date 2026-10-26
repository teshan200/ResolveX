import { Eye, Pencil, Plus, Power } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Button,
  FilterChip,
  IconButton,
  PageHeader,
  Pagination,
  SearchField,
  Select,
  Table,
} from '../components/ui'
import type { Column } from '../components/ui'
import { BranchDrawer } from '../features/org/components/BranchDrawer'
import { ActiveStatusPill, WarningNote } from '../features/org/components/OrgStatus'
import type { BranchFormValues } from '../features/org/branchSchema'
import type { Branch } from '../features/org/types'
import { addBranch, listBranches, setBranchStatus, updateBranch } from '../services/orgService'
import type { BranchFilter, BranchList, BranchRow } from '../services/orgService'

type StatusFilter = NonNullable<BranchFilter['status']>

const FILTERS: { label: string; value: StatusFilter; count: keyof BranchList['counts'] }[] = [
  { label: 'All', value: 'All', count: 'all' },
  { label: 'Active', value: 'Active', count: 'active' },
  { label: 'Inactive', value: 'Inactive', count: 'inactive' },
  { label: 'No manager', value: 'No manager', count: 'noManager' },
]

const MANAGER_OPTIONS = ['Manager: Any', 'Manager: Assigned', 'Manager: Unassigned']
const MANAGER_VALUES = ['any', 'assigned', 'none']
const PAGE_SIZE = 6

export function BranchesPage() {
  const navigate = useNavigate()
  const [list, setList] = useState<BranchList | null>(null)
  const [status, setStatus] = useState<StatusFilter>('All')
  const [manager, setManager] = useState(MANAGER_OPTIONS[0])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [drawer, setDrawer] = useState<{ open: boolean; branch?: Branch }>({ open: false })

  const load = useCallback(() => {
    listBranches({
      search,
      status,
      page,
      pageSize: PAGE_SIZE,
      manager: MANAGER_VALUES[MANAGER_OPTIONS.indexOf(manager)],
    }).then(setList)
  }, [search, status, page, manager])

  useEffect(() => {
    load()
  }, [load])

  const closeDrawer = useCallback(() => setDrawer({ open: false }), [])

  const save = async (values: BranchFormValues) => {
    const { active, ...fields } = values
    const next = active ? 'Active' : 'Inactive'
    if (drawer.branch) await updateBranch(drawer.branch.id, { ...fields, status: next })
    else await addBranch({ ...fields, status: next })
    load()
  }

  const toggleStatus = async (branch: Branch) => {
    await setBranchStatus(branch.id, branch.status === 'Active' ? 'Inactive' : 'Active')
    load()
  }

  const columns: Column<BranchRow>[] = [
    {
      key: 'branch',
      header: 'Branch',
      render: (branch) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm leading-5 font-semibold">{branch.name}</span>
          <span className="truncate text-xs leading-4 text-content-tertiary">{branch.address}</span>
        </span>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      width: 220,
      render: (branch) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] leading-4.5">{branch.phone}</span>
          <span className="truncate text-xs leading-4 text-content-tertiary">{branch.email}</span>
        </span>
      ),
    },
    {
      key: 'manager',
      header: 'Branch Manager',
      width: 209,
      render: (branch) =>
        branch.manager ? (
          <>
            <Avatar initials={branch.manager.initials} size="sm" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[13px] leading-4.5 font-semibold">{branch.manager.name}</span>
              <span className="truncate text-xs leading-4 text-content-tertiary">Branch Manager</span>
            </span>
          </>
        ) : (
          <>
            <WarningNote>Unassigned</WarningNote>
            <Link
              to="/tenant/employees"
              className="truncate text-xs leading-4 font-medium text-content hover:underline"
            >
              Assign in Employees
            </Link>
          </>
        ),
    },
    {
      key: 'staff',
      header: 'Staff',
      width: 81,
      render: (branch) => <span className="text-sm leading-5">{branch.staffCount}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 110,
      render: (branch) => <ActiveStatusPill status={branch.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 130,
      render: (branch) => (
        <span className="flex gap-1">
          <IconButton
            icon={Eye}
            label={`View ${branch.name}`}
            size="sm"
            onClick={() => navigate(`/tenant/branches/${branch.id}`)}
          />
          <IconButton
            icon={Pencil}
            label={`Edit ${branch.name}`}
            size="sm"
            onClick={() => setDrawer({ open: true, branch })}
          />
          <IconButton
            icon={Power}
            label={branch.status === 'Active' ? `Deactivate ${branch.name}` : `Activate ${branch.name}`}
            size="sm"
            onClick={() => toggleStatus(branch)}
          />
        </span>
      ),
    },
  ]

  const rows = list?.items ?? []
  const start = (page - 1) * PAGE_SIZE + 1
  const total = list?.total ?? 0
  const summary = rows.length
    ? `Showing ${start}–${start + rows.length - 1} of ${total} branches`
    : 'No branches to show'

  const resetPage = <T,>(set: (value: T) => void) => (value: T) => {
    set(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-13.5">
      <PageHeader
        title="Branches"
        description={`${list?.counts.all ?? 32} branches/outlets. Each branch has one Branch Manager who sees only that branch.`}
        actions={
          <Button className="font-semibold!" onClick={() => setDrawer({ open: true })}>
            <Plus size={18} />
            Add branch
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <SearchField
          className="w-75"
          placeholder="Search branch, address or manager…"
          value={search}
          onChange={(event) => resetPage(setSearch)(event.target.value)}
        />
        <div className="w-44">
          <Select
            aria-label="Filter by manager"
            options={MANAGER_OPTIONS}
            value={manager}
            onChange={(event) => resetPage(setManager)(event.target.value)}
          />
        </div>
        <div className="ml-auto flex gap-2">
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter.value}
              label={filter.label}
              count={list?.counts[filter.count] ?? 0}
              selected={status === filter.value}
              onClick={() => resetPage(setStatus)(filter.value)}
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <Table
          columns={columns}
          rows={rows}
          rowKey={(branch) => branch.id}
          rowHeight={64}
          empty={
            <p className="px-4 py-10 text-center text-sm leading-5 text-content-secondary">
              {list ? 'No branches match these filters.' : 'Loading branches…'}
            </p>
          }
        />
        <div className="px-5 py-3">
          <Pagination summary={summary} page={page} pageCount={list?.pageCount ?? 1} onPageChange={setPage} />
        </div>
      </div>

      <BranchDrawer open={drawer.open} branch={drawer.branch} onClose={closeDrawer} onSubmit={save} />
    </div>
  )
}
