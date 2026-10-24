export interface TenantBranding {
  restaurant: string
  /** Branch and service point the QR code is mapped to, e.g. "Colombo - Dining Area". */
  location: string
  /** Branch name used in confirmation messages, e.g. "Colombo Branch". */
  branch: string
}

// Stand-in for the branding returned by the QR lookup until the backend exists.
export const mockBranding: TenantBranding = {
  restaurant: 'Spice Garden',
  location: 'Colombo - Dining Area',
  branch: 'Colombo Branch',
}
