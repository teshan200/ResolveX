import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CustomerLayout } from '../layout/CustomerLayout'
import { CaseDetailPage } from '../pages/CaseDetailPage'
import { GuestFeedbackPage } from '../pages/GuestFeedbackPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { SubmissionSuccessPage } from '../pages/SubmissionSuccessPage'
import { TrackCasePage } from '../pages/TrackCasePage'

// Route table for the public feedback app. Screens that are not built yet fall back to a placeholder.
const screens: Array<{ path: string; title: string; element?: ReactElement }> = [
  { path: 'feedback/:qrId', title: 'Guest Feedback', element: <GuestFeedbackPage /> },
  {
    path: 'feedback/:qrId/success',
    title: 'Submission Success',
    element: <SubmissionSuccessPage />,
  },
  { path: 'track', title: 'Track Your Case', element: <TrackCasePage /> },
  { path: 'track/:caseId', title: 'Case Detail', element: <CaseDetailPage /> },
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
          <Route
            key={screen.path}
            path={screen.path}
            element={screen.element ?? <PlaceholderPage title={screen.title} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/invalid-qr" replace />} />
      </Route>
    </Routes>
  )
}
