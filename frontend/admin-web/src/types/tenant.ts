export interface RegisterTenantRequest {
  companyName: string
  adminName: string
  phone: string
  email: string
  password: string
}

export interface RegisterTenantResponse {
  tenantId: string
  email: string
}
