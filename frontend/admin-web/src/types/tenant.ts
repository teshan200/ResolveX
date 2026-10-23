export interface RegisterTenantRequest {
  companyName: string
  email: string
  password: string
}

export interface RegisterTenantResponse {
  tenantId: string
  email: string
}
