import { GoogleConnecting } from '../features/auth/GoogleConnecting'
import { AuthLayout } from '../layout/AuthLayout'

export function GoogleSignupPage() {
  return (
    <AuthLayout>
      <GoogleConnecting
        title="Setting up with Google…"
        description="Your email is verified by Google, so we’ll take you straight to choosing a plan."
        redirectTo="/choose-plan"
      />
    </AuthLayout>
  )
}
