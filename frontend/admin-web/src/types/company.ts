import type { TagTone } from '../components/ui'

export type CompanyStatus = 'Active' | 'Trial' | 'Past due' | 'Suspended' | 'Pending verification'

export type CompanyFilter = 'All' | 'Active' | 'Trial' | 'Past due' | 'Suspended' | 'Pending'

export interface TenantAdmin {
  name: string
  initials: string
  role: string
  email: string
  lastSignIn: string
}

export interface Company {
  id: string
  tenantId: string
  name: string
  initials: string
  domain: string
  city: string
  // Null while the company has not picked a plan yet.
  plan: string | null
  planTone: TagTone
  branches: number | null
  users: number
  status: CompanyStatus
  // Monthly plan price in LKR, null for trials and companies without a plan.
  planPrice: number | null
  lastActivity: string
  admin: TenantAdmin
}

export interface CompanyList {
  companies: Company[]
  total: number
  pageCount: number
  counts: Record<CompanyFilter, number>
}

export interface CompanyDetail extends Company {
  createdAt: string
  planCapacity: number
  tickets30d: string
  slaBreach: string
  // Present while a payment has failed.
  invoice?: {
    failedOn: string
    graceEnds: string
    amount: number
    retries: string
    reason: string
    emailsSent: number
  }
}

export interface AdminUserRow {
  name: string
  initials: string
  role: string
  email: string
  companyName: string
  tenantId: string
}

export interface AdminUserList {
  admins: AdminUserRow[]
  total: number
  pageCount: number
}

export interface SuspendRequest {
  reason: string
  notifyAdmins: boolean
}
