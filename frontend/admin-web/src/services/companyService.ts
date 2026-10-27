import type {
  AdminUserList,
  Company,
  CompanyDetail,
  CompanyFilter,
  CompanyList,
  SuspendRequest,
} from '../types/company'

// Mock implementation. Replace the bodies with real calls when the backend is ready.

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const companies: Company[] = [
  {
    id: 'spice-garden',
    tenantId: 'tn_4be210',
    name: 'Spice Garden Holdings',
    initials: 'SG',
    domain: 'spicegarden.lk',
    city: 'Colombo',
    plan: 'Enterprise',
    planTone: 'info',
    branches: 32,
    users: 486,
    status: 'Active',
    planPrice: 71000,
    lastActivity: '2 min ago',
    admin: {
      name: 'Marcus Vance',
      initials: 'MV',
      role: 'Tenant Admin',
      email: 'marcus.vance@spicegarden.lk',
      lastSignIn: 'Today 09:12',
    },
  },
  {
    id: 'bistrogate',
    tenantId: 'tn_3a19cd',
    name: 'BistroGate Restaurant Group',
    initials: 'BG',
    domain: 'bistrogate.com',
    city: 'Kandy',
    plan: 'Enterprise',
    planTone: 'brand',
    branches: 58,
    users: 1204,
    status: 'Active',
    planPrice: 149000,
    lastActivity: 'Now',
    admin: {
      name: 'Ruwan Fernando',
      initials: 'RF',
      role: 'Tenant Admin',
      email: 'ruwan@bistrogate.com',
      lastSignIn: 'Today 10:40',
    },
  },
  {
    id: 'ceylon-curry',
    tenantId: 'tn_91b0e2',
    name: 'Ceylon Curry Co.',
    initials: 'CC',
    domain: 'ceyloncurry.lk',
    city: 'Galle',
    plan: 'Basic',
    planTone: 'neutral',
    branches: 3,
    users: 28,
    status: 'Trial',
    planPrice: null,
    lastActivity: '1 h ago',
    admin: {
      name: 'Ishara Dias',
      initials: 'ID',
      role: 'Tenant Admin',
      email: 'ishara@ceyloncurry.lk',
      lastSignIn: 'Today 08:55',
    },
  },
  {
    id: 'harbour-grill',
    tenantId: 'tn_7f3a91',
    name: 'Harbour Grill',
    initials: 'HG',
    domain: 'harbourgrill.lk',
    city: 'Negombo',
    plan: 'Pro',
    planTone: 'info',
    branches: 7,
    users: 96,
    status: 'Past due',
    planPrice: 30000,
    lastActivity: 'Yesterday',
    admin: {
      name: 'Sanjeewa Herath',
      initials: 'SH',
      role: 'Tenant Admin',
      email: 'sanjeewa@harbourgrill.lk',
      lastSignIn: 'Yesterday 21:14',
    },
  },
  {
    id: 'urban-kottu',
    tenantId: 'tn_2c81aa',
    name: 'Urban Kottu Bar',
    initials: 'UK',
    domain: 'urbankottu.lk',
    city: 'Colombo',
    plan: 'Basic',
    planTone: 'neutral',
    branches: 2,
    users: 19,
    status: 'Suspended',
    planPrice: null,
    lastActivity: '12 days ago',
    admin: {
      name: 'Kasun Wijeratne',
      initials: 'KW',
      role: 'Tenant Admin',
      email: 'kasun@urbankottu.lk',
      lastSignIn: '14 Oct 18:30',
    },
  },
  {
    id: 'lotus-tea',
    tenantId: 'tn_5d0c77',
    name: 'Lotus Tea Rooms',
    initials: 'LT',
    domain: 'lotustea.lk',
    city: 'Nuwara Eliya',
    plan: null,
    planTone: 'neutral',
    branches: null,
    users: 1,
    status: 'Pending verification',
    planPrice: null,
    lastActivity: '—',
    admin: {
      name: 'Tharushi Peiris',
      initials: 'TP',
      role: 'Tenant Admin',
      email: 'tharushi@lotustea.lk',
      lastSignIn: '—',
    },
  },
]

// The status chips show platform-wide totals, not just the rows on this page.
const counts: Record<CompanyFilter, number> = {
  All: 134,
  Active: 112,
  Trial: 14,
  'Past due': 4,
  Suspended: 3,
  Pending: 1,
}

const planCapacity: Record<string, number | null> = { Basic: 3, Pro: 15, Enterprise: null }

function toDetail(company: Company): CompanyDetail {
  const harbour = company.id === 'harbour-grill'
  return {
    ...company,
    createdAt: harbour ? '14 Mar 2026' : '2 Feb 2026',
    planCapacity: planCapacity[company.plan ?? ''] ?? 0,
    tickets30d: harbour ? '1,148' : (company.users * 12).toLocaleString('en-US'),
    slaBreach: harbour ? '4.8%' : '2.1%',
    invoice: harbour
      ? {
          failedOn: '2 Nov',
          graceEnds: '7 Nov 2026',
          amount: 30000,
          retries: '3 of 3 failed',
          reason: 'insufficient funds',
          emailsSent: 2,
        }
      : undefined,
  }
}

// GET /admin/tenants
export async function getCompanies(): Promise<CompanyList> {
  await delay()
  // The mock returns the same rows for every page.
  return { companies: [...companies], total: counts.All, pageCount: 13, counts }
}

// GET /admin/tenants/{id}
export async function getCompany(id: string): Promise<CompanyDetail | undefined> {
  await delay()
  const company = companies.find((item) => item.id === id)
  return company ? toDetail(company) : undefined
}

// GET /admin/tenant-admins
export async function getAdminUsers(): Promise<AdminUserList> {
  await delay()
  // The mock returns the same rows for every page.
  return {
    total: 134,
    pageCount: 13,
    admins: companies.map((company) => ({
      name: company.admin.name,
      initials: company.admin.initials,
      role: 'Tenant admin',
      email: company.admin.email,
      companyName: company.name,
      tenantId: company.tenantId,
    })),
  }
}

// POST /admin/tenants/{id}/suspend
export async function suspendCompany(id: string, request: SuspendRequest): Promise<void> {
  await delay(600)
  const company = companies.find((item) => item.id === id)
  if (!company) throw new Error('Company not found.')
  company.status = 'Suspended'
  console.info(`Mock: ${company.name} suspended (${request.reason})`)
}
