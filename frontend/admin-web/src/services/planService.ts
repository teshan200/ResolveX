import type { Plan, PlanId, PriceBreakdown } from '../types/plan'

// Mock implementation. Replace getPlans with a call to GET /plans when the backend is ready.

const commonFeatures = [
  'Customizable QR codes & feedback forms',
  'Email notifications & ticket alerts',
  'AI-powered complaint classification',
  'Custom SLA configuration',
  'Comprehensive analytics',
  '24/7 support',
]

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    basePrice: 10000,
    includedOutlets: 3,
    maxOutlets: 3,
    features: ['Up to 3 branches/outlets', ...commonFeatures],
  },
  {
    id: 'pro',
    name: 'Pro',
    basePrice: 30000,
    includedOutlets: 15,
    maxOutlets: 15,
    popular: true,
    features: ['Up to 15 branches/outlets', ...commonFeatures],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    basePrice: 50000,
    includedOutlets: 25,
    extraOutletPrice: 3000,
    features: ['25 outlets included · +LKR 3,000 per extra outlet', ...commonFeatures],
  },
]

export async function getPlans(): Promise<Plan[]> {
  return plans
}

export function getPlan(id: PlanId): Plan {
  return plans.find((plan) => plan.id === id) ?? plans[0]
}

export function calculatePrice(plan: Plan, outlets: number): PriceBreakdown {
  const extraOutlets = Math.max(0, outlets - plan.includedOutlets)
  const extraOutletsTotal = extraOutlets * (plan.extraOutletPrice ?? 0)
  return {
    basePrice: plan.basePrice,
    extraOutlets,
    extraOutletsTotal,
    total: plan.basePrice + extraOutletsTotal,
  }
}

// The cheapest plan that can hold the given number of outlets.
export function recommendPlan(outlets: number): Plan {
  return (
    plans.find((plan) => plan.maxOutlets === undefined || outlets <= plan.maxOutlets) ??
    plans[plans.length - 1]
  )
}

export function formatLkr(amount: number): string {
  return `LKR ${amount.toLocaleString('en-US')}`
}
