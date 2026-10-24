import { CircleCheck, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Button, Stepper } from '../components/ui'
import { AuthLayout } from '../layout/AuthLayout'
import { resendVerificationEmail } from '../services/registrationService'

const RESEND_COOLDOWN_SECONDS = 45
const TOAST_SECONDS = 5

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

export function VerifyEmailPage() {
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email

  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  // The email was just sent when this page opens, so the confirmation shows right away.
  const [toastVisible, setToastVisible] = useState(true)
  const [toastRun, setToastRun] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  useEffect(() => {
    const timer = setTimeout(() => setToastVisible(false), TOAST_SECONDS * 1000)
    return () => clearTimeout(timer)
  }, [toastRun])

  if (!email) return <Navigate to="/register" replace />

  const handleResend = async () => {
    setResending(true)
    await resendVerificationEmail(email)
    setResending(false)
    setCooldown(RESEND_COOLDOWN_SECONDS)
    setToastVisible(true)
    setToastRun((run) => run + 1)
  }

  return (
    <AuthLayout>
      <Stepper steps={['Account', 'Plan', 'Payment']} current={1} />

      <div className="flex flex-col gap-3">
        <span className="flex size-12 items-center justify-center rounded-lg bg-brand-subtle text-brand">
          <Mail size={24} />
        </span>
        <h1 className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">Check your inbox</h1>
        <p className="text-sm leading-5 text-content-secondary">
          We sent a verification link to your work email. Click it to activate your ResolveX
          workspace.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-md border border-line bg-canvas px-4 py-3">
        <Mail size={18} className="shrink-0 text-content-tertiary" />
        <span className="min-w-0 flex-1 truncate text-sm leading-5 font-semibold">{email}</span>
        <Link
          to="/register"
          className="text-[13px] leading-4.5 font-semibold text-content-link hover:underline"
        >
          Change
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <a href="mailto:" className="block">
          <Button size="lg" className="w-full">
            <Mail size={20} />
            Open email app
          </Button>
        </a>
        <Button
          size="lg"
          className="w-full"
          variant={cooldown > 0 ? 'primary' : 'outline'}
          disabled={cooldown > 0}
          loading={resending}
          onClick={handleResend}
        >
          {cooldown > 0 ? `Resend email in ${formatCountdown(cooldown)}` : 'Resend email'}
        </Button>
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-info-bg p-4">
        <p className="text-[13px] leading-4.5 font-semibold text-info-fg">Didn’t get it?</p>
        <p className="text-[13px] leading-4.5 text-content-secondary">
          The link expires in 24 hours. Check your spam folder, or ask your IT team to allow
          emails from no-reply@resolvex.io.
        </p>
      </div>

      {toastVisible && (
        <div
          role="status"
          className="flex w-90 max-w-full items-center gap-3 rounded-lg bg-inverse px-4 py-3 text-on-brand shadow-[0_12px_24px_-4px_rgba(11,19,18,0.1),0_4px_8px_-4px_rgba(11,19,18,0.05)]"
        >
          <CircleCheck size={18} className="shrink-0 text-success-solid" />
          <span className="text-sm leading-5 font-medium">Verification email sent</span>
        </div>
      )}
    </AuthLayout>
  )
}
