import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Card } from '../components/ui'
import { OrderSummary } from '../features/payment/OrderSummary'
import { PaymentForm } from '../features/payment/PaymentForm'
import { OnboardingLayout } from '../layout/OnboardingLayout'
import { getPlan } from '../services/planService'
import type { PlanId } from '../types/plan'

interface PaymentState {
  planId: PlanId
  outlets: number
}

export function PaymentPage() {
  const navigate = useNavigate()
  const state = useLocation().state as PaymentState | null

  if (!state) return <Navigate to="/choose-plan" replace />

  const plan = getPlan(state.planId)

  return (
    <OnboardingLayout step={3}>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Complete your setup</h1>
        <p className="text-content-secondary">
          Start your 14-day free trial of {plan.name}. You won’t be charged today.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-warning-border bg-warning-bg p-4 text-sm text-warning-fg">
            <p className="font-semibold">Sandbox mode</p>
            <p>Test gateway — no real charges. Use card 4242 4242 4242 4242.</p>
          </div>
          <Card>
            <PaymentForm
              planId={state.planId}
              outlets={state.outlets}
              onBack={() => navigate('/choose-plan')}
              onSuccess={() => navigate('/onboarding-success', { state })}
            />
          </Card>
        </div>
        <OrderSummary plan={plan} outlets={state.outlets} />
      </div>
    </OnboardingLayout>
  )
}
