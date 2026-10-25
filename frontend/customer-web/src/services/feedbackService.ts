import type { FeedbackFormValues } from '../features/feedback/schema'
import { mockBranding } from '../mocks/branding'
import { registerCase } from '../mocks/cases'

// Mock implementation. Replace the body with a real call when the backend is ready.

export interface FeedbackReceipt {
  caseId: string
  branch: string
  /** Table the guest entered, if any. */
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
  // Remembered so the tracking lookup accepts the email the guest just gave.
  if (values.email) registerCase({ caseId, email: values.email })

  return {
    caseId,
    branch: mockBranding.branch,
    table: values.tableNumber || null,
    name: values.name || null,
    email: values.email || null,
  }
}
