import { useNavigate } from 'react-router-dom'
import { Button, Card, Input } from '../components/ui'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">Sign in to ResolveX</h1>
        <Input label="Email" type="email" placeholder="you@company.com" />
        <Input label="Password" type="password" />
        {/* No authentication yet: continues to the Super Admin area. */}
        <Button onClick={() => navigate('/super-admin/overview')}>Sign in</Button>
      </Card>
    </div>
  )
}
