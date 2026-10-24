import { ArrowRight, Check, ChevronRight, FileText, QrCode, Store } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import { OnboardingLayout } from '../layout/OnboardingLayout'
import { getOnboardingSummary } from '../services/onboardingService'

const nextSteps = [
  {
    icon: Store,
    title: 'Add your branches',
    description: 'Outlets, regional divisions and branch managers',
    to: '/tenant/branches',
  },
  {
    icon: FileText,
    title: 'Customize your feedback form',
    description: 'Questions, rating scales and branding',
    to: '/tenant/feedback-forms',
  },
  {
    icon: QrCode,
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
    <OnboardingLayout centered>
      <div className="mx-auto flex w-full max-w-140 flex-col gap-6 rounded-3xl border border-line bg-surface p-10">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-success-bg">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-solid text-on-brand">
            <Check size={28} />
          </span>
        </span>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">
            Your workspace is ready
          </h1>
          <p className="text-sm leading-5 text-content-secondary">
            {summary.companyName} is set up with restaurant-ready forms, QR templates and SLA
            rules. Here’s what to do next:
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {nextSteps.map((step) => (
            <Link
              key={step.title}
              to={step.to}
              className="flex items-center gap-4 rounded-lg border border-line p-4 hover:bg-muted"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-subtle text-brand">
                <step.icon size={20} />
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm leading-5 font-semibold">{step.title}</span>
                <span className="text-[13px] leading-4.5 text-content-secondary">
                  {step.description}
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-content-tertiary" />
            </Link>
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={() => navigate('/tenant/dashboard')}>
          Go to dashboard
          <ArrowRight size={20} />
        </Button>

        <p className="text-center text-xs leading-4 text-content-tertiary">
          Signed in as {summary.email} · Organization ID {summary.organizationId}
        </p>
      </div>
    </OnboardingLayout>
  )
}
