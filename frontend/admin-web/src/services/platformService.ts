import type { KpiTrend } from '../components/ui'
import type {
  AdminPlan,
  AuditLogData,
  PlatformKpi,
  PlatformOverview,
  SubscriptionsData,
} from '../types/platform'

// Mock implementation. Replace the bodies with real calls when the backend is ready.

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type KpiRow = [value: string, delta: string, trend: KpiTrend, caption: string]

const SUBSCRIPTION_KPI_LABELS: [id: string, label: string][] = [
  ['revenue', 'Plan revenue'],
  ['trialToPaid', 'Trial → paid'],
  ['churn', 'Churn'],
  ['grace', 'Past due (grace period)'],
]

function subscriptionKpis(rows: KpiRow[]): PlatformKpi[] {
  return rows.map(([value, delta, trend, caption], index) => ({
    id: SUBSCRIPTION_KPI_LABELS[index][0],
    label: SUBSCRIPTION_KPI_LABELS[index][1],
    value,
    delta,
    trend,
    caption,
  }))
}

// GET /admin/usage
export async function getPlatformOverview(): Promise<PlatformOverview> {
  await delay()
  return {
    kpis: [
      {
        id: 'tenants',
        label: 'Active tenants',
        value: '128',
        delta: '12.4%',
        trend: 'up',
        caption: '+9 this month',
      },
      {
        id: 'revenue',
        label: 'Plan revenue · This month',
        value: 'LKR 4.1M',
        delta: '5.1%',
        trend: 'up',
        caption: '+5.1% vs last month',
      },
      {
        id: 'trials',
        label: 'Trials · This month',
        value: '14',
        delta: '0.0%',
        trend: 'flat',
        caption: 'vs 16 last month',
      },
      {
        id: 'pastDue',
        label: 'Past due · This month',
        value: '4',
        delta: '8.1%',
        trend: 'down',
        caption: 'LKR 120k at risk',
      },
    ],
    period: 'This month · 1–26 Oct 2026',
    ticketsProcessed: [0, 0.2, 0.12, 0.5, 0.4, 0.8, 0.7, 1],
    ticketsBreached: [0, 0.095, 0.238, 0.429, 0.524, 0.762, 0.714, 1],
    // Figma draws the ring as 38 / 24 / 18 / 20 while the legend reads 54 / 28 / 12 / 6.
    tenantsByPlan: [
      { label: 'Pro', percent: 54, arcShare: 0.38, color: '#155e54' },
      { label: 'Basic', percent: 28, arcShare: 0.24, color: '#d97706' },
      { label: 'Enterprise', percent: 12, arcShare: 0.18, color: '#2563eb' },
      { label: 'Trial', percent: 6, arcShare: 0.2, color: '#94a3a1' },
    ],
    attention: [
      {
        id: 'harbour-payment',
        companyId: 'harbour-grill',
        title: 'Harbour Grill payment failed',
        detail: 'Grace period ends 7 Nov · LKR 30,000',
        tone: 'danger',
      },
      {
        id: 'lotus-unverified',
        companyId: 'lotus-tea',
        title: 'Lotus Tea Rooms not verified',
        detail: 'Signed up 2 days ago · email unconfirmed',
        tone: 'warning',
      },
    ],
  }
}

// GET /admin/subscriptions
export async function getSubscriptions(): Promise<SubscriptionsData> {
  await delay()
  return {
    kpisByPeriod: {
      'Last 7 days': subscriptionKpis([
        ['LKR 1.09M', '0.6%', 'down', '−0.6% vs previous 7 days'],
        ['43%', '1 pt', 'up', '3 of 7 trials converted'],
        ['0.0%', '0.8 pts', 'down', '0 tenants'],
        ['1', '1', 'down', 'LKR 30k at risk'],
      ]),
      'Last 30 days': subscriptionKpis([
        ['LKR 4.59M', '17.2%', 'up', '+17.2% vs previous 30 days'],
        ['41%', '3 pts', 'up', '7 of 17 trials converted'],
        ['3.1%', '1.5 pts', 'up', '4 tenants'],
        ['6', '3', 'up', 'LKR 175k at risk'],
      ]),
      'Last 90 days': subscriptionKpis([
        ['LKR 12.1M', '—', 'flat', '90-day total'],
        ['40%', '—', 'flat', '19 of 47 trials converted'],
        ['5.5%', '—', 'flat', '7 tenants'],
        ['12', '—', 'flat', 'LKR 340k at risk'],
      ]),
      'This month': subscriptionKpis([
        ['LKR 4.1M', '5.1%', 'up', '+5.1% vs last month'],
        ['43%', '5 pts', 'up', '6 of 14 trials converted'],
        ['1.6%', '0.0 pts', 'flat', '2 tenants'],
        ['4', '1', 'down', 'LKR 120k at risk'],
      ]),
      'Last month': subscriptionKpis([
        ['LKR 3.9M', '5.4%', 'up', '+5.4% vs August'],
        ['38%', '2 pts', 'down', '6 of 16 trials converted'],
        ['1.6%', '0.7 pts', 'down', '2 tenants'],
        ['5', '2', 'up', 'LKR 150k at risk'],
      ]),
    },
    events: [
      {
        id: 'evt-1',
        company: 'Harbour Grill',
        event: 'Payment failed',
        type: 'Failed payments',
        plan: 'Pro · 7 outlets',
        amount: 'LKR 30,000',
        statusLabel: 'Retry 3/3',
        statusTone: 'reopened',
        when: '2 Nov, 06:00',
        failed: true,
      },
      {
        id: 'evt-2',
        company: 'BistroGate Restaurant Group',
        event: 'Renewed',
        type: 'Renewals',
        plan: 'Enterprise · 58 outlets',
        amount: 'LKR 149,000',
        statusLabel: 'Paid',
        statusTone: 'resolved',
        when: '1 Nov, 00:00',
      },
      {
        id: 'evt-3',
        company: 'Ceylon Curry Co.',
        event: 'Trial started',
        type: 'Trials',
        plan: 'Basic · 14-day trial',
        amount: 'LKR 0',
        statusLabel: 'Trial',
        statusTone: 'new',
        when: '30 Oct, 11:24',
      },
      {
        id: 'evt-4',
        company: 'Spice Garden Holdings',
        event: 'Upgraded',
        type: 'Upgrades',
        plan: 'Pro → Enterprise',
        amount: '+LKR 41,000',
        statusLabel: 'Next invoice',
        statusTone: 'resolved',
        when: '28 Oct, 15:10',
      },
      {
        id: 'evt-5',
        company: 'Kandy Bites',
        event: 'Downgraded',
        type: 'Downgrades',
        plan: 'Pro → Basic',
        amount: '−LKR 20,000',
        statusLabel: 'Next cycle',
        statusTone: 'assigned',
        when: '26 Oct, 09:41',
      },
      {
        id: 'evt-6',
        company: 'Urban Kottu Bar',
        event: 'Suspended',
        type: 'Cancellations',
        plan: 'Basic · non-payment',
        amount: '—',
        statusLabel: 'Suspended',
        statusTone: 'escalated',
        when: '20 Oct, 00:00',
      },
    ],
  }
}

// GET /admin/plans
export async function getAdminPlans(): Promise<AdminPlan[]> {
  await delay()
  return [
    {
      id: 'basic',
      name: 'Basic',
      headline: 'LKR 10,000 · up to 3',
      caption: '37 tenants · 14-day trial',
    },
    {
      id: 'pro',
      name: 'Pro',
      headline: 'LKR 30,000 · up to 15',
      caption: '72 tenants · 14-day trial',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      headline: 'LKR 50,000 · 25 incl.',
      caption: '16 tenants · +LKR 3,000 per outlet over 25',
    },
  ]
}

// PUT /admin/plans/{id}
export async function publishPlanChanges(): Promise<void> {
  await delay(600)
  console.info('Mock: plan changes published')
}

// GET /admin/audit-logs
export async function getAuditLog(): Promise<AuditLogData> {
  await delay()
  // The mock returns the same events for every page.
  return {
    total: 418,
    pageCount: 13,
    events: [
      {
        id: 'aud-1',
        time: '19 Oct · 16:02:41',
        actorInitials: 'CG',
        actorName: 'Chamod G.',
        action: 'Suspended tenant',
        detail: 'Urban Kottu Bar · non-payment',
        category: 'Suspension',
        categoryTone: 'neutral',
        target: 'tn_2c81aa',
      },
      {
        id: 'aud-2',
        time: '19 Oct · 15:47:10',
        actorInitials: 'CG',
        actorName: 'Chamod G.',
        action: 'Changed subscription plan',
        detail: 'Harbour Grill · Basic → Pro',
        category: 'Plan change',
        categoryTone: 'brand',
        target: 'tn_7f3a91',
      },
      {
        id: 'aud-3',
        time: '19 Oct · 11:20:05',
        actorInitials: 'SY',
        actorName: 'System',
        action: 'Extended grace period',
        detail: 'Harbour Grill · +3 days (policy)',
        category: 'Grace period',
        categoryTone: 'neutral',
        target: 'tn_7f3a91',
      },
      {
        id: 'aud-4',
        time: '18 Oct · 18:12:33',
        actorInitials: 'DS',
        actorName: 'Dulani S.',
        action: 'Changed subscription plan',
        detail: 'Spice Garden Holdings · Pro → Enterprise',
        category: 'Plan change',
        categoryTone: 'brand',
        target: 'tn_4be210',
      },
      {
        id: 'aud-5',
        time: '18 Oct · 09:01:19',
        actorInitials: 'CG',
        actorName: 'Chamod G.',
        action: 'Activated tenant',
        detail: 'Ceylon Curry Co. · email verified',
        category: 'Activation',
        categoryTone: 'neutral',
        target: 'tn_91b0e2',
      },
      {
        id: 'aud-6',
        time: '17 Oct · 14:44:52',
        actorInitials: 'CG',
        actorName: 'Chamod G.',
        action: 'Activated tenant',
        detail: 'BistroGate Restaurant Group · email verified',
        category: 'Activation',
        categoryTone: 'neutral',
        target: 'tn_3a19cd',
      },
    ],
  }
}
