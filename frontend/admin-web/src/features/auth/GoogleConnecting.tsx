import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface GoogleConnectingProps {
  title: string
  description: string
  redirectTo: string
  delayMs?: number
}

// Overlay shown on top of the page that started the Google flow (Figma "Connecting" screens).
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
    <div
      role="status"
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/48 p-4"
    >
      <div className="flex w-105.75 max-w-full flex-col items-center gap-3.5 rounded-xl bg-surface px-8 py-7 text-center shadow-[0_24px_48px_-12px_rgba(11,19,18,0.16)]">
        <span
          aria-hidden
          className="size-10 animate-spin rounded-full border-4 border-brand-muted border-t-brand"
        />
        <h2 className="text-lg leading-6.5 font-semibold">{title}</h2>
        <p className="max-w-80 text-[13px] leading-4.5 text-content-secondary">{description}</p>
        <p className="text-xs leading-4 font-medium text-content-tertiary">
          Simulated in this prototype — no Google account is contacted.
        </p>
      </div>
    </div>
  )
}
