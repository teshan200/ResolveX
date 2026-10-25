import type { TagTone } from '../components/ui'

export type CompanyStatus = 'Active' | 'Trial' | 'Past due' | 'Suspended' | 'Pending verification'

export type CompanyFilter = 'All' | 'Active' | 'Trial' | 'Past due' | 'Suspended' | 'Pending'

export interface Company {
  id: string
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
}

export interface CompanyList {
  companies: Company[]
  total: number
  pageCount: number
  counts: Record<CompanyFilter, number>
}

export interface UsageMeter {
  label: string
  summary: string
  percent: number
}

export interface TenantAdmin {
  name: string
  role: string
  email: string
  lastSignIn: string
  twoFactor: boolean
}

export interface CompanyDetail extends Company {
  tenantId: string
  createdAt: string
  adminCount: number
  planCapacity: number
  tickets30d: string
  slaBreach: string
  usage: UsageMeter[]
  // Present while a payment has failed.
  invoice?: {
    failedOn: string
    graceEnds: string
    amount: number
    retries: string
    reason: string
    emailsSent: number
  }
  admins: TenantAdmin[]
  region: string
  emailVerified: string
}

export interface SuspendRequest {
  reason: string
  notifyAdmins: boolean
}
