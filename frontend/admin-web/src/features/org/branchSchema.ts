import { z } from 'zod'

export const branchSchema = z.object({
  name: z.string().trim().min(1, 'Enter the branch name'),
  address: z.string().trim().min(1, 'Enter the branch address'),
  phone: z
    .string()
    .trim()
    .min(1, 'Enter a phone number')
    .regex(/^\+?[0-9 ]{7,16}$/, 'Enter a valid phone number'),
  email: z.string().trim().min(1, 'Enter the branch email').email('Enter a valid email'),
  active: z.boolean(),
})

export type BranchFormValues = z.infer<typeof branchSchema>
