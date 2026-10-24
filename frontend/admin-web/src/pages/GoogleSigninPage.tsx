import { GoogleConnecting } from '../features/auth/GoogleConnecting'
import { LoginPage } from './LoginPage'

export function GoogleSigninPage() {
  return (
    <>
      <LoginPage />
      <GoogleConnecting
        title="Signing in with Google…"
        description="Confirming your Google account and opening your workspace."
        redirectTo="/super-admin/overview"
      />
    </>
  )
}
