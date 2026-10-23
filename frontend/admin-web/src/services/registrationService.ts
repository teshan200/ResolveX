import type { RegisterTenantRequest, RegisterTenantResponse } from '../types/tenant'

// Mock implementation. Replace the bodies with real calls when the backend is ready.

const TAKEN_EMAIL = 'taken@example.com'

function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// POST /tenants/register
export async function registerTenant(
  request: RegisterTenantRequest,
): Promise<RegisterTenantResponse> {
  await delay()

  if (request.email.toLowerCase() === TAKEN_EMAIL) {
    throw new Error('An account with this email already exists.')
  }

  return { tenantId: crypto.randomUUID(), email: request.email }
}

// POST /tenants/verify-email (resend)
export async function resendVerificationEmail(email: string): Promise<void> {
  await delay()
  console.info(`Mock: verification email resent to ${email}`)
}
