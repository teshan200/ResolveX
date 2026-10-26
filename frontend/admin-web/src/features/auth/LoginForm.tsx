import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Input } from '../../components/ui'
import { loginSchema } from './schema'
import type { LoginFormValues } from './schema'

export function LoginForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  // No authentication yet: a valid form continues to the Super Admin area.
  const onSubmit = () => navigate('/super-admin/overview')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Input
          label="Work email"
          type="email"
          placeholder="admin@spicegarden.lk"
          leadingIcon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
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
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex items-center justify-between">
          <Checkbox label="Keep me signed in" {...register('remember')} />
          <Link
            to="/forgot-password"
            className="text-[13px] leading-4.5 font-semibold text-content-link hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        Log in
        <ArrowRight size={20} />
      </Button>
    </form>
  )
}
