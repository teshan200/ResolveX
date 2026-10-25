import { findCase } from '../mocks/cases'

// Mock implementation. Replace the body with a real call when the backend is ready.

function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// POST /public/cases/lookup
export async function lookupCase(caseId: string, email: string): Promise<{ caseId: string }> {
  await delay()

  const match = findCase(caseId, email)
  if (!match) {
    throw new Error('We couldn’t find a case matching that case ID and email.')
  }

  return { caseId: match.caseId }
}
