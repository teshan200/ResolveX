import { Gift, QrCode, Sparkles, Timer, UserCheck } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const steps = [
  {
    icon: QrCode,
    title: 'Guest scans QR',
    description:
      'Branch QR codes capture the branch and service area; guests can add their table number.',
  },
  {
    icon: Sparkles,
    title: 'AI classifies',
    description: 'Category, sentiment, confidence and priority — reviewed by a human when unsure.',
  },
  {
    icon: UserCheck,
    title: 'Staff get the ticket',
    description:
      'Routed to the right branch; the Branch Manager assigns it to an employee by designation.',
  },
  {
    icon: Timer,
    title: 'SLA keeps it moving',
    description: 'Warnings before breach, then automatic escalation up your hierarchy.',
  },
  {
    icon: Gift,
    title: 'Recover & measure',
    description: 'Branch follow-ups and a post-resolution satisfaction survey close the loop.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="flex flex-col items-center gap-12 bg-canvas px-6 py-20 lg:px-20"
    >
      <SectionHeading
        eyebrow="How it works"
        title="From QR scan to closed loop in five steps"
        description="Every complaint becomes an owned, time-bound ticket — and every resolved ticket becomes a recovery opportunity."
      />

      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-md bg-brand-subtle text-brand">
                <step.icon size={20} />
              </span>
              <span className="font-mono text-[13px] leading-5 font-medium text-content-tertiary">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="text-base leading-6 font-semibold">{step.title}</h3>
            <p className="text-[13px] leading-4.5 text-content-secondary">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
