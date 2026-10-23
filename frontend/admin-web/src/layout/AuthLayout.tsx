import type { ReactNode } from 'react'

const benefits = [
  'AI triage in seconds — category, sentiment and priority',
  'SLA escalation that never forgets a ticket',
  'Service recovery you can actually measure',
]

function BrandPanel() {
  return (
    <aside className="hidden w-140 shrink-0 flex-col justify-between bg-brand p-16 text-on-brand lg:flex">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-md bg-surface font-bold text-brand">
          R
        </span>
        <span className="text-xl font-bold">ResolveX</span>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-4xl leading-tight font-bold">
          Close the loop on every guest complaint.
        </h2>
        <ul className="flex flex-col gap-4">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-3 text-base text-brand-muted">
              <span aria-hidden>✓</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <figure className="flex flex-col gap-4 rounded-xl bg-brand-hover p-6">
        <blockquote className="text-base">
          “Our average complaint resolution time dropped from 3 hours to 25 minutes
          across 18 outlets — and we finally know which branches need help.”
        </blockquote>
        <figcaption className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-brand-muted text-sm font-semibold text-brand">
            RF
          </span>
          <span className="flex flex-col text-sm">
            <span className="font-semibold">Ruwani Fernando</span>
            <span className="text-brand-muted">
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
      <div className="flex flex-1 flex-col items-center justify-between px-6 py-12">
        <div className="flex w-full max-w-105 flex-1 flex-col justify-center gap-6">
          {children}
        </div>
        <p className="pt-8 text-xs text-content-tertiary">
          © 2026 ResolveX · Privacy · Terms
        </p>
      </div>
    </div>
  )
}
