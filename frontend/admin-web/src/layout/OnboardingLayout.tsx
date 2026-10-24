import type { ReactNode } from 'react'
import { Stepper } from '../components/ui'

interface OnboardingLayoutProps {
  children: ReactNode
  // Current step of the Account, Plan, Payment progress bar. Omit to hide it.
  step?: number
}

export function OnboardingLayout({ children, step }: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-brand font-bold text-on-brand">
            R
          </span>
          <span className="text-xl font-bold text-brand">ResolveX</span>
        </div>
        {step && <Stepper steps={['Account', 'Plan', 'Payment']} current={step} />}
        <span className="text-sm text-content-secondary">Need help? Contact sales</span>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        {children}
      </main>
    </div>
  )
}
