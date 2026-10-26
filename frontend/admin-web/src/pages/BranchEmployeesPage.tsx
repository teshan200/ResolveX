import { Eye, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  Tag,
} from '../components/ui'
import type { Column } from '../components/ui'
import { ReviewToast } from '../features/ai-review/components/ReviewToast'
import { BranchEmployeeDrawer } from '../features/org/components/BranchEmployeeDrawer'
import { EmployeeProfileDrawer } from '../features/org/components/EmployeeProfileDrawer'
import { LevelBadge } from '../features/org/components/LevelBadge'
import { ActiveStatusPill } from '../features/org/components/OrgStatus'
import { BRANCH_MANAGER_DESIGNATION } from '../features/org/mocks'
import {
  countUnusedDesignations,
  listEligibleDesignations,
  listEmployees,
} from '../services/orgService'
import type { DesignationGroup, EmployeeList, EmployeeRow } from '../services/orgService'

// The signed-in Branch Manager (Ayesha) looks after Colombo Branch, and sees only that branch.
const BRANCH = { id: 'colombo', name: 'Colombo Branch' }
const CURRENT_USER_ID = 'ayesha'
const PAGE_SIZE = 8
// Order the employees are listed in on this screen.
const DISPLAY_ORDER = ['ayesha', 'kavinda', 'nimal', 'ravi', 'dinesh', 'namal', 'amali', 'chathura']

type StatusFilter = 'All' | 'Active' | 'Inactive'

const STATUS_FILTERS: { label: StatusFilter; count: keyof EmployeeList['counts'] }[] = [
  { label: 'All', count: 'all' },
  { label: 'Active', count: 'active' },
  { label: 'Inactive', count: 'inactive' },
]

export function BranchEmployeesPage() {
  const [list, setList] = useState<EmployeeList | null>(null)
  const [groups, setGroups] = useState<DesignationGroup[]>([])
  const [search, setSearch] = useState('')
  const [designation, setDesignation] = useState('Designation: All')
  const [status, setStatus] = useState<StatusFilter>('All')
  const [page, setPage] = useState(1)
  const [adding, setAdding] = useState(false)
  const [viewing, setViewing] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [highlight, setHighlight] = useState<string | null>(null)
  const timers = useRef<number[]>([])

  const loadList = useCallback(() => {
    listEmployees({
      search,
      branchId: BRANCH.id,
      designation: designation === 'Designation: All' ? 'All' : designation.replace('Designation: ', ''),
      status,
      order: DISPLAY_ORDER,
      page,
      // The person who was just added is shown on top as an extra row.
      pageSize: PAGE_SIZE + (highlight ? 1 : 0),
    }).then(setList)
  }, [search, designation, status, page, highlight])

  const loadDesignations = useCallback(() => {
    listEligibleDesignations().then(setGroups)
  }, [])

  useEffect(() => {
    loadList()
  }, [loadList])

  useEffect(() => {
    loadDesignations()
  }, [loadDesignations])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  const closeAdd = useCallback(() => setAdding(false), [])
  const closeProfile = useCallback(() => setViewing(null), [])

  const added = (employee: EmployeeRow) => {
    setToast(`${employee.name} added to ${BRANCH.name} · ${employee.designation} · Level ${employee.level}`)
    setHighlight(employee.id)
    timers.current.push(window.setTimeout(() => setToast(null), 4000))
    timers.current.push(window.setTimeout(() => setHighlight(null), 6000))
  }

  const resetPage = <T,>(set: (value: T) => void) => (value: T) => {
    set(value)
    setPage(1)
  }

  const columns: Column<EmployeeRow>[] = [
    {
      key: 'employee',
      header: 'Employee',
      width: 336,
      render: (employee) => (
        <>
          <Avatar initials={employee.initials} size="sm" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm leading-5 font-semibold">{employee.name}</span>
            <span className="truncate text-xs leading-4 text-content-tertiary">{employee.email}</span>
          </span>
          {employee.id === CURRENT_USER_ID && (
            <span className="ml-auto pr-3">
              <Tag tone="brand">You</Tag>
            </span>
          )}
        </>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      width: 220,
      render: (employee) => <span className="truncate text-[13px] leading-4.5">{employee.designation}</span>,
    },
    {
      key: 'level',
      header: 'Level',
      width: 151,
      render: (employee) => (
        <LevelBadge level={employee.level} reserved={employee.designation === BRANCH_MANAGER_DESIGNATION} />
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
      header: 'Last active',
      width: 140,
      render: (employee) => (
        <span className="truncate text-[13px] leading-4.5 text-content-secondary">{employee.lastActive}</span>
      ),
    },
    {
      key: 'openTickets',
      header: 'Open tickets',
      width: 100,
      render: (employee) => (
        <span className="text-[13px] leading-4.5">
          {employee.designation === BRANCH_MANAGER_DESIGNATION ? '—' : employee.openTickets}
        </span>
      ),
    },
    {
      key: 'view',
      header: '',
      width: 53,
      render: (employee) => (
        <IconButton
          icon={Eye}
          label={`View ${employee.name}`}
          size="sm"
          onClick={() => setViewing(employee.id)}
        />
      ),
    },
  ]

  const rows = list?.items ?? []
  const start = (page - 1) * PAGE_SIZE + 1
  const total = list?.total ?? 0
  const summary = rows.length
    ? `Showing ${start}–${start + rows.length - 1} of ${total} ${BRANCH.name} employees`
    : 'No employees to show'

  const designationOptions = [
    'Designation: All',
    ...[BRANCH_MANAGER_DESIGNATION, ...groups.flatMap((group) => group.designations)].map(
      (name) => `Designation: ${name}`,
    ),
  ]

  return (
    <div className="flex flex-col gap-13.5">
      <PageHeader
        title="Employees"
        description={`People at ${BRANCH.name}. You can add employees to this branch only.`}
        actions={
          <Button className="font-semibold!" onClick={() => setAdding(true)}>
            <Plus size={18} />
            Add employee
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <SearchField
          className="w-65"
          placeholder="Search name or email…"
          value={search}
          onChange={(event) => resetPage(setSearch)(event.target.value)}
        />
        <div className="w-52.5">
          <Select
            aria-label="Filter by designation"
            options={designationOptions}
            value={designation}
            onChange={(event) => resetPage(setDesignation)(event.target.value)}
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

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <Table
          columns={columns}
          rows={rows}
          rowKey={(employee) => employee.id}
          rowHeight={60}
          rowClassName={(employee) => (employee.id === highlight ? 'bg-success-bg' : undefined)}
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

      {adding && (
        <BranchEmployeeDrawer
          branch={BRANCH}
          groups={groups}
          unusedCount={countUnusedDesignations()}
          onClose={closeAdd}
          onAdded={added}
        />
      )}
      {viewing && <EmployeeProfileDrawer employeeId={viewing} onClose={closeProfile} />}
      <ReviewToast message={toast} />
    </div>
  )
}
