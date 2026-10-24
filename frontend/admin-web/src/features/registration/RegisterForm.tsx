import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Input } from '../../components/ui'
import { registerTenant } from '../../services/registrationService'
import { PasswordStrength } from './PasswordStrength'
import { getPasswordStrength, registerSchema } from './schema'
import type { RegisterFormValues } from './schema'

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
    defaultValues: {
      companyName: '',
      adminName: '',
      phone: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Input
          label="Company name"
          placeholder="Spice Garden Holdings"
          error={errors.companyName?.message}
          {...register('companyName')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Admin full name"
            placeholder="Marcus Vance"
            error={errors.adminName?.message}
            {...register('adminName')}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+94 77 123 4567"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
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
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrength strength={strength} />

        <div className="flex flex-col gap-1.5">
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            {...register('acceptTerms')}
          />
          {errors.acceptTerms && (
            <p className="text-xs text-danger-fg">{errors.acceptTerms.message}</p>
          )}
        </div>
      </div>

      {serverError && (
        <p className="rounded-md border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-fg">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Create account
        <ArrowRight size={20} />
      </Button>

      <p className="flex gap-1 text-[13px] leading-4.5 text-content-secondary">
        Already have an account?
        <Link to="/login" className="font-semibold text-content-link hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
