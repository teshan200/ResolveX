import { Badge, Button, Card } from '../../components/ui'
import { cn } from '../../components/ui/cn'
import { formatLkr } from '../../services/planService'
import type { Plan } from '../../types/plan'

interface PlanCardProps {
  plan: Plan
  recommended: boolean
  disabled: boolean
  onSelect: () => void
}

export function PlanCard({ plan, recommended, disabled, onSelect }: PlanCardProps) {
  const outletsNote = plan.maxOutlets
    ? `up to ${plan.maxOutlets} outlets`
    : `includes ${plan.includedOutlets} outlets`

  return (
    <Card
      className={cn(
        'flex flex-col gap-5',
        recommended && 'border-line-brand ring-2 ring-line-brand/20',
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{plan.name}</h2>
        {plan.popular && <Badge tone="brand">Most popular</Badge>}
      </div>

      <div>
        <p className="text-3xl font-bold">{formatLkr(plan.basePrice)}</p>
        <p className="text-sm text-content-secondary">{outletsNote}</p>
      </div>

      <ul className="flex flex-1 flex-col gap-2 text-sm text-content-secondary">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span aria-hidden className="text-brand">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {plan.extraOutletPrice && (
        <div className="rounded-md bg-brand-subtle p-3 text-xs text-content-secondary">
          <p className="mb-1 font-medium text-content-brand">How Enterprise pricing works</p>
          <p>25 outlets = LKR 50,000</p>
          <p>26 outlets = LKR 53,000</p>
          <p>30 outlets = LKR 65,000</p>
          <p className="text-content-tertiary">(LKR 50,000 + 5 × LKR 3,000)</p>
        </div>
      )}

      <Button
        variant={recommended ? 'primary' : 'outline'}
        disabled={disabled}
        onClick={onSelect}
      >
        {disabled ? 'Too many outlets for this plan' : 'Start 14-day trial'}
      </Button>
    </Card>
  )
}
