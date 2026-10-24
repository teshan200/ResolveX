import { ArrowLeft, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ResetPasswordForm } from '../features/auth/ResetPasswordForm'
import { AuthLayout } from '../layout/AuthLayout'

export function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-3">
        <span className="flex size-12 items-center justify-center rounded-lg bg-brand-subtle text-brand">
          <Lock size={24} />
        </span>
        <h1 className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">
          Set a new password
        </h1>
        <p className="text-sm leading-5 text-content-secondary">
          Choose a strong password you haven’t used before on ResolveX.
        </p>
      </div>

      <ResetPasswordForm />

      <Link
        to="/login"
        className="flex w-fit items-center gap-1.5 text-[13px] leading-4.5 font-semibold text-content-link hover:underline"
      >
        <ArrowLeft size={16} />
        Back to log in
      </Link>
    </AuthLayout>
  )
}
