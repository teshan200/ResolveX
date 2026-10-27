import { z } from 'zod'

export const trackCaseSchema = z.object({
  caseId: z
    .string()
    .trim()
    .min(1, 'Enter your case ID')
    .regex(/^RX-\d{3,}$/i, 'Enter a case ID like RX-1042'),
})

export type TrackCaseValues = z.infer<typeof trackCaseSchema>
