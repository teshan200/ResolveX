import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { areas } from '../layout/navigation'
import { ChoosePlanPage } from '../pages/ChoosePlanPage'
import { GoogleSignupPage } from '../pages/GoogleSignupPage'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingSuccessPage } from '../pages/OnboardingSuccessPage'
import { PaymentPage } from '../pages/PaymentPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { RegisterPage } from '../pages/RegisterPage'
import { SlaComplaintDetailPage } from '../pages/SlaComplaintDetailPage'
import { SlaMonitoringPage } from '../pages/SlaMonitoringPage'
import { SlaPoliciesPage } from '../pages/SlaPoliciesPage'
import { VerifyEmailPage } from '../pages/VerifyEmailPage'

// Screens that have been built, keyed by full path. Anything else falls back to a placeholder.
const builtPages: Record<string, ReactElement> = {
  '/tenant/sla-monitoring': <SlaMonitoringPage />,
  '/tenant/sla-policies': <SlaPoliciesPage />,
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/signup/google" element={<GoogleSignupPage />} />
      <Route path="/choose-plan" element={<ChoosePlanPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/onboarding-success" element={<OnboardingSuccessPage />} />
      {areas.map((area) => (
        <Route key={area.basePath} path={area.basePath} element={<AppLayout area={area} />}>
          <Route index element={<Navigate to={area.items[0].path} replace />} />
          {area.items.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                builtPages[`${area.basePath}/${item.path}`] ?? (
                  <PlaceholderPage title={item.label} />
                )
              }
            />
          ))}
          {area.basePath === '/tenant' && (
            <Route path="sla-monitoring/:complaintId" element={<SlaComplaintDetailPage />} />
          )}
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
