import { Layers, Pencil, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, IconButton, PageHeader, Panel } from '../components/ui'
import { cn } from '../components/ui/cn'
import { PlanComparison } from '../features/platform/PlanComparison'
import { getAdminPlans, publishPlanChanges } from '../services/platformService'
import type { AdminPlan } from '../types/platform'

export function PlansPricingPage() {
  const [plans, setPlans] = useState<AdminPlan[]>([])
  const [selected, setSelected] = useState('pro')
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    getAdminPlans().then(setPlans)
  }, [])

  const publish = async () => {
    setPublishing(true)
    await publishPlanChanges()
    setPublishing(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Plans & pricing"
        description="Every plan includes the same core features. Plans differ only by branch/outlet capacity (SaaS-14…16)."
        actions={
          <Button className="font-semibold!" loading={publishing} onClick={publish}>
            <Send size={18} />
            Publish changes
          </Button>
        }
      />

      <div className="grid items-start grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'flex flex-col gap-2 rounded-xl border bg-surface p-5',
              selected === plan.id ? 'border-[1.5px] border-line-brand' : 'border-line',
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6.5 font-semibold">{plan.name}</h2>
              <IconButton
                icon={Pencil}
                label={`Edit ${plan.name} plan`}
                size="sm"
                onClick={() => setSelected(plan.id)}
              />
            </div>
            <p className="text-2xl leading-8 font-semibold text-content-brand">{plan.headline}</p>
            <p className="text-xs leading-4 font-medium text-content-tertiary">{plan.caption}</p>
          </div>
        ))}
      </div>

      <Panel
        title="Plan comparison"
        description="Same features on every plan — only outlet capacity changes."
        icon={Layers}
        flush
      >
        <PlanComparison />
      </Panel>
    </div>
  )
}
