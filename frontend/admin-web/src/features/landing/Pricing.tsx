import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlans } from '../../services/planService'
import type { Plan } from '../../types/plan'
import { PlanCard } from '../plans/PlanCard'
import { SectionHeading } from './SectionHeading'

export function Pricing() {
  const navigate = useNavigate()
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
          <PlanCard key={plan.id} plan={plan} onSelect={() => navigate('/register')} />
        ))}
      </div>
    </section>
  )
}
