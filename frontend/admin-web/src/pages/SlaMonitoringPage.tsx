import { Card } from '../components/ui'
import { SlaSummaryCards } from '../features/sla/components/SlaSummaryCards'
import { SlaWatchlist } from '../features/sla/components/SlaWatchlist'
import { slaComplaints } from '../features/sla/mocks'
import { summarizeSla } from '../features/sla/sla'
import { useMockNow } from '../features/sla/useMockNow'

export function SlaMonitoringPage() {
  const now = useMockNow()
  const summary = summarizeSla(slaComplaints, now)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">SLA Monitoring</h1>
        <p className="text-sm text-content-secondary">
          Track complaint resolution targets across branches. Simulated data and clock: no
          backend is connected.
        </p>
      </header>

      {summary.breached > 0 && (
        <div
          role="status"
          className="rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-sm font-medium text-danger-fg"
        >
          {summary.breached} {summary.breached === 1 ? 'complaint has' : 'complaints have'} breached
          the SLA and need attention.
        </div>
      )}

      <section aria-labelledby="sla-summary" className="flex flex-col gap-3">
        <h2 id="sla-summary" className="text-lg font-semibold">
          SLA summary
        </h2>
        <SlaSummaryCards summary={summary} />
      </section>

      <section aria-labelledby="sla-watchlist" className="flex flex-col gap-3">
        <h2 id="sla-watchlist" className="text-lg font-semibold">
          Closest to breach
        </h2>
        <SlaWatchlist complaints={slaComplaints} nowMs={now} />
      </section>

      <section aria-labelledby="sla-complaints" className="flex flex-col gap-3">
        <h2 id="sla-complaints" className="text-lg font-semibold">
          Complaint SLA table
        </h2>
        <Card className="text-sm text-content-secondary">
          Filterable complaint table arrives in a later increment.
        </Card>
      </section>

      <section aria-labelledby="sla-breaches" className="flex flex-col gap-3">
        <h2 id="sla-breaches" className="text-lg font-semibold">
          Breaches and history
        </h2>
        <Card className="text-sm text-content-secondary">
          Breach timeline and audit history arrive in a later increment.
        </Card>
      </section>
    </div>
  )
}
