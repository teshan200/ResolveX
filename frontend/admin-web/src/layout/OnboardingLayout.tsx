import { CircleHelp } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo, Stepper } from '../components/ui'
import { cn } from '../components/ui/cn'

interface OnboardingLayoutProps {
  children: ReactNode
  // Current step of the Account, Plan, Payment progress bar. Omit to hide it.
  step?: number
  // Centre the content vertically (used by the success screen).
  centered?: boolean
}

export function OnboardingLayout({ children, step, centered = false }: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-18 items-center justify-between gap-4 border-b border-line-subtle bg-surface px-6 lg:px-20">
        <Link to="/" aria-label="ResolveX home">
          <Logo />
        </Link>
        {step && <Stepper steps={['Account', 'Plan', 'Payment']} current={step} wide />}
        <span className="flex items-center gap-1.5 text-[13px] leading-4.5 font-medium text-content-secondary">
          <CircleHelp size={16} className="text-content-tertiary" />
          Need help? Contact sales
        </span>
      </header>
      <main
        className={cn(
          'mx-auto flex w-full max-w-282 flex-1 flex-col gap-8 px-6 py-10 lg:px-0',
          centered && 'justify-center',
        )}
      >
        {children}
      </main>
    </div>
  )
}
