import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your work email').email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
  remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
