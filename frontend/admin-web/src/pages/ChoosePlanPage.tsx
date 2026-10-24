import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { PlanCard } from '../features/plans/PlanCard'
import { OnboardingLayout } from '../layout/OnboardingLayout'
import {
  calculatePrice,
  formatLkr,
  getPlans,
  recommendPlan,
} from '../services/planService'
import type { Plan, PlanId } from '../types/plan'

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

  const selectPlan = (planId: PlanId) => navigate('/payment', { state: { planId, outlets } })

  return (
    <OnboardingLayout step={2}>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Choose your plan</h1>
        <p className="text-content-secondary">
          Pick the plan that fits your restaurant group. You can change it anytime from
          Billing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            recommended={plan.id === recommended.id}
            disabled={plan.maxOutlets !== undefined && outlets > plan.maxOutlets}
            onSelect={() => selectPlan(plan.id)}
          />
        ))}
      </div>

      <Card className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">How many outlets do you run?</h2>
          <p className="text-sm text-content-secondary">
            Basic covers up to 3, Pro up to 15. Enterprise includes 25 outlets, then
            LKR 3,000 for each additional outlet.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              aria-label="Fewer outlets"
              onClick={() => changeOutlets(outlets - 1)}
            >
              −
            </Button>
            <input
              type="number"
              aria-label="Outlets"
              min={MIN_OUTLETS}
              max={MAX_OUTLETS}
              value={outlets}
              onChange={(event) => changeOutlets(event.target.valueAsNumber)}
              className="h-10 w-20 rounded-md border border-line text-center text-sm"
            />
            <Button
              variant="outline"
              aria-label="More outlets"
              onClick={() => changeOutlets(outlets + 1)}
            >
              +
            </Button>
          </div>

          <div className="text-right">
            <p className="text-sm text-content-secondary">
              Recommended: <span className="font-semibold">{recommended.name}</span>
            </p>
            <p className="text-2xl font-bold">{formatLkr(price.total)}</p>
            {price.extraOutlets > 0 && (
              <p className="text-xs text-content-tertiary">
                {formatLkr(price.basePrice)} + {price.extraOutlets} ×{' '}
                {formatLkr(recommended.extraOutletPrice ?? 0)}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="rounded-lg bg-brand-subtle p-4 text-sm">
        <p className="font-semibold text-content-brand">
          Every plan starts with a 14-day free trial
        </p>
        <p className="text-content-secondary">
          No charge today. We’ll remind you 3 days before your trial ends. Upgrade,
          downgrade or cancel anytime.
        </p>
      </div>
    </OnboardingLayout>
  )
}
