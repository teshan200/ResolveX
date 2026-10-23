import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
import { registerTenant } from '../../services/registrationService'
import { getPasswordStrength, registerSchema } from './schema'
import type { RegisterFormValues } from './schema'

const passwordHints = {
  empty: 'Use 8+ characters with upper and lower case letters and a number',
  weak: 'Use 8+ characters with upper and lower case letters and a number',
  strong: 'Strong password · add a symbol to make it excellent',
  excellent: 'Excellent password',
}

export function RegisterForm() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { companyName: '', email: '', password: '', acceptTerms: false },
  })

  const strength = getPasswordStrength(useWatch({ control, name: 'password' }))

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      const result = await registerTenant(values)
      navigate('/verify-email', { state: { email: result.email } })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input
        label="Company name"
        placeholder="Spice Garden Holdings"
        error={errors.companyName?.message}
        {...register('companyName')}
      />
      <Input
        label="Work email"
        type="email"
        placeholder="marcus@spicegarden.lk"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••••••"
        helper={passwordHints[strength]}
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-2 text-sm text-content-secondary">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-brand"
            {...register('acceptTerms')}
          />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>
        {errors.acceptTerms && (
          <p className="text-xs text-danger-fg">{errors.acceptTerms.message}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-md border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-fg">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" loading={isSubmitting}>
        Create account
      </Button>

      <p className="text-center text-sm text-content-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-content-link hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
