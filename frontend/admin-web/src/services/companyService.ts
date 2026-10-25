import type {
  Company,
  CompanyDetail,
  CompanyFilter,
  CompanyList,
  SuspendRequest,
  TenantAdmin,
  UsageMeter,
} from '../types/company'

// Mock implementation. Replace the bodies with real calls when the backend is ready.

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const companies: Company[] = [
  {
    id: 'spice-garden',
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
  },
  {
    id: 'bistrogate',
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
  },
  {
    id: 'ceylon-curry',
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
  },
  {
    id: 'harbour-grill',
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
  },
  {
    id: 'urban-kottu',
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
  },
  {
    id: 'lotus-tea',
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

const usageMeters: UsageMeter[] = [
  { label: 'AI classifications', summary: '1,148 of 10,000', percent: 30 },
  { label: 'File storage', summary: '3.1 of 10 GB', percent: 30 },
  { label: 'API calls', summary: '182k of 1M', percent: 30 },
]

function adminsFor(company: Company): TenantAdmin[] {
  if (company.id === 'harbour-grill') {
    return [
      {
        name: 'Sanjeewa Herath',
        role: 'Owner',
        email: 'sanjeewa@harbourgrill.lk',
        lastSignIn: 'Yesterday 21:14',
        twoFactor: true,
      },
      {
        name: 'Dilini Costa',
        role: 'Company admin',
        email: 'dilini@harbourgrill.lk',
        lastSignIn: '4 Nov 09:02',
        twoFactor: false,
      },
    ]
  }
  return [
    {
      name: `${company.name} Owner`,
      role: 'Owner',
      email: `owner@${company.domain}`,
      lastSignIn: company.lastActivity,
      twoFactor: true,
    },
  ]
}

function toDetail(company: Company, index: number): CompanyDetail {
  const harbour = company.id === 'harbour-grill'
  return {
    ...company,
    tenantId: harbour ? 'tn_7f3a91' : `tn_${(0x3b2c10 + index * 0x1f4a7).toString(16)}`,
    createdAt: harbour ? '14 Mar 2026' : '2 Feb 2026',
    adminCount: harbour ? 12 : Math.max(1, Math.round(company.users / 40)),
    planCapacity: planCapacity[company.plan ?? ''] ?? 0,
    tickets30d: harbour ? '1,148' : (company.users * 12).toLocaleString('en-US'),
    slaBreach: harbour ? '4.8%' : '2.1%',
    usage: usageMeters,
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
    admins: adminsFor(company),
    region: 'ap-south-1',
    emailVerified: company.status === 'Pending verification' ? 'No' : 'Yes · 14 Mar 2026',
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
  const index = companies.findIndex((company) => company.id === id)
  return index === -1 ? undefined : toDetail(companies[index], index)
}

// POST /admin/tenants/{id}/suspend
export async function suspendCompany(id: string, request: SuspendRequest): Promise<void> {
  await delay(600)
  const company = companies.find((item) => item.id === id)
  if (!company) throw new Error('Company not found.')
  company.status = 'Suspended'
  console.info(`Mock: ${company.name} suspended (${request.reason})`)
}
