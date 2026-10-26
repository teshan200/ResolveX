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
