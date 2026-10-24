import { GoogleConnecting } from '../features/auth/GoogleConnecting'
import { RegisterPage } from './RegisterPage'

export function GoogleSignupPage() {
  return (
    <>
      <RegisterPage />
      <GoogleConnecting
        title="Setting up with Google…"
        description="Your email is verified by Google, so we’ll take you straight to choosing a plan."
        redirectTo="/choose-plan"
      />
    </>
  )
}
