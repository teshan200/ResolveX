import { Card } from '../components/ui'
import { slaComplaints, summarizeSla } from '../features/sla/mocks'

const sections = [
  { id: 'sla-summary', title: 'SLA summary', note: 'Summary cards and countdowns arrive in the next increment.' },
  { id: 'sla-complaints', title: 'Complaint SLA table', note: 'Filterable complaint table arrives in a later increment.' },
  { id: 'sla-breaches', title: 'Breaches and history', note: 'Breach timeline and audit history arrive in a later increment.' },
]

export function SlaMonitoringPage() {
  const summary = summarizeSla(slaComplaints)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">SLA Monitoring</h1>
        <p className="text-sm text-content-secondary">
          Track complaint response and resolution targets across branches.
          Showing {summary.total} complaints from mock data.
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="flex flex-col gap-3">
          <h2 id={section.id} className="text-lg font-semibold">
            {section.title}
          </h2>
          <Card className="text-sm text-content-secondary">{section.note}</Card>
        </section>
      ))}
    </div>
  )
}
