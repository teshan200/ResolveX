import { useParams } from 'react-router-dom'
import { FeedbackForm } from '../features/feedback/FeedbackForm'

export function GuestFeedbackPage() {
  const { qrId = '' } = useParams()

  // Keyed by QR code so a different QR starts with a fresh form.
  return <FeedbackForm key={qrId} qrId={qrId} />
}
