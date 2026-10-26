import {
  BRANCH_MANAGER_DESIGNATION,
  branchDetails,
  branchPageCount,
  branchTotals,
  branches as seedBranches,
  defaultBranchDetail,
  employees as seedEmployees,
  hierarchy as seedHierarchy,
} from '../features/org/mocks'
import type { ActiveStatus, Branch, BranchDetail, Employee, Hierarchy, HierarchyLevel } from '../features/org/types'

// Mock implementation. Replace the bodies with real calls when the backend is ready.

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** A rule the UI shows as an error (for example "Designation Conflict"). */
export class OrgError extends Error {
  code: 'branch-has-manager' | 'not-in-hierarchy' | 'invalid-hierarchy' | 'not-found'

  constructor(code: OrgError['code'], message: string) {
    super(message)
    this.code = code
  }
}

let branchStore: Branch[] = structuredClone(seedBranches)
let employeeStore: Employee[] = structuredClone(seedEmployees)
let hierarchyStore: Hierarchy = structuredClone(seedHierarchy)

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

const slug = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const ordinaryLevels = (h: Hierarchy) => h.levels.filter((l) => !l.reserved)

/** Designations placed on a level. Branch Manager is reserved and is assigned from Edit employee. */
function placedDesignations(h: Hierarchy) {
  return ordinaryLevels(h).flatMap((l) => l.designations)
}

export function levelOf(designation: string): number | null {
  const found = hierarchyStore.levels.find((l) => l.designations.includes(designation))
  return found ? found.level : null
}

// ---------------------------------------------------------------- Branches

export interface BranchFilter {
  search?: string
  /** 'any' | 'assigned' | 'none' (no manager) | an employee id. */
  manager?: string
  status?: ActiveStatus | 'All' | 'No manager'
  page?: number
  pageSize?: number
}

export interface BranchRow extends Branch {
  manager: Employee | null
}

export interface BranchList {
  items: BranchRow[]
  total: number
  pageCount: number
  counts: { all: number; active: number; inactive: number; noManager: number }
}

const branchCounts = (list: Branch[]) => ({
  all: list.length,
  active: list.filter((b) => b.status === 'Active').length,
  inactive: list.filter((b) => b.status === 'Inactive').length,
  noManager: list.filter((b) => b.managerId === null).length,
})

const seedBranchCounts = branchCounts(seedBranches)

export async function listBranches(filter: BranchFilter = {}): Promise<BranchList> {
  await delay()
  const query = filter.search?.trim().toLowerCase() ?? ''
  const { page = 1, pageSize = 6, manager = 'any', status = 'All' } = filter

  const matched = branchStore.filter((b) => {
    if (query && !`${b.name} ${b.address} ${b.email}`.toLowerCase().includes(query)) return false
    if (manager === 'none' && b.managerId !== null) return false
    if (manager === 'assigned' && b.managerId === null) return false
    if (!['any', 'none', 'assigned'].includes(manager) && b.managerId !== manager) return false
    if (status === 'No manager') return b.managerId === null
    if (status !== 'All') return b.status === status
    return true
  })

  // The sample data holds a few rows, but the screen reports the full company (32 branches).
  // The totals start from the Figma figures and follow any change made to the sample rows.
  const now = branchCounts(branchStore)
  const counts = {
    all: branchTotals.all + now.all - seedBranchCounts.all,
    active: branchTotals.active + now.active - seedBranchCounts.active,
    inactive: branchTotals.inactive + now.inactive - seedBranchCounts.inactive,
    noManager: branchTotals.noManager + now.noManager - seedBranchCounts.noManager,
  }
  const unfiltered = !query && manager === 'any'
  const statusTotal = { All: counts.all, Active: counts.active, Inactive: counts.inactive, 'No manager': counts.noManager }
  const total = unfiltered ? statusTotal[status] : matched.length
  const pageCount = unfiltered && status === 'All' ? branchPageCount : Math.max(1, Math.ceil(total / pageSize))

  return {
    items: matched.slice((page - 1) * pageSize, page * pageSize).map((b) => ({
      ...b,
      manager: employeeStore.find((e) => e.id === b.managerId) ?? null,
    })),
    total,
    pageCount,
    counts,
  }
}

export interface BranchDetailResult {
  branch: Branch
  manager: EmployeeRow | null
  detail: BranchDetail
}

export async function getBranchDetail(id: string): Promise<BranchDetailResult> {
  await delay()
  const branch = branchStore.find((b) => b.id === id)
  if (!branch) throw new OrgError('not-found', 'Branch not found')
  const manager = employeeStore.find((e) => e.id === branch.managerId)
  return {
    branch: structuredClone(branch),
    manager: manager ? withLevel(manager) : null,
    detail: structuredClone(branchDetails[id] ?? defaultBranchDetail),
  }
}

export async function getBranch(id: string): Promise<Branch> {
  await delay()
  const branch = branchStore.find((b) => b.id === id)
  if (!branch) throw new OrgError('not-found', 'Branch not found')
  return structuredClone(branch)
}

/** A branch can be added without a manager. It shows as Unassigned until one is set in Employees. */
export async function addBranch(
  input: Pick<Branch, 'name' | 'address' | 'phone' | 'email'> & { status?: ActiveStatus },
): Promise<Branch> {
  await delay()
  const { status = 'Active', ...fields } = input
  const branch: Branch = { ...fields, id: slug(input.name), managerId: null, staffCount: 0, status }
  branchStore = [...branchStore, branch]
  return branch
}

export async function updateBranch(
  id: string,
  changes: Partial<Pick<Branch, 'name' | 'address' | 'phone' | 'email' | 'status'>>,
): Promise<Branch> {
  await delay()
  const branch = branchStore.find((b) => b.id === id)
  if (!branch) throw new OrgError('not-found', 'Branch not found')
  Object.assign(branch, changes)
  return structuredClone(branch)
}

export async function setBranchStatus(id: string, status: ActiveStatus): Promise<Branch> {
  await delay()
  const branch = branchStore.find((b) => b.id === id)
  if (!branch) throw new OrgError('not-found', 'Branch not found')
  branch.status = status
  return structuredClone(branch)
}

// --------------------------------------------------------------- Employees

export interface EmployeeFilter {
  search?: string
  /** A branch id, or 'All'. A Branch Manager's list is always scoped to their own branch. */
  branchId?: string
  designation?: string
  /** Hierarchy level number, or 'All'. */
  level?: number | 'All'
  status?: ActiveStatus | 'All'
  page?: number
  pageSize?: number
}

export interface EmployeeRow extends Employee {
  /** Null when the designation is not in the hierarchy. */
  level: number | null
}

export interface EmployeeList {
  items: EmployeeRow[]
  total: number
  counts: { all: number; active: number; inactive: number }
  /** Employees whose designation is no longer in the hierarchy. They are flagged, not changed. */
  needsDesignation: EmployeeRow[]
}

const withLevel = (e: Employee): EmployeeRow => ({
  ...e,
  level: e.designation === BRANCH_MANAGER_DESIGNATION ? hierarchyStore.levels.find((l) => l.name === BRANCH_MANAGER_DESIGNATION)?.level ?? null : levelOf(e.designation),
})

export async function listEmployees(filter: EmployeeFilter = {}): Promise<EmployeeList> {
  await delay()
  const query = filter.search?.trim().toLowerCase() ?? ''
  const { page = 1, pageSize = 9, branchId = 'All', designation = 'All', level = 'All', status = 'All' } = filter

  const scoped = employeeStore.filter((e) => branchId === 'All' || e.branchId === branchId).map(withLevel)
  const matched = scoped.filter((e) => {
    if (query && !`${e.name} ${e.email}`.toLowerCase().includes(query)) return false
    if (designation !== 'All' && e.designation !== designation) return false
    if (level !== 'All' && e.level !== level) return false
    if (status !== 'All' && e.status !== status) return false
    return true
  })

  return {
    items: matched.slice((page - 1) * pageSize, page * pageSize),
    total: matched.length,
    counts: {
      all: scoped.length,
      active: scoped.filter((e) => e.status === 'Active').length,
      inactive: scoped.filter((e) => e.status === 'Inactive').length,
    },
    needsDesignation: scoped.filter((e) => e.level === null),
  }
}

export async function getEmployee(id: string): Promise<EmployeeRow> {
  await delay()
  const employee = employeeStore.find((e) => e.id === id)
  if (!employee) throw new OrgError('not-found', 'Employee not found')
  return withLevel(employee)
}

/**
 * Designations offered when adding or editing. Only designations placed in the hierarchy are offered,
 * and Branch Manager is left out because it is assigned from Edit employee.
 * An empty list is the "No designations" state.
 */
export async function listEligibleDesignations(): Promise<string[]> {
  await delay(150)
  return placedDesignations(hierarchyStore)
}

export interface NewEmployee {
  name: string
  email: string
  designation: string
  branchId: string
}

export async function addEmployee(input: NewEmployee): Promise<EmployeeRow> {
  await delay()
  if (!placedDesignations(hierarchyStore).includes(input.designation)) {
    throw new OrgError('not-in-hierarchy', `${input.designation} is not in your hierarchy`)
  }
  const employee: Employee = {
    id: slug(input.name) || `emp-${employeeStore.length + 1}`,
    name: input.name,
    initials: initialsOf(input.name),
    email: input.email,
    designation: input.designation,
    branchId: input.branchId,
    status: 'Active',
    lastActive: 'Just now',
    openTickets: 0,
  }
  employeeStore = [...employeeStore, employee]
  const branch = branchStore.find((b) => b.id === input.branchId)
  if (branch) branch.staffCount += 1
  return withLevel(employee)
}

export interface EmployeeChanges {
  name?: string
  email?: string
  designation?: string
  branchId?: string
  status?: ActiveStatus
  /** Needed to make someone Branch Manager of a branch that already has one. */
  replaceManager?: boolean
}

export async function updateEmployee(id: string, changes: EmployeeChanges): Promise<EmployeeRow> {
  await delay()
  const employee = employeeStore.find((e) => e.id === id)
  if (!employee) throw new OrgError('not-found', 'Employee not found')

  const { replaceManager, ...fields } = changes
  const designation = fields.designation ?? employee.designation
  const branchId = fields.branchId ?? employee.branchId

  if (designation === BRANCH_MANAGER_DESIGNATION) {
    const branch = branchStore.find((b) => b.id === branchId)
    if (branch && branch.managerId && branch.managerId !== id) {
      // One Branch Manager per branch: the current one must be replaced explicitly.
      if (!replaceManager) {
        throw new OrgError('branch-has-manager', `${branch.name} already has a Branch Manager`)
      }
      const previous = employeeStore.find((e) => e.id === branch.managerId)
      if (previous) previous.designation = ''
    }
    if (branch) branch.managerId = id
  } else if (designation !== employee.designation && !placedDesignations(hierarchyStore).includes(designation)) {
    throw new OrgError('not-in-hierarchy', `${designation} is not in your hierarchy`)
  }

  Object.assign(employee, fields)
  return withLevel(employee)
}

export async function removeEmployee(id: string): Promise<void> {
  await delay()
  const employee = employeeStore.find((e) => e.id === id)
  if (!employee) throw new OrgError('not-found', 'Employee not found')
  employeeStore = employeeStore.filter((e) => e.id !== id)
  const branch = branchStore.find((b) => b.id === employee.branchId)
  if (branch) {
    branch.staffCount = Math.max(0, branch.staffCount - 1)
    if (branch.managerId === id) branch.managerId = null
  }
}

// --------------------------------------------------------------- Hierarchy

export interface HierarchyCheck {
  label: string
  ok: boolean
}

/** The "Check & save" list on Configure hierarchy. An invalid configuration can't be saved. */
export function validateHierarchy(draft: Hierarchy, allDesignations = placedDesignations(seedHierarchy).concat(seedHierarchy.unused)): {
  checks: HierarchyCheck[]
  valid: boolean
} {
  const ordinary = ordinaryLevels(draft)
  const n = ordinary.length
  const numbers = ordinary.map((l) => l.level).sort((a, b) => a - b)
  const hasLevelOne = numbers[0] === 1
  const noGaps = numbers.every((value, index) => value === index + 1)
  const everyLevelFilled = ordinary.every((l) => l.name.trim() !== '' && l.designations.length > 0)
  const placed = ordinary.flatMap((l) => l.designations)
  const eachOnce = new Set(placed).size === placed.length
  const flagged = seedEmployeesWithoutLevel(draft)

  const checks: HierarchyCheck[] = [
    { label: 'Level 1 exists and is the lowest level', ok: hasLevelOne },
    { label: n > 0 ? `Levels run 1 to ${n} with no gaps` : 'Levels run 1 to n with no gaps', ok: noGaps },
    { label: `Branch Manager is Level ${n + 1} (n+1) · Tenant Admin is Level ${n + 2} (n+2)`, ok: true },
    { label: 'Every level has a name and at least one designation', ok: everyLevelFilled },
    { label: `${placed.length} of ${allDesignations.length} designations in use · each on one level`, ok: eachOnce },
    // A warning, not a blocker: affected employees are flagged and left unchanged.
    { label: `${flagged} employee${flagged === 1 ? '' : 's'} will need a valid designation (flagged, not changed)`, ok: flagged === 0 },
  ]
  return { checks, valid: hasLevelOne && noGaps && everyLevelFilled && eachOnce }
}

function seedEmployeesWithoutLevel(draft: Hierarchy) {
  const placed = new Set([BRANCH_MANAGER_DESIGNATION, ...ordinaryLevels(draft).flatMap((l) => l.designations)])
  return employeeStore.filter((e) => !placed.has(e.designation)).length
}

export async function getHierarchy(): Promise<Hierarchy> {
  await delay()
  return structuredClone(hierarchyStore)
}

/** Removing a level renumbers the ones above it, so levels always run 1..n. Its designations become unused. */
export function removeLevel(draft: Hierarchy, level: number): Hierarchy {
  const target = draft.levels.find((l) => l.level === level && !l.reserved)
  if (!target) throw new OrgError('invalid-hierarchy', 'Only ordinary levels above Level 1 can be removed')
  if (level === 1) throw new OrgError('invalid-hierarchy', 'Level 1 is required')

  const ordinary = ordinaryLevels(draft)
    .filter((l) => l.level !== level)
    .map((l): HierarchyLevel => ({ ...l, level: l.level > level ? l.level - 1 : l.level }))
  return reserveTop(ordinary, [...draft.unused, ...target.designations])
}

/** Adds an empty ordinary level on top of the current ones. */
export function addLevel(draft: Hierarchy, name = ''): Hierarchy {
  const ordinary = ordinaryLevels(draft)
  return reserveTop([...ordinary, { level: ordinary.length + 1, name, reserved: false, designations: [] }], draft.unused)
}

/** Moves a designation onto a level (or onto the unused list when level is null). One level per designation. */
export function assignDesignation(draft: Hierarchy, designation: string, level: number | null): Hierarchy {
  const ordinary = ordinaryLevels(draft).map((l) => ({
    ...l,
    designations: l.designations.filter((d) => d !== designation),
  }))
  const unused = draft.unused.filter((d) => d !== designation)
  if (level === null) return reserveTop(ordinary, [...unused, designation])
  return reserveTop(
    ordinary.map((l) => (l.level === level ? { ...l, designations: [...l.designations, designation] } : l)),
    unused,
  )
}

/** Rebuilds the full level list: ordinary levels plus Branch Manager (n+1) and Tenant Admin (n+2). */
function reserveTop(ordinary: HierarchyLevel[], unused: string[]): Hierarchy {
  const sorted = [...ordinary].sort((a, b) => b.level - a.level)
  const n = sorted.length
  return {
    levels: [
      { level: n + 2, name: 'Tenant Admin', reserved: true, designations: [] },
      { level: n + 1, name: 'Branch Manager', reserved: true, designations: [BRANCH_MANAGER_DESIGNATION] },
      ...sorted,
    ],
    unused,
  }
}

export async function saveHierarchy(draft: Hierarchy): Promise<Hierarchy> {
  await delay()
  const { valid } = validateHierarchy(draft)
  if (!valid) throw new OrgError('invalid-hierarchy', 'Invalid configurations can’t be saved')
  hierarchyStore = structuredClone(draft)
  return structuredClone(hierarchyStore)
}
