import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Button,
  FilterChip,
  PageHeader,
  Pagination,
  SearchField,
  Select,
  Table,
} from '../components/ui'
import type { Column, SortState } from '../components/ui'
import { ReviewToast } from '../features/ai-review/components/ReviewToast'
import { Callout } from '../features/org/components/Callout'
import { EmployeeDrawer } from '../features/org/components/EmployeeDrawer'
import type { EmployeeDrawerResult } from '../features/org/components/EmployeeDrawer'
import { LevelBadge } from '../features/org/components/LevelBadge'
import { ActiveStatusPill, WarningNote } from '../features/org/components/OrgStatus'
import { RemoveEmployeeModal } from '../features/org/components/RemoveEmployeeModal'
import { BRANCH_MANAGER_DESIGNATION } from '../features/org/mocks'
import {
  countUnusedDesignations,
  listBranchOptions,
  listEligibleDesignations,
  listEmployees,
  removeEmployee,
} from '../services/orgService'
import type {
  BranchOption,
  DesignationGroup,
  EmployeeList,
  EmployeeRow,
  EmployeeSortKey,
} from '../services/orgService'

type StatusFilter = 'All' | 'Active' | 'Inactive'

const STATUS_FILTERS: { label: StatusFilter; count: keyof EmployeeList['counts'] }[] = [
  { label: 'All', count: 'all' },
  { label: 'Active', count: 'active' },
  { label: 'Inactive', count: 'inactive' },
]

const LEVEL_OPTIONS = ['Level: All', 'Level 1', 'Level 2', 'Level 3', 'Level 4']
const PAGE_SIZE = 9

const shortBranch = (name: string) => name.replace(/ Branch$/, '')

interface DrawerState {
  mode: 'add' | 'edit'
  employee?: EmployeeRow
}

export function EmployeesPage() {
  const [list, setList] = useState<EmployeeList | null>(null)
  const [branches, setBranches] = useState<BranchOption[]>([])
  const [groups, setGroups] = useState<DesignationGroup[]>([])
  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState('Branch: All')
  const [designation, setDesignation] = useState('Designation: All')
  const [level, setLevel] = useState(LEVEL_OPTIONS[0])
  const [status, setStatus] = useState<StatusFilter>('All')
  const [sort, setSort] = useState<SortState | undefined>()
  const [page, setPage] = useState(1)
  const [drawer, setDrawer] = useState<DrawerState | null>(null)
  const [removing, setRemoving] = useState<EmployeeRow | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [highlight, setHighlight] = useState<EmployeeRow | null>(null)
  const timers = useRef<number[]>([])

  const branchId = branches.find((b) => shortBranch(b.name) === branch.replace('Branch: ', ''))?.id ?? 'All'
  const levelFilter = level === LEVEL_OPTIONS[0] ? 'All' : Number(level.replace('Level ', ''))

  const loadReferenceData = useCallback(() => {
    Promise.all([listBranchOptions(), listEligibleDesignations()]).then(([options, designations]) => {
      setBranches(options)
      setGroups(designations)
    })
  }, [])

  const loadList = useCallback(() => {
    listEmployees({
      search,
      branchId: branch === 'Branch: All' ? 'All' : branchId,
      designation: designation === 'Designation: All' ? 'All' : designation.replace('Designation: ', ''),
      level: levelFilter,
      status,
      sort: sort ? { key: sort.key as EmployeeSortKey, direction: sort.direction } : undefined,
      page,
      pageSize: PAGE_SIZE,
    }).then(setList)
  }, [search, branch, branchId, designation, levelFilter, status, sort, page])

  useEffect(() => {
    loadReferenceData()
  }, [loadReferenceData])

  useEffect(() => {
    loadList()
  }, [loadList])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  const closeDrawer = useCallback(() => setDrawer(null), [])
  const closeRemove = useCallback(() => setRemoving(null), [])

  const announce = (result: EmployeeDrawerResult) => {
    loadList()
    loadReferenceData()
    if (!result.message) return
    setToast(result.message)
    setHighlight(result.highlight ?? null)
    timers.current.push(window.setTimeout(() => setToast(null), 4000))
    timers.current.push(window.setTimeout(() => setHighlight(null), 6000))
  }

  const confirmRemove = async (employee: EmployeeRow) => {
    await removeEmployee(employee.id)
    setRemoving(null)
    setDrawer(null)
    loadList()
    loadReferenceData()
  }

  const resetPage = <T,>(set: (value: T) => void) => (value: T) => {
    set(value)
    setPage(1)
  }

  const toggleSort = (key: string) =>
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )

  const columns: Column<EmployeeRow>[] = [
    {
      key: 'name',
      header: 'Employee Name',
      width: 230,
      sortable: true,
      render: (employee) => (
        <>
          <Avatar initials={employee.initials} size="sm" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm leading-5 font-semibold">{employee.name}</span>
            <span className="truncate text-xs leading-4 text-content-tertiary">{employee.email}</span>
          </span>
        </>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      width: 190,
      render: (employee) => (
        <>
          <span className="min-w-0 truncate text-[13px] leading-4.5">{employee.designation}</span>
          {employee.level === null && <WarningNote>Not in hierarchy</WarningNote>}
        </>
      ),
    },
    {
      key: 'level',
      header: 'Hierarchy Level',
      width: 130,
      sortable: true,
      render: (employee) => (
        <LevelBadge level={employee.level} reserved={employee.designation === BRANCH_MANAGER_DESIGNATION} />
      ),
    },
    {
      key: 'branch',
      header: 'Branch',
      width: 120,
      render: (employee) => (
        <span className="truncate text-[13px] leading-4.5">{shortBranch(employee.branchName)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 110,
      render: (employee) => <ActiveStatusPill status={employee.status} />,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      width: 120,
      sortable: true,
      render: (employee) => (
        <span className="truncate text-[13px] leading-4.5 text-content-secondary">{employee.lastActive}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 210,
      render: (employee) => (
        <span className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setDrawer({ mode: 'edit', employee })}
            className="flex cursor-pointer items-center gap-1.5 text-[13px] leading-4.5 font-medium hover:underline"
          >
            <Pencil size={16} className="text-content-secondary" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setRemoving(employee)}
            className="flex cursor-pointer items-center gap-1.5 text-[13px] leading-4.5 font-medium text-danger-fg hover:underline"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </span>
      ),
    },
  ]

  const items = list?.items ?? []
  // A person who was just added or promoted stays visible at the top, whatever page they belong to.
  const rows =
    highlight && page === 1 && !items.some((e) => e.id === highlight.id)
      ? [items.find((e) => e.id === highlight.id) ?? highlight, ...items]
      : items
  const start = (page - 1) * PAGE_SIZE + 1
  const total = list?.total ?? 0
  const summary = items.length
    ? `Showing ${start}–${start + items.length - 1} of ${total} employees`
    : 'No employees to show'

  const flagged = list?.needsDesignation ?? []
  const designationOptions = [
    'Designation: All',
    ...[BRANCH_MANAGER_DESIGNATION, ...groups.flatMap((g) => g.designations)].map((d) => `Designation: ${d}`),
  ]

  return (
    <div className="flex flex-col gap-13.5">
      <PageHeader
        title="Employees"
        description="Add employees to a branch with a designation from your hierarchy — their level follows the designation. Tenant Admins aren’t listed."
        actions={
          <Button className="font-semibold!" onClick={() => setDrawer({ mode: 'add' })}>
            <Plus size={18} />
            Add employee
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <SearchField
          className="w-60"
          placeholder="Search name or email…"
          value={search}
          onChange={(event) => resetPage(setSearch)(event.target.value)}
        />
        <div className="w-37.5">
          <Select
            aria-label="Filter by branch"
            options={['Branch: All', ...branches.map((b) => `Branch: ${shortBranch(b.name)}`)]}
            value={branch}
            onChange={(event) => resetPage(setBranch)(event.target.value)}
          />
        </div>
        <div className="w-47.5">
          <Select
            aria-label="Filter by designation"
            options={designationOptions}
            value={designation}
            onChange={(event) => resetPage(setDesignation)(event.target.value)}
          />
        </div>
        <div className="w-32.5">
          <Select
            aria-label="Filter by level"
            options={LEVEL_OPTIONS}
            value={level}
            onChange={(event) => resetPage(setLevel)(event.target.value)}
          />
        </div>
        <div className="ml-auto flex gap-2">
          {STATUS_FILTERS.map((filter) => (
            <FilterChip
              key={filter.label}
              label={filter.label}
              count={list?.counts[filter.count] ?? 0}
              selected={status === filter.label}
              onClick={() => resetPage(setStatus)(filter.label)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {flagged.length > 0 && (
          <Callout
            tone="warning"
            title={`${flagged.length} employee${flagged.length === 1 ? '' : 's'} needs a valid designation`}
            action={{ label: 'Review', onClick: () => setDrawer({ mode: 'edit', employee: flagged[0] }) }}
          >
            {flagged[0].designation} is no longer in your hierarchy, so {flagged[0].name} has no level. Their record is
            unchanged until you reassign them.
          </Callout>
        )}

        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <Table
            columns={columns}
            rows={rows}
            rowKey={(employee) => employee.id}
            rowHeight={60}
            sort={sort}
            onSort={toggleSort}
            rowClassName={(employee) =>
              employee.level === null
                ? 'bg-warning-bg'
                : employee.id === highlight?.id
                  ? 'bg-success-bg'
                  : undefined
            }
            empty={
              <p className="px-4 py-10 text-center text-sm leading-5 text-content-secondary">
                {list ? 'No employees match these filters.' : 'Loading employees…'}
              </p>
            }
          />
          <div className="px-5 py-3">
            <Pagination summary={summary} page={page} pageCount={list?.pageCount ?? 1} onPageChange={setPage} />
          </div>
        </div>
      </div>

      {drawer && (
        <EmployeeDrawer
          key={`${drawer.mode}-${drawer.employee?.id ?? 'new'}`}
          mode={drawer.mode}
          employee={drawer.employee}
          branches={branches}
          groups={groups}
          unusedCount={countUnusedDesignations()}
          onClose={closeDrawer}
          onRemove={(employee) => setRemoving(employee)}
          onDone={announce}
        />
      )}
      <RemoveEmployeeModal employee={removing} onClose={closeRemove} onConfirm={confirmRemove} />
      <ReviewToast message={toast} />
    </div>
  )
}
