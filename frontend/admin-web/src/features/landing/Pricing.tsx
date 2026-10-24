import { CircleCheck, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui'
import { cn } from '../../components/ui/cn'
import { formatLkr, getPlans } from '../../services/planService'
import type { Plan } from '../../types/plan'
import { SectionHeading } from './SectionHeading'

function PlanCard({ plan }: { plan: Plan }) {
  const [capacity, ...features] = plan.features
  const outletsNote = plan.maxOutlets
    ? `up to ${plan.maxOutlets} outlets`
    : `includes ${plan.includedOutlets} outlets`

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-5 rounded-2xl bg-surface p-6 md:w-90',
        plan.popular
          ? 'border-2 border-line-brand shadow-[0_4px_4px_rgba(11,19,18,0.05),0_12px_12px_rgba(11,19,18,0.1)]'
          : 'border border-line',
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg leading-6.5 font-semibold">{plan.name}</p>
        {plan.popular && (
          <span className="rounded-full bg-brand px-2 py-0.5 text-xs leading-4 font-semibold text-on-brand">
            Most popular
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
        <p className="text-4xl leading-11 font-bold tracking-[-0.54px]">
          {formatLkr(plan.basePrice)}
        </p>
        <p className="text-[13px] leading-4.5 text-content-tertiary">{outletsNote}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-md bg-brand-subtle px-3 py-2 text-[13px] leading-4.5 font-semibold text-content-brand">
          <Store size={16} className="shrink-0" />
          {capacity}
        </div>
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm leading-5 text-content-secondary">
            <CircleCheck size={18} className="shrink-0 text-success-fg" />
            {feature}
          </div>
        ))}
      </div>

      {plan.extraOutletPrice && (
        <div className="flex flex-col gap-1 rounded-md bg-canvas p-3 text-xs leading-4">
          <p className="font-semibold">How Enterprise pricing works</p>
          <p className="font-mono font-medium text-content-secondary">25 outlets = LKR 50,000</p>
          <p className="font-mono font-medium text-content-secondary">26 outlets = LKR 53,000</p>
          <p className="font-mono font-medium text-content-secondary">30 outlets = LKR 65,000</p>
          <p className="font-mono font-medium text-content-secondary">
            (LKR 50,000 + 5 × LKR 3,000)
          </p>
        </div>
      )}

      <Link to="/register">
        <Button size="lg" variant={plan.popular ? 'primary' : 'outline'} className="w-full">
          Start 14-day trial
        </Button>
      </Link>
    </div>
  )
}

export function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    getPlans().then(setPlans)
  }, [])

  return (
    <section id="pricing" className="flex flex-col items-center gap-12 bg-canvas px-6 py-20 lg:px-20">
      <SectionHeading
        eyebrow="Pricing"
        title="Same features on every plan"
        description="Choose by the number of branches/outlets you run. Every plan includes a 14-day free trial."
      />
      <div className="flex flex-wrap items-start justify-center gap-6">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  )
}
