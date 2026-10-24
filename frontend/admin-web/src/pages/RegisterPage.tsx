import { useNavigate } from 'react-router-dom'
import { GoogleButton, Stepper } from '../components/ui'
import { RegisterForm } from '../features/registration/RegisterForm'
import { AuthLayout } from '../layout/AuthLayout'

export function RegisterPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <Stepper steps={['Account', 'Plan', 'Payment']} current={1} />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">
          Create your company account
        </h1>
        <p className="text-sm leading-5 text-content-secondary">
          Start your 14-day free trial. No credit card required.
        </p>
      </div>

      <GoogleButton label="Sign up with Google" onClick={() => navigate('/signup/google')} />

      <div className="flex items-center gap-3 text-xs leading-4 font-medium text-content-tertiary">
        <span className="h-px flex-1 bg-line" />
        or sign up with email
        <span className="h-px flex-1 bg-line" />
      </div>

      <RegisterForm />
    </AuthLayout>
  )
}
