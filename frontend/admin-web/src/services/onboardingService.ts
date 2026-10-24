// Mock implementation. Replace with the activated tenant returned by POST /tenants/activate.

export interface OnboardingSummary {
  companyName: string
  email: string
  organizationId: string
}

export function getOnboardingSummary(): OnboardingSummary {
  return {
    companyName: 'Spice Garden Holdings',
    email: 'marcus@spicegarden.lk',
    organizationId: 'RX-84920',
  }
}
