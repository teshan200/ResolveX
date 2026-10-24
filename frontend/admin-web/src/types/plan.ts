export type PlanId = 'basic' | 'pro' | 'enterprise'

export interface Plan {
  id: PlanId
  name: string
  basePrice: number
  includedOutlets: number
  // Only the Enterprise plan has no fixed outlet limit and charges for extra outlets.
  extraOutletPrice?: number
  maxOutlets?: number
  popular?: boolean
  features: string[]
}

export interface PriceBreakdown {
  basePrice: number
  extraOutlets: number
  extraOutletsTotal: number
  total: number
}
