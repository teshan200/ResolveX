import { Gift, Sparkles, Timer } from 'lucide-react'
import type { ReactNode } from 'react'
import { Logo } from '../components/ui'

const benefits = [
  { icon: Sparkles, text: 'AI triage in seconds — category, sentiment and priority' },
  { icon: Timer, text: 'SLA escalation that never forgets a ticket' },
  { icon: Gift, text: 'Service recovery you can actually measure' },
]

function BrandPanel() {
  return (
    <aside className="hidden w-140 shrink-0 flex-col justify-between bg-brand p-16 text-on-brand lg:flex">
      <Logo inverse />

      <div className="flex flex-col gap-6">
        <h2 className="text-4xl leading-11 font-bold tracking-[-0.54px]">
          Close the loop on
          <br />
          every guest complaint.
        </h2>
        <ul className="flex w-94 flex-col gap-4">
          {benefits.map((benefit) => (
            <li key={benefit.text} className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-hover">
                <benefit.icon size={18} />
              </span>
              <span className="text-base leading-6 font-medium">{benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <figure className="flex flex-col gap-4 rounded-xl bg-brand-hover p-6">
        <blockquote className="text-base leading-6">
          “Our average complaint resolution time dropped from 3 hours to 25 minutes across 18
          outlets — and we finally know which branches need help.”
        </blockquote>
        <figcaption className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-brand-muted text-[13px] leading-4.5 font-medium text-content-brand">
            RF
          </span>
          <span className="flex flex-col">
            <span className="text-sm leading-5 font-semibold">Ruwani Fernando</span>
            <span className="text-[13px] leading-4.5 opacity-75">
              Operations Director, Spice Garden Holdings
            </span>
          </span>
        </figcaption>
      </figure>
    </aside>
  )
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <BrandPanel />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="flex w-full max-w-105 flex-col gap-6">{children}</div>
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs leading-4 whitespace-nowrap text-content-tertiary">
          © 2026 ResolveX · Privacy · Terms
        </p>
      </div>
    </div>
  )
}
