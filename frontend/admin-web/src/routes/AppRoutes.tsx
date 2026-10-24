import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { areas } from '../layout/navigation'
import { ChoosePlanPage } from '../pages/ChoosePlanPage'
import { GoogleSignupPage } from '../pages/GoogleSignupPage'
import { LoginPage } from '../pages/LoginPage'
import { PaymentPage } from '../pages/PaymentPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { RegisterPage } from '../pages/RegisterPage'
import { VerifyEmailPage } from '../pages/VerifyEmailPage'

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
      {areas.map((area) => (
        <Route key={area.basePath} path={area.basePath} element={<AppLayout area={area} />}>
          <Route index element={<Navigate to={area.items[0].path} replace />} />
          {area.items.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<PlaceholderPage title={item.label} />}
            />
          ))}
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
