import { z } from 'zod'
import { durationError, parseDuration, warnAtError } from './duration'

export const policyPriorities = ['Critical', 'High', 'Medium', 'Normal'] as const

const policyRowSchema = z
  .object({
    priority: z.enum(policyPriorities),
    acknowledge: z.string(),
    resolve: z.string(),
    warnAt: z.string(),
  })
  .superRefine((row, ctx) => {
    const ackError = durationError(row.acknowledge)
    const resolveError = durationError(row.resolve)
    const warnError = warnAtError(row.warnAt)

    if (ackError) ctx.addIssue({ code: 'custom', path: ['acknowledge'], message: ackError })
    if (resolveError) ctx.addIssue({ code: 'custom', path: ['resolve'], message: resolveError })
    if (warnError) ctx.addIssue({ code: 'custom', path: ['warnAt'], message: warnError })

    if (!ackError && !resolveError) {
      const ack = parseDuration(row.acknowledge) ?? 0
      const resolve = parseDuration(row.resolve) ?? 0
      if (resolve <= ack) {
        ctx.addIssue({
          code: 'custom',
          path: ['resolve'],
          message: 'Resolve time must be longer than acknowledge time',
        })
      }
    }
  })

export const slaPoliciesSchema = z.object({
  policies: z.array(policyRowSchema).length(policyPriorities.length),
})

export type SlaPoliciesFormValues = z.infer<typeof slaPoliciesSchema>

/** Starting targets, taken from the Figma "SLA Policies" frame. */
export const defaultSlaPolicies: SlaPoliciesFormValues = {
  policies: [
    { priority: 'Critical', acknowledge: '5 min', resolve: '30 min', warnAt: '60 %' },
    { priority: 'High', acknowledge: '15 min', resolve: '45 min', warnAt: '80 %' },
    { priority: 'Medium', acknowledge: '30 min', resolve: '2 h', warnAt: '80 %' },
    { priority: 'Normal', acknowledge: '1 h', resolve: '8 h', warnAt: '90 %' },
  ],
}
