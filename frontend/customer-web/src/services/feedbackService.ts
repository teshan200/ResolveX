import type { FeedbackFormValues } from '../features/feedback/schema'
import { mockBranding } from '../mocks/branding'
import { registerCase } from '../mocks/cases'

// Mock implementation. Replace the body with a real call when the backend is ready.

export interface FeedbackReceipt {
  caseId: string
  branch: string
  /** Table the QR code is placed on, if it is mapped to one. */
  table: string | null
  /** Guest name, if given. */
  name: string | null
  /** Email for resolution updates, if given. */
  email: string | null
}

function delay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// POST /public/feedback/{qrId}
export async function submitFeedback(
  _qrId: string,
  values: FeedbackFormValues,
): Promise<FeedbackReceipt> {
  await delay()

  // Fixed so the tracking screens can use the same demo case.
  const caseId = 'RX-1042'
  // Remembered so the tracking screens show what the guest just submitted.
  registerCase({
    caseId,
    submittedAt: new Date().toISOString(),
    table: mockBranding.table,
    areas: values.areas,
  })

  return {
    caseId,
    branch: mockBranding.branch,
    table: mockBranding.table,
    name: values.name || null,
    email: values.email || null,
  }
}
