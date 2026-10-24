import { CircleCheck, Store } from 'lucide-react'
import { Button } from '../../components/ui'
import { cn } from '../../components/ui/cn'
import { formatLkr } from '../../services/planService'
import type { Plan } from '../../types/plan'

interface PlanCardProps {
  plan: Plan
  onSelect: () => void
}

// Used by the landing page pricing section and the Choose Plan page (same Figma component).
export function PlanCard({ plan, onSelect }: PlanCardProps) {
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
          <div
            key={feature}
            className="flex items-center gap-2 text-sm leading-5 text-content-secondary"
          >
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

      <Button
        size="lg"
        variant={plan.popular ? 'primary' : 'outline'}
        className="w-full"
        onClick={onSelect}
      >
        Start 14-day trial
      </Button>
    </div>
  )
}
