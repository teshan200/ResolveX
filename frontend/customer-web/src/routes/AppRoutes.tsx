import { Navigate, Route, Routes } from 'react-router-dom'
import { CustomerLayout } from '../layout/CustomerLayout'
import { PlaceholderPage } from '../pages/PlaceholderPage'

// Route table for the public feedback app. Every screen is a placeholder until it is built.
const screens: Array<{ path: string; title: string }> = [
  { path: 'feedback/:qrId', title: 'Guest Feedback' },
  { path: 'feedback/:qrId/success', title: 'Submission Success' },
  { path: 'track', title: 'Track Your Case' },
  { path: 'track/:caseId', title: 'Case Detail' },
  { path: 'survey/:caseId', title: 'Post-Resolution Survey' },
  { path: 'survey/:caseId/thanks', title: 'Survey Thank You' },
  { path: 'invalid-qr', title: 'Invalid QR' },
  { path: 'rate-limited', title: 'Rate Limited' },
  { path: 'already-submitted', title: 'Already Submitted' },
  { path: 'survey-expired', title: 'Survey Link Expired' },
]

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Navigate to="/feedback/QR-12" replace />} />
        {screens.map((screen) => (
          <Route key={screen.path} path={screen.path} element={<PlaceholderPage title={screen.title} />} />
        ))}
        <Route path="*" element={<Navigate to="/invalid-qr" replace />} />
      </Route>
    </Routes>
  )
}
