import { Navigate, useLocation, useNavigate } from 'react-router-dom'
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
      <div className="mx-auto flex max-w-131.25 flex-col items-center gap-2 text-center">
        <h1 className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">
          Complete your setup
        </h1>
        <p className="text-base leading-6 text-content-secondary">
          Start your 14-day free trial of {plan.name}. You won’t be charged today.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-266 items-start gap-6 lg:grid-cols-[620px_420px]">
        <PaymentForm
          planId={state.planId}
          outlets={state.outlets}
          onBack={() => navigate('/choose-plan')}
          onSuccess={() => navigate('/onboarding-success', { state })}
        />
        <OrderSummary plan={plan} outlets={state.outlets} />
      </div>
    </OnboardingLayout>
  )
}
