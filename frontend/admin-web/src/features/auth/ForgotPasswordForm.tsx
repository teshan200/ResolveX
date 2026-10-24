import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
import { requestPasswordReset } from '../../services/authService'
import { forgotPasswordSchema } from './schema'
import type { ForgotPasswordFormValues } from './schema'

export function ForgotPasswordForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  // The real flow sends an email. In this prototype we continue to the reset page,
  // as if the link in the email had been opened.
  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await requestPasswordReset(values.email)
    navigate('/reset-password')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Input
        label="Work email"
        type="email"
        placeholder="admin@spicegarden.lk"
        leadingIcon={<Mail size={18} />}
        error={errors.email?.message}
        {...register('email')}
      />
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Send reset link
        <Send size={20} />
      </Button>
    </form>
  )
}
