import { Check } from 'lucide-react'
import { Fragment } from 'react'
import { cn } from '../../components/ui/cn'

type Cell = string | boolean

interface ComparisonRow {
  feature: string
  values: [Cell, Cell, Cell]
}

interface ComparisonGroup {
  heading: string
  rows: ComparisonRow[]
}

const PLANS = ['Basic', 'Pro', 'Enterprise']

const GROUPS: ComparisonGroup[] = [
  {
    heading: 'Capacity',
    rows: [
      { feature: 'Branches / outlets', values: ['Up to 3', 'Up to 15', '25 included'] },
      { feature: 'Additional outlets', values: ['—', '—', 'LKR 3,000 each'] },
      { feature: 'Price', values: ['LKR 10,000', 'LKR 30,000', 'LKR 50,000 base'] },
    ],
  },
  {
    heading: 'Core features · included in every plan',
    rows: [
      'Customizable QR codes & feedback forms',
      'Email notifications & ticket alerts',
      'AI-powered complaint classification',
      'Custom SLA configuration',
      'Comprehensive analytics',
      '24/7 support',
    ].map((feature): ComparisonRow => ({ feature, values: [true, true, true] })),
  },
]

const grid = 'grid grid-cols-[minmax(0,1fr)_180px_180px_180px]'
const headerCell =
  'flex h-10 items-center border-b border-line bg-canvas px-4 text-xs leading-4 font-semibold text-content-secondary'

export function PlanComparison() {
  return (
    <div>
      <div className={grid}>
        <div className={headerCell}>Feature</div>
        {PLANS.map((plan) => (
          <div key={plan} className={cn(headerCell, 'justify-center')}>
            {plan}
          </div>
        ))}
      </div>

      {GROUPS.map((group) => (
        <Fragment key={group.heading}>
          <p className="border-b border-line-subtle bg-canvas px-4 py-2 text-[11px] leading-4 font-semibold tracking-[0.66px] text-content-tertiary uppercase">
            {group.heading}
          </p>
          {group.rows.map((row) => (
            <div key={row.feature} className={cn(grid, 'border-b border-line-subtle')}>
              <div className="flex h-12 items-center px-4 text-sm leading-5">{row.feature}</div>
              {row.values.map((value, index) => (
                <div
                  key={PLANS[index]}
                  className="flex h-12 items-center justify-center px-4 text-[13px] leading-4.5 font-semibold"
                >
                  {value === true ? (
                    <span
                      role="img"
                      aria-label="Included"
                      className="flex size-4.5 items-center justify-center rounded-xs bg-brand text-on-brand"
                    >
                      <Check size={14} />
                    </span>
                  ) : (
                    value
                  )}
                </div>
              ))}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  )
}
