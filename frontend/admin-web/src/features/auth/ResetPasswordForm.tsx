import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
import { resetPassword } from '../../services/authService'
import { PasswordRequirements } from './PasswordRequirements'
import { resetPasswordSchema } from './schema'
import type { ResetPasswordFormValues } from './schema'

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  })

  const password = useWatch({ control, name: 'password' })
  const confirmPassword = useWatch({ control, name: 'confirmPassword' })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    await resetPassword(values.password)
    navigate('/login')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Input
        label="New password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••••••"
        leadingIcon={<Lock size={18} />}
        trailing={
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="cursor-pointer"
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        {...register('password')}
      />

      <PasswordRequirements password={password} />

      <Input
        label="Confirm password"
        type="password"
        placeholder="••••••••••••"
        leadingIcon={<Lock size={18} />}
        error={confirmPassword ? errors.confirmPassword?.message : undefined}
        {...register('confirmPassword')}
      />

      <Button type="submit" size="lg" className="w-full" disabled={!isValid} loading={isSubmitting}>
        Update password
      </Button>
    </form>
  )
}
