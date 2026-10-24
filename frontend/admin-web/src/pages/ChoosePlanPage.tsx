import { Info, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlanCard } from '../features/plans/PlanCard'
import { OnboardingLayout } from '../layout/OnboardingLayout'
import {
  calculatePrice,
  formatLkr,
  getPlans,
  recommendPlan,
} from '../services/planService'
import type { Plan } from '../types/plan'

const MIN_OUTLETS = 1
const MAX_OUTLETS = 500

export function ChoosePlanPage() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<Plan[]>([])
  const [outlets, setOutlets] = useState(3)

  useEffect(() => {
    getPlans().then(setPlans)
  }, [])

  const recommended = recommendPlan(outlets)
  const price = calculatePrice(recommended, outlets)

  const changeOutlets = (value: number) => {
    if (Number.isNaN(value)) return
    setOutlets(Math.min(MAX_OUTLETS, Math.max(MIN_OUTLETS, Math.round(value))))
  }

  // A plan with an outlet limit cannot hold more outlets than it includes.
  const selectPlan = (plan: Plan) =>
    navigate('/payment', {
      state: {
        planId: plan.id,
        outlets: plan.maxOutlets ? Math.min(outlets, plan.maxOutlets) : outlets,
      },
    })

  return (
    <OnboardingLayout step={2}>
      <div className="mx-auto flex max-w-157.5 flex-col items-center gap-4 text-center">
        <h1 className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">Choose your plan</h1>
        <p className="text-base leading-6 text-content-secondary">
          Pick the plan that fits your restaurant group. You can change it anytime from Billing.
        </p>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-6">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={() => selectPlan(plan)} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-line bg-surface px-6 py-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-subtle text-brand">
          <Store size={22} />
        </span>
        <div className="flex min-w-60 flex-1 flex-col gap-1">
          <h2 className="text-base leading-6 font-semibold">How many outlets do you run?</h2>
          <p className="text-[13px] leading-4.5 text-content-secondary">
            Basic covers up to 3, Pro up to 15. Enterprise includes 25 outlets, then LKR 3,000
            for each additional outlet.
          </p>
        </div>
        <div className="flex w-30 flex-col gap-1.5">
          <label htmlFor="outlets" className="text-[13px] leading-4.5 font-medium">
            Outlets
          </label>
          <input
            id="outlets"
            type="number"
            min={MIN_OUTLETS}
            max={MAX_OUTLETS}
            value={outlets}
            onChange={(event) => changeOutlets(event.target.valueAsNumber)}
            className="h-10 w-full rounded-md border border-line bg-surface px-3 text-sm leading-5 focus:border-line-focus focus:shadow-[inset_0_0_0_0.5px_var(--color-line-focus),0_0_0_3px_rgba(42,140,126,0.35)] focus:outline-none"
          />
        </div>
        <div className="flex h-23 w-46.5 flex-col gap-1 rounded-xl bg-brand-subtle px-4 py-3 text-content-brand">
          <p className="text-xs leading-4 font-semibold">Recommended: {recommended.name}</p>
          <p className="text-xl leading-7 font-semibold">{formatLkr(price.total)}</p>
          <p className="text-xs leading-4 font-medium text-content-secondary">
            {price.extraOutlets > 0
              ? `${price.basePrice.toLocaleString('en-US')} + ${price.extraOutlets} × ${(
                  recommended.extraOutletPrice ?? 0
                ).toLocaleString('en-US')}`
              : `${recommended.includedOutlets} outlets included`}
          </p>
        </div>
      </div>

      <div className="flex gap-3 rounded-lg border border-info-border bg-info-bg px-4 py-3">
        <Info size={20} className="mt-0.5 shrink-0 text-info-fg" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm leading-5 font-semibold text-info-fg">
            Every plan starts with a 14-day free trial
          </p>
          <p className="text-[13px] leading-4.5 text-content-secondary">
            No charge today. We’ll remind you 3 days before your trial ends. Upgrade,
            downgrade or cancel anytime.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  )
}
