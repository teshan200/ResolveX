import { CircleCheck } from 'lucide-react'
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

function Line({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[13px] leading-4.5">
      <span className={strong ? 'font-semibold' : 'text-content-secondary'}>{label}</span>
      <span className={strong ? 'font-semibold' : 'font-medium'}>{value}</span>
    </div>
  )
}

export function OrderSummary({ plan, outlets }: { plan: Plan; outlets: number }) {
  const price = calculatePrice(plan, outlets)
  const hasExtraPricing = plan.extraOutletPrice !== undefined
  const endDate = trialEndDate()

  return (
    <aside className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg leading-6.5 font-semibold">Order summary</h2>
        <span className="inline-flex h-5.5 items-center rounded-xs bg-brand-subtle px-2 text-xs leading-4 font-medium text-content-brand">
          {TRIAL_DAYS}-day trial
        </span>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-brand-subtle p-4">
        <div className="flex flex-col gap-1">
          <p className="text-base leading-6 font-medium">{plan.name} plan</p>
          <p className="text-[13px] leading-4.5 text-content-secondary">
            {outlets} outlets
            {hasExtraPricing &&
              ` · ${plan.includedOutlets} included + ${price.extraOutlets} additional`}
          </p>
        </div>
        <p className="text-sm leading-5 font-semibold">{formatLkr(price.total)}</p>
      </div>

      <p className="text-[11px] leading-4 font-semibold tracking-[0.66px] text-content-tertiary uppercase">
        Included in every plan
      </p>

      <ul className="flex flex-col gap-2">
        {includedFeatures.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-[13px] leading-4.5 text-content-secondary">
            <CircleCheck size={16} className="shrink-0 text-success-fg" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="h-px bg-line" />

      <Line
        label={`Base price${hasExtraPricing ? ` · first ${plan.includedOutlets} outlets` : ''}`}
        value={formatLkr(price.basePrice)}
      />
      {hasExtraPricing && (
        <Line
          label={`Additional outlets · ${price.extraOutlets} × ${formatLkr(plan.extraOutletPrice!)}`}
          value={formatLkr(price.extraOutletsTotal)}
        />
      )}
      <Line label="Total after trial" value={formatLkr(price.total)} strong />
      <Line label="Trial ends" value={endDate} />

      <div className="flex items-center justify-between rounded-lg bg-canvas p-4">
        <div className="flex flex-col">
          <p className="text-sm leading-5 font-semibold">Due today</p>
          <p className="text-xs leading-4 text-content-tertiary">First charge on {endDate}</p>
        </div>
        <p className="text-2xl leading-8 font-semibold text-content-brand">LKR 0</p>
      </div>
    </aside>
  )
}
