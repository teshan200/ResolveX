import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Button } from '../components/ui'
import { resendVerificationEmail } from '../services/registrationService'
import { AuthLayout } from '../layout/AuthLayout'

const RESEND_COOLDOWN_SECONDS = 30

export function VerifyEmailPage() {
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email

  const [resending, setResending] = useState(false)
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  if (!email) return <Navigate to="/register" replace />

  const handleResend = async () => {
    setResending(true)
    await resendVerificationEmail(email)
    setResending(false)
    setSent(true)
    setCooldown(RESEND_COOLDOWN_SECONDS)
  }

  return (
    <AuthLayout>
      <span
        aria-hidden
        className="flex size-14 items-center justify-center rounded-full bg-brand-subtle text-2xl text-brand"
      >
        ✉
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Check your inbox</h1>
        <p className="text-content-secondary">
          We sent a verification link to your work email. Click it to activate your
          ResolveX workspace.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-line px-4 py-3">
        <span className="text-sm font-medium">{email}</span>
        <Link to="/register" className="text-sm font-medium text-content-link hover:underline">
          Change
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Didn’t get it?</p>
        <p className="text-sm text-content-secondary">
          The link expires in 24 hours. Check your spam folder, or ask your IT team to
          allow emails from no-reply@resolvex.io.
        </p>
        <Button
          variant="outline"
          loading={resending}
          disabled={cooldown > 0}
          onClick={handleResend}
        >
          {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend email'}
        </Button>
        {sent && (
          <p className="rounded-md border border-success-border bg-success-bg px-3 py-2 text-sm text-success-fg">
            Verification email sent again.
          </p>
        )}
      </div>
    </AuthLayout>
  )
}
