import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface GoogleConnectingProps {
  title: string
  description: string
  redirectTo: string
  delayMs?: number
}

export function GoogleConnecting({
  title,
  description,
  redirectTo,
  delayMs = 2500,
}: GoogleConnectingProps) {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate(redirectTo, { replace: true }), delayMs)
    return () => clearTimeout(timer)
  }, [navigate, redirectTo, delayMs])

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span
        aria-hidden
        className="size-12 animate-spin rounded-full border-4 border-brand-muted border-t-brand"
      />
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-content-secondary">{description}</p>
      <p className="text-xs text-content-tertiary">
        Simulated in this prototype — no Google account is contacted.
      </p>
    </div>
  )
}
