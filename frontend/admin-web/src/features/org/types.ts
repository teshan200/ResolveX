export type ActiveStatus = 'Active' | 'Inactive'

export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  /** Null while the branch has no Branch Manager ("Unassigned" in the list). */
  managerId: string | null
  staffCount: number
  status: ActiveStatus
}

/** Extra figures shown on the Branch detail screen. */
export interface BranchDetail {
  createdAt: string
  /** When the current Branch Manager was assigned. Null while the branch is Unassigned. */
  managerSince: string | null
  qrCodes: number
  openComplaints: number
  slaBreachRate: string
}

/** Whether an active employee is working or on an approved break. */
export type ShiftStatus = 'In Shift' | 'On Break'

export interface Employee {
  id: string
  name: string
  initials: string
  email: string
  /** Name of a designation. Its level comes from the hierarchy, never from the employee. */
  designation: string
  branchId: string
  status: ActiveStatus
  lastActive: string
  openTickets: number
  /** Null for someone with an inactive account. */
  shift: ShiftStatus | null
  /** Expected return from an approved break, e.g. "19 Oct, 3:30 PM". Null until a time is set. */
  returnAt: string | null
}

export interface HierarchyLevel {
  /** 1 is the lowest ordinary level. Branch Manager is n+1 and Tenant Admin is n+2. */
  level: number
  name: string
  /** True for Branch Manager (n+1) and Tenant Admin (n+2), which are placed automatically. */
  reserved: boolean
  designations: string[]
}

export interface Hierarchy {
  levels: HierarchyLevel[]
  /** Designations the company has defined but not placed on any level. */
  unused: string[]
}

export type ComplaintState = 'Claimed' | 'Escalated' | 'Resolved'

/** A complaint shown on an employee's profile. */
export interface ProfileComplaint {
  id: string
  title: string
  state: ComplaintState
}
