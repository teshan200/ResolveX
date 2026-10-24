import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { OnboardingLayout } from '../layout/OnboardingLayout'
import { getOnboardingSummary } from '../services/onboardingService'

const nextSteps = [
  {
    title: 'Add your branches',
    description: 'Outlets, regional divisions and branch managers',
    to: '/tenant/branches',
  },
  {
    title: 'Customize your feedback form',
    description: 'Questions, rating scales and branding',
    to: '/tenant/feedback-forms',
  },
  {
    title: 'Generate your QR codes',
    description: 'One shared code for all tables, plus counters and service areas',
    to: '/tenant/qr-codes',
  },
]

export function OnboardingSuccessPage() {
  const navigate = useNavigate()
  const state = useLocation().state

  if (!state) return <Navigate to="/choose-plan" replace />

  const summary = getOnboardingSummary()

  return (
    <OnboardingLayout>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            aria-hidden
            className="flex size-14 items-center justify-center rounded-full bg-success-bg text-2xl text-success-solid"
          >
            ✓
          </span>
          <h1 className="text-3xl font-bold">Your workspace is ready</h1>
          <p className="text-content-secondary">
            {summary.companyName} is set up with restaurant-ready forms, QR templates and
            SLA rules. Here’s what to do next:
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {nextSteps.map((step, index) => (
            <Link key={step.title} to={step.to}>
              <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-muted">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-sm font-semibold text-brand">
                  {index + 1}
                </span>
                <span className="flex flex-col">
                  <span className="font-semibold">{step.title}</span>
                  <span className="text-sm text-content-secondary">{step.description}</span>
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <Button size="lg" onClick={() => navigate('/tenant/dashboard')}>
          Go to dashboard
        </Button>

        <p className="text-center text-xs text-content-tertiary">
          Signed in as {summary.email} · Organization ID {summary.organizationId}
        </p>
      </div>
    </OnboardingLayout>
  )
}
