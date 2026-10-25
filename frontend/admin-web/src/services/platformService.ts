import type {
  AdminPlan,
  AuditLogData,
  PlatformOverview,
  SubscriptionsData,
} from '../types/platform'

// Mock implementation. Replace the bodies with real calls when the backend is ready.

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
        label: 'Plan revenue',
        value: 'LKR 4.1M',
        delta: '12.4%',
        trend: 'up',
        caption: '+6.1% vs last period',
      },
      {
        id: 'trials',
        label: 'Trials',
        value: '14',
        delta: '0.0%',
        trend: 'flat',
        caption: '5 convert this week',
      },
      {
        id: 'pastDue',
        label: 'Past due',
        value: '4',
        delta: '8.1%',
        trend: 'down',
        caption: 'LKR 120k at risk',
      },
    ],
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
    kpis: [
      {
        id: 'revenue',
        label: 'Plan revenue',
        value: 'LKR 4.1M',
        delta: '12.4%',
        trend: 'up',
        caption: '+6.1% vs last period',
      },
      {
        id: 'trialToPaid',
        label: 'Trial → paid',
        value: '42%',
        delta: '12.4%',
        trend: 'up',
        caption: 'last 90 days',
      },
      {
        id: 'churn',
        label: 'Churn (30d)',
        value: '1.6%',
        delta: '8.1%',
        trend: 'down',
        caption: '2 tenants',
      },
      {
        id: 'grace',
        label: 'In grace period',
        value: '4',
        delta: '8.1%',
        trend: 'down',
        caption: 'LKR 120k at risk',
      },
    ],
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
    total: 3412,
    pageCount: 13,
    events: [
      {
        id: 'aud-1',
        time: '19 Oct · 16:02:41',
        actorInitials: 'CG',
        actorName: 'Chamod G.',
        action: 'Suspended tenant',
        detail: 'Urban Kottu Bar · non-payment',
        category: 'Tenants',
        categoryTone: 'neutral',
        target: 'tn_2c81aa',
      },
      {
        id: 'aud-2',
        time: '19 Oct · 15:47:10',
        actorInitials: 'CG',
        actorName: 'Chamod G.',
        action: 'Started read-only impersonation',
        detail: 'Harbour Grill · ticket #3310 support request',
        category: 'Impersonation',
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
        category: 'Subscriptions',
        categoryTone: 'neutral',
        target: 'tn_7f3a91',
      },
      {
        id: 'aud-4',
        time: '18 Oct · 18:12:33',
        actorInitials: 'DS',
        actorName: 'Dulani S.',
        action: 'Changed plan pricing',
        detail: 'Enterprise: additional outlet price set to LKR 3,000',
        category: 'Plans',
        categoryTone: 'neutral',
        target: 'plan_enterprise',
      },
      {
        id: 'aud-5',
        time: '18 Oct · 09:01:19',
        actorInitials: 'CG',
        actorName: 'Chamod G.',
        action: 'Activated tenant',
        detail: 'Ceylon Curry Co. · email verified',
        category: 'Tenants',
        categoryTone: 'neutral',
        target: 'tn_91b0e2',
      },
      {
        id: 'aud-6',
        time: '17 Oct · 14:44:52',
        actorInitials: 'CG',
        actorName: 'Chamod G.',
        action: 'Invited platform admin',
        detail: 'dulani@resolvex.io · Support role',
        category: 'Admin users',
        categoryTone: 'neutral',
        target: 'adm_0042',
      },
    ],
  }
}
