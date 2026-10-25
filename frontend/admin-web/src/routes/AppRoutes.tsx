import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { areas, navItems } from '../layout/navigation'
import { ChoosePlanPage } from '../pages/ChoosePlanPage'
import { EscalatedToMePage } from '../pages/EscalatedToMePage'
import { EscalationDetailPage } from '../pages/EscalationDetailPage'
import { EscalationInboxPage } from '../pages/EscalationInboxPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { GoogleSigninPage } from '../pages/GoogleSigninPage'
import { GoogleSignupPage } from '../pages/GoogleSignupPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { OnboardingSuccessPage } from '../pages/OnboardingSuccessPage'
import { PaymentPage } from '../pages/PaymentPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { RegisterPage } from '../pages/RegisterPage'
import { SlaComplaintDetailPage } from '../pages/SlaComplaintDetailPage'
import { SlaMonitoringPage } from '../pages/SlaMonitoringPage'
import { SlaPoliciesPage } from '../pages/SlaPoliciesPage'
import { VerifyEmailPage } from '../pages/VerifyEmailPage'

// Screens that have been built, keyed by full path. Anything else falls back to a placeholder.
const builtPages: Record<string, ReactElement> = {
  '/branch/escalations': <EscalationInboxPage />,
  '/tenant/escalated': <EscalatedToMePage />,
  '/tenant/sla-monitoring': <SlaMonitoringPage />,
  '/tenant/sla-policies': <SlaPoliciesPage />,
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/signup/google" element={<GoogleSignupPage />} />
      <Route path="/signin/google" element={<GoogleSigninPage />} />
      <Route path="/choose-plan" element={<ChoosePlanPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/onboarding-success" element={<OnboardingSuccessPage />} />
      {areas.map((area) => (
        <Route key={area.basePath} path={area.basePath} element={<AppLayout area={area} />}>
          <Route index element={<Navigate to={navItems(area)[0].path} replace />} />
          {navItems(area).map((item) => (
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
            <>
              <Route path="escalated/:escalationId" element={<EscalationDetailPage />} />
              <Route path="sla-monitoring/:complaintId" element={<SlaComplaintDetailPage />} />
            </>
          )}
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
