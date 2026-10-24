import { Badge, Card } from '../../components/ui'
import { calculatePrice, formatLkr } from '../../services/planService'
import type { Plan } from '../../types/plan'

const TRIAL_DAYS = 14

const includedFeatures = [
  'Customizable QR codes & feedback forms',
  'Email notifications & ticket alerts',
  'AI-powered complaint classification',
  'Custom SLA configuration',
  'Comprehensive analytics',
  '24/7 support',
]

function trialEndDate() {
  const date = new Date()
  date.setDate(date.getDate() + TRIAL_DAYS)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function OrderSummary({ plan, outlets }: { plan: Plan; outlets: number }) {
  const price = calculatePrice(plan, outlets)
  const hasExtraPricing = plan.extraOutletPrice !== undefined

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <Badge tone="brand">{TRIAL_DAYS}-day trial</Badge>
      </div>

      <div>
        <p className="font-semibold">{plan.name} plan</p>
        <p className="text-sm text-content-secondary">
          {outlets} outlets
          {hasExtraPricing &&
            ` · ${plan.includedOutlets} included + ${price.extraOutlets} additional`}
        </p>
        <p className="mt-1 text-2xl font-bold">{formatLkr(price.total)}</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Included in every plan</p>
        <ul className="flex flex-col gap-1.5 text-sm text-content-secondary">
          {includedFeatures.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span aria-hidden className="text-brand">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <dl className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-content-secondary">
            Base price{hasExtraPricing && ` · first ${plan.includedOutlets} outlets`}
          </dt>
          <dd>{formatLkr(price.basePrice)}</dd>
        </div>
        {hasExtraPricing && (
          <div className="flex justify-between">
            <dt className="text-content-secondary">
              Additional outlets · {price.extraOutlets} × {formatLkr(plan.extraOutletPrice!)}
            </dt>
            <dd>{formatLkr(price.extraOutletsTotal)}</dd>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <dt>Total after trial</dt>
          <dd>{formatLkr(price.total)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-content-secondary">Trial ends</dt>
          <dd>{trialEndDate()}</dd>
        </div>
      </dl>

      <div className="rounded-md bg-brand-subtle p-3">
        <div className="flex justify-between font-semibold text-content-brand">
          <span>Due today</span>
          <span>LKR 0</span>
        </div>
        <p className="text-xs text-content-secondary">First charge on {trialEndDate()}</p>
      </div>
    </Card>
  )
}
