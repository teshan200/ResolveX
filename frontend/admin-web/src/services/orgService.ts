import {
  BRANCH_MANAGER_DESIGNATION,
  branchDetails,
  branchPageCount,
  branchTotals,
  branches as seedBranches,
  defaultBranchDetail,
  colomboEmployeeTotals,
  employeePageCount,
  employeeProfiles,
  employeesPerDesignation,
  employeeTotals,
  employees as seedEmployees,
  hierarchy as seedHierarchy,
} from '../features/org/mocks'
import type { ActiveStatus, Branch, BranchDetail, Employee, ProfileComplaint, Hierarchy, HierarchyLevel } from '../features/org/types'

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

export type EmployeeSortKey = 'name' | 'level' | 'lastActive'

export interface EmployeeFilter {
  search?: string
  /** A branch id, or 'All'. A Branch Manager's list is always scoped to their own branch. */
  branchId?: string
  designation?: string
  /** Hierarchy level number, or 'All'. */
  level?: number | 'All'
  status?: ActiveStatus | 'All'
  sort?: { key: EmployeeSortKey; direction: 'asc' | 'desc' }
  /** Employee ids to list first, in this order. Everyone else follows in their usual order. */
  order?: string[]
  page?: number
  pageSize?: number
}

export interface EmployeeRow extends Employee {
  /** Null when the designation is not in the hierarchy. */
  level: number | null
  branchName: string
}

export interface EmployeeList {
  items: EmployeeRow[]
  total: number
  pageCount: number
  counts: { all: number; active: number; inactive: number }
  /** Employees whose designation is no longer in the hierarchy. They are flagged, not changed. */
  needsDesignation: EmployeeRow[]
}

const withLevel = (e: Employee): EmployeeRow => ({
  ...e,
  level:
    e.designation === BRANCH_MANAGER_DESIGNATION
      ? (hierarchyStore.levels.find((l) => l.name === BRANCH_MANAGER_DESIGNATION)?.level ?? null)
      : levelOf(e.designation),
  branchName: branchStore.find((b) => b.id === e.branchId)?.name ?? '',
})

/** Rough "minutes ago" of a last-active label. Only used to sort the column. */
function minutesAgo(label: string): number {
  if (label === 'Now' || label.startsWith('Invited')) return 0
  const minutes = label.match(/^(\d+) min ago$/)
  if (minutes) return Number(minutes[1])
  const hours = label.match(/^(\d+) h ago$/)
  if (hours) return Number(hours[1]) * 60
  if (label.startsWith('Today')) return 12 * 60
  if (label === 'Yesterday') return 24 * 60
  return 10_000
}

const employeeCounts = (list: Employee[]) => ({
  all: list.length,
  active: list.filter((e) => e.status === 'Active').length,
  inactive: list.filter((e) => e.status === 'Inactive').length,
})

export async function listEmployees(filter: EmployeeFilter = {}): Promise<EmployeeList> {
  await delay()
  const query = filter.search?.trim().toLowerCase() ?? ''
  const {
    page = 1,
    pageSize = 9,
    branchId = 'All',
    designation = 'All',
    level = 'All',
    status = 'All',
    sort,
    order,
  } = filter

  const scoped = employeeStore.filter((e) => branchId === 'All' || e.branchId === branchId).map(withLevel)
  const matched = scoped.filter((e) => {
    if (query && !`${e.name} ${e.email}`.toLowerCase().includes(query)) return false
    if (designation !== 'All' && e.designation !== designation) return false
    if (level !== 'All' && e.level !== level) return false
    if (status !== 'All' && e.status !== status) return false
    return true
  })

  if (sort) {
    const direction = sort.direction === 'asc' ? 1 : -1
    const value = (e: EmployeeRow) =>
      sort.key === 'name' ? e.name.toLowerCase() : sort.key === 'level' ? (e.level ?? 0) : minutesAgo(e.lastActive)
    matched.sort((x, y) => (value(x) < value(y) ? -1 : value(x) > value(y) ? 1 : 0) * direction)
  }

  if (order && !sort) {
    const rank = (id: string) => order.indexOf(id)
    matched.sort((x, y) => rank(x.id) - rank(y.id))
  }

  // The sample data holds a few rows, but the screen reports the whole company (486 employees).
  // Totals start from the Figma figures and follow any change made to the sample rows.
  // The whole company starts from 486 and the Colombo branch from 38. Other branches count their rows.
  const baseline = branchId === 'All' ? employeeTotals : branchId === 'colombo' ? colomboEmployeeTotals : null
  const now = employeeCounts(employeeStore.filter((e) => branchId === 'All' || e.branchId === branchId))
  const seed = employeeCounts(seedEmployees.filter((e) => branchId === 'All' || e.branchId === branchId))
  const counts = baseline
    ? {
        all: baseline.all + now.all - seed.all,
        active: baseline.active + now.active - seed.active,
        inactive: baseline.inactive + now.inactive - seed.inactive,
      }
    : now
  const unfiltered = !query && baseline !== null && designation === 'All' && level === 'All'
  const statusTotal = { All: counts.all, Active: counts.active, Inactive: counts.inactive }
  const total = unfiltered ? statusTotal[status] : matched.length
  const pageCount = unfiltered && status === 'All' ? employeePageCount : Math.max(1, Math.ceil(total / pageSize))

  return {
    items: matched.slice((page - 1) * pageSize, page * pageSize),
    total,
    pageCount,
    counts,
    needsDesignation: scoped.filter((e) => e.level === null),
  }
}

export async function getEmployee(id: string): Promise<EmployeeRow> {
  await delay()
  const employee = employeeStore.find((e) => e.id === id)
  if (!employee) throw new OrgError('not-found', 'Employee not found')
  return withLevel(employee)
}

export interface EmployeeProfile {
  employee: EmployeeRow
  slaMet: string
  complaints: ProfileComplaint[]
}

export async function getEmployeeProfile(id: string): Promise<EmployeeProfile> {
  await delay(150)
  const employee = employeeStore.find((e) => e.id === id)
  if (!employee) throw new OrgError('not-found', 'Employee not found')
  const profile = employeeProfiles[id]
  return {
    employee: withLevel(employee),
    slaMet: profile?.slaMet ?? '—',
    complaints: profile?.complaints ?? [],
  }
}

/** Branch ids and names for the Branch dropdown ("Choose from your company's branches"). */
export interface BranchOption {
  id: string
  name: string
  managerId: string | null
  managerName: string | null
}

export async function listBranchOptions(): Promise<BranchOption[]> {
  await delay(100)
  return branchStore.map((b) => ({
    id: b.id,
    name: b.name,
    managerId: b.managerId,
    managerName: employeeStore.find((e) => e.id === b.managerId)?.name ?? null,
  }))
}

export interface DesignationGroup {
  level: number
  name: string
  designations: string[]
}

/**
 * Designations offered when adding or editing, grouped by level (highest first).
 * Only designations placed in the hierarchy are offered, and Branch Manager is left out because it is
 * assigned from Edit employee. No groups at all is the "No eligible designations" state.
 */
export async function listEligibleDesignations(): Promise<DesignationGroup[]> {
  await delay(100)
  return ordinaryLevels(hierarchyStore)
    .filter((l) => l.designations.length > 0)
    .sort((a, b) => b.level - a.level)
    .map((l) => ({ level: l.level, name: l.name, designations: [...l.designations] }))
}

/** How many designations the company has defined but not placed in the hierarchy. */
export const countUnusedDesignations = () => hierarchyStore.unused.length

export interface NewEmployee {
  name: string
  email: string
  designation: string
  branchId: string
  status?: ActiveStatus
  /** Add them as the Branch Manager of the branch instead of giving them a designation. */
  branchManager?: boolean
}

export async function addEmployee(input: NewEmployee): Promise<EmployeeRow> {
  await delay()
  const branch = branchStore.find((b) => b.id === input.branchId)
  if (input.branchManager) {
    // A Branch Manager takes the reserved level, and a branch can have only one.
    if (branch?.managerId) throw new OrgError('branch-has-manager', `${branch.name} already has a Branch Manager`)
  } else if (!placedDesignations(hierarchyStore).includes(input.designation)) {
    throw new OrgError('not-in-hierarchy', `${input.designation} is not in your hierarchy`)
  }
  const status = input.status ?? 'Active'
  const employee: Employee = {
    id: slug(input.name) || `emp-${employeeStore.length + 1}`,
    name: input.name,
    initials: initialsOf(input.name),
    email: input.email,
    designation: input.branchManager ? BRANCH_MANAGER_DESIGNATION : input.designation,
    branchId: input.branchId,
    status,
    lastActive: 'Invited · just now',
    openTickets: 0,
    shift: status === 'Active' ? 'In Shift' : null,
    returnAt: null,
  }
  // New people go to the top of the list.
  employeeStore = [employee, ...employeeStore]
  if (branch) {
    branch.staffCount += 1
    if (input.branchManager) branch.managerId = employee.id
  }
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
  /** Designation the replaced Branch Manager moves to. */
  previousManagerDesignation?: string
}

export async function updateEmployee(id: string, changes: EmployeeChanges): Promise<EmployeeRow> {
  await delay()
  const employee = employeeStore.find((e) => e.id === id)
  if (!employee) throw new OrgError('not-found', 'Employee not found')

  const { replaceManager, previousManagerDesignation, ...fields } = changes
  const designation = fields.designation ?? employee.designation
  const branchId = fields.branchId ?? employee.branchId
  const wasManager = employee.designation === BRANCH_MANAGER_DESIGNATION

  if (designation === BRANCH_MANAGER_DESIGNATION) {
    const branch = branchStore.find((b) => b.id === branchId)
    if (branch && branch.managerId && branch.managerId !== id) {
      // One Branch Manager per branch: the current one must be replaced explicitly.
      if (!replaceManager) {
        throw new OrgError('branch-has-manager', `${branch.name} already has a Branch Manager`)
      }
      const previous = employeeStore.find((e) => e.id === branch.managerId)
      if (previous) previous.designation = previousManagerDesignation ?? ''
    }
    if (branch) branch.managerId = id
  } else {
    if (designation !== employee.designation && !placedDesignations(hierarchyStore).includes(designation)) {
      throw new OrgError('not-in-hierarchy', `${designation} is not in your hierarchy`)
    }
    // Stepping down from Branch Manager leaves the branch Unassigned.
    if (wasManager) {
      const branch = branchStore.find((b) => b.managerId === id)
      if (branch) branch.managerId = null
    }
  }

  if (fields.branchId && fields.branchId !== employee.branchId) {
    const from = branchStore.find((b) => b.id === employee.branchId)
    const to = branchStore.find((b) => b.id === fields.branchId)
    if (from) from.staffCount = Math.max(0, from.staffCount - 1)
    if (to) to.staffCount += 1
  }

  Object.assign(employee, fields)
  // An inactive account is never on shift; reactivating puts them back on shift.
  if (fields.status === 'Inactive') {
    employee.shift = null
    employee.returnAt = null
  } else if (fields.status === 'Active' && !employee.shift) {
    employee.shift = 'In Shift'
  }
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

// ------------------------------------------------------------------ Shifts

function shiftEmployee(id: string) {
  const employee = employeeStore.find((e) => e.id === id)
  if (!employee) throw new OrgError('not-found', 'Employee not found')
  return employee
}

/** The Branch Manager approves a break: the employee goes On Break until they are marked back in shift. */
export async function approveBreak(id: string): Promise<EmployeeRow> {
  await delay(250)
  const employee = shiftEmployee(id)
  employee.shift = 'On Break'
  employee.returnAt = null
  return withLevel(employee)
}

/** Sets the expected return time of someone on break. They stay On Break until marked back. */
export async function scheduleReturn(id: string, returnAt: string): Promise<EmployeeRow> {
  await delay(250)
  const employee = shiftEmployee(id)
  employee.returnAt = returnAt
  return withLevel(employee)
}

/** Marks someone back in shift now. */
export async function backToShift(id: string): Promise<EmployeeRow> {
  await delay(250)
  const employee = shiftEmployee(id)
  employee.shift = 'In Shift'
  employee.returnAt = null
  return withLevel(employee)
}

// --------------------------------------------------------------- Hierarchy

export interface HierarchyCheck {
  label: string
  /** Green tick, red cross (blocks saving) or orange warning (does not block). */
  state: 'ok' | 'error' | 'warn'
}

export interface HierarchyValidation {
  checks: HierarchyCheck[]
  /** Number of red checks. Saving is blocked until it is 0. */
  issues: number
  valid: boolean
}

/** The "Check & save" list on Configure hierarchy. An invalid configuration can't be saved. */
export function validateHierarchy(draft: Hierarchy): HierarchyValidation {
  const ordinary = ordinaryLevels(draft)
  const n = ordinary.length
  const numbers = ordinary.map((l) => l.level).sort((x, y) => x - y)
  const hasLevelOne = numbers[0] === 1
  const noGaps = numbers.every((value, index) => value === index + 1)
  const placed = ordinary.flatMap((l) => l.designations)
  const eachOnce = new Set(placed).size === placed.length
  const total = placed.length + draft.unused.length
  const flagged = seedEmployeesWithoutLevel(draft)

  const checks: HierarchyCheck[] = [
    { label: 'Level 1 exists and is the lowest level', state: hasLevelOne ? 'ok' : 'error' },
    { label: n > 0 ? `Levels run 1 to ${n} with no gaps` : 'Levels run 1 to n with no gaps', state: noGaps ? 'ok' : 'error' },
    { label: `Branch Manager is Level ${n + 1} (n+1) · Tenant Admin is Level ${n + 2} (n+2)`, state: 'ok' },
  ]

  // Name and designation problems are listed per level, highest level first.
  const levelProblems: HierarchyCheck[] = []
  for (const level of [...ordinary].sort((x, y) => y.level - x.level)) {
    if (level.name.trim() === '') {
      levelProblems.push({ label: `Level ${level.level} needs a name`, state: 'error' })
    }
    if (level.designations.length === 0) {
      levelProblems.push({
        label: `Level ${level.level} has no designations — assign one or remove the level`,
        state: 'error',
      })
    }
  }
  if (levelProblems.length === 0) {
    checks.push(
      { label: 'Every level has a name and at least one designation', state: 'ok' },
      { label: `${placed.length} of ${total} designations in use · each on one level`, state: eachOnce ? 'ok' : 'error' },
    )
  } else {
    checks.push(...levelProblems)
  }

  // A warning, not a blocker: affected employees are flagged and left unchanged.
  checks.push({
    label:
      flagged > 0
        ? `${flagged} employee${flagged === 1 ? '' : 's'} will need a valid designation (flagged, not changed)`
        : 'No employee needs a new designation',
    state: flagged > 0 ? 'warn' : 'ok',
  })

  const issues = checks.filter((check) => check.state === 'error').length
  return { checks, issues, valid: issues === 0 }
}

/** How many employees hold any of these designations. */
export function countEmployeesWith(designations: string[]): number {
  return designations.reduce((sum, name) => sum + (employeesPerDesignation[name] ?? 0), 0)
}

function seedEmployeesWithoutLevel(draft: Hierarchy) {
  const placed = new Set([BRANCH_MANAGER_DESIGNATION, ...ordinaryLevels(draft).flatMap((l) => l.designations)])
  return employeeStore.filter((e) => !placed.has(e.designation)).length
}

export async function getHierarchy(): Promise<Hierarchy> {
  await delay()
  return structuredClone(hierarchyStore)
}

/**
 * Removing a level renumbers the ones above it, so levels always run 1..n.
 * Its designations either move to Level 1 (moveToLowest) or leave the hierarchy and become unused.
 */
export function removeLevel(draft: Hierarchy, level: number, moveToLowest = false): Hierarchy {
  const target = draft.levels.find((l) => l.level === level && !l.reserved)
  if (!target) throw new OrgError('invalid-hierarchy', 'Only ordinary levels above Level 1 can be removed')
  if (level === 1) throw new OrgError('invalid-hierarchy', 'Level 1 is required')

  const ordinary = ordinaryLevels(draft)
    .filter((l) => l.level !== level)
    .map((l): HierarchyLevel => ({
      ...l,
      level: l.level > level ? l.level - 1 : l.level,
      designations: moveToLowest && l.level === 1 ? [...l.designations, ...target.designations] : l.designations,
    }))
  return reserveTop(ordinary, moveToLowest ? draft.unused : [...draft.unused, ...target.designations])
}

/** Changes the name of an ordinary level. */
export function renameLevel(draft: Hierarchy, level: number, name: string): Hierarchy {
  return reserveTop(
    ordinaryLevels(draft).map((l) => (l.level === level ? { ...l, name } : l)),
    draft.unused,
  )
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
