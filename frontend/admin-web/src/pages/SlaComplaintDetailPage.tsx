import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/ui'
import { SlaComplaintDetail } from '../features/sla/components/SlaComplaintDetail'
import { slaComplaints } from '../features/sla/mocks'
import { useMockNow } from '../features/sla/useMockNow'

export function SlaComplaintDetailPage() {
  const { complaintId } = useParams()
  const now = useMockNow()
  const complaint = slaComplaints.find((c) => c.id === `#${complaintId}`)

  if (!complaint) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Complaint not found</h1>
        <Card className="flex flex-col gap-2 text-sm text-content-secondary">
          <p>There is no SLA record for complaint #{complaintId}.</p>
          <Link
            to="/tenant/sla-monitoring"
            className="w-fit font-medium text-content-link hover:underline"
          >
            ← Back to SLA monitoring
          </Link>
        </Card>
      </div>
    )
  }

  return <SlaComplaintDetail complaint={complaint} nowMs={now} />
}
