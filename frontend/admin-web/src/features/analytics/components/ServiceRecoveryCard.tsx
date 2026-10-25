import { Gift } from 'lucide-react'
import { cn } from '../../../components/ui/cn'
import { recoveryMetrics } from '../mocks'

const fill = {
  success: 'bg-success-solid',
  brand: 'bg-brand',
  warning: 'bg-warning-solid',
}

/** "Service recovery" card: four metrics, each with a progress bar sized to its value. */
export function ServiceRecoveryCard({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="service-recovery"
      className={cn('overflow-hidden rounded-xl border border-line bg-surface', className)}
    >
      <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
        <Gift size={18} className="shrink-0 text-content-brand" aria-hidden />
        <div className="min-w-0 flex-1 whitespace-nowrap">
          <h2 id="service-recovery" className="text-base leading-6 font-semibold">
            Service recovery
          </h2>
          <p className="text-xs leading-4 text-content-tertiary">Last 30 days</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-5 py-4">
        {recoveryMetrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between text-[13px] leading-4.5 whitespace-nowrap">
              <p className="text-content-secondary">{m.label}</p>
              <p className="font-semibold">{m.display}</p>
            </div>
            <div
              role="progressbar"
              aria-label={m.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={m.percent}
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn('h-full rounded-full', fill[m.tone])}
                style={{ width: `${m.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
