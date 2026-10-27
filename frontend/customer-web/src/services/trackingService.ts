import type { CaseDetail } from '../features/tracking/types'
import { findCase, getCaseDetail, markResolved } from '../mocks/cases'

// Mock implementation. Replace the bodies with real calls when the backend is ready.

const NOT_FOUND = 'We couldn’t find a case with that ID. Check it and try again.'

function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// GET /public/cases/{caseId}. A case is visible to anyone who holds its case ID.
export async function getCase(caseId: string): Promise<CaseDetail> {
  await delay(400)

  const match = findCase(caseId)
  if (!match) throw new Error(NOT_FOUND)

  return getCaseDetail(match)
}

// POST /public/cases/lookup
export async function lookupCase(caseId: string): Promise<{ caseId: string }> {
  await delay()

  const match = findCase(caseId)
  if (!match) throw new Error(NOT_FOUND)

  return { caseId: match.caseId }
}

// POST /public/cases/{caseId}/confirm-resolved. Returns the updated case.
export async function confirmResolved(caseId: string): Promise<CaseDetail> {
  await delay()

  const match = findCase(caseId)
  if (!match) throw new Error(NOT_FOUND)

  markResolved(match.caseId)
  return getCaseDetail(match)
}
