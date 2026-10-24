import { Key, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, GoogleButton } from '../components/ui'
import { LoginForm } from '../features/auth/LoginForm'
import { AuthLayout } from '../layout/AuthLayout'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">Welcome back</h1>
        <p className="text-sm leading-5 text-content-secondary">
          Log in to your restaurant operations workspace.
        </p>
      </div>

      <LoginForm />

      <div className="flex items-center gap-3 text-xs leading-4 font-medium text-content-tertiary">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton onClick={() => navigate('/signin/google')} />

      <Button variant="outline" size="lg" className="w-full">
        <Key size={20} />
        Continue with SSO
      </Button>

      <p className="flex justify-center gap-1 text-[13px] leading-4.5 text-content-secondary">
        New to ResolveX?
        <Link to="/register" className="font-semibold text-content-link hover:underline">
          Create a company account
        </Link>
      </p>

      <p className="flex items-center gap-2 text-xs leading-4 text-content-tertiary">
        <ShieldCheck size={16} />
        Protected by rate limiting and encrypted sessions
      </p>
    </AuthLayout>
  )
}
