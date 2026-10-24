import { z } from 'zod'

export const registerSchema = z.object({
  companyName: z.string().trim().min(2, 'Enter your company name'),
  adminName: z.string().trim().min(2, 'Enter your full name'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{9,15}$/, 'Enter a valid phone number, e.g. +94 77 123 4567'),
  email: z.string().trim().min(1, 'Enter your work email').email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .regex(/[a-z]/, 'Add a lowercase letter')
    .regex(/[A-Z]/, 'Add an uppercase letter')
    .regex(/[0-9]/, 'Add a number'),
  acceptTerms: z.boolean().refine((value) => value, {
    message: 'You must accept the Terms of Service and Privacy Policy',
  }),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export type PasswordStrength = 'empty' | 'weak' | 'strong' | 'excellent'

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'empty'
  const valid = registerSchema.shape.password.safeParse(password).success
  if (!valid) return 'weak'
  return /[^A-Za-z0-9]/.test(password) ? 'excellent' : 'strong'
}
