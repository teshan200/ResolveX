import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your work email').email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
  remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Enter your work email').email('Enter a valid email'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { id: 'number', label: 'Contains a number', test: (value: string) => /[0-9]/.test(value) },
  {
    id: 'uppercase',
    label: 'Contains an uppercase letter',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'symbol',
    label: 'Contains a symbol',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
]

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .refine((value) => passwordRules.every((rule) => rule.test(value)), 'Password is too weak'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords don’t match',
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
