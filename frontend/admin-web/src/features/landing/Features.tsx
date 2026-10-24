import { ChartColumn, FileText, Gift, Smartphone, Sparkles, Timer } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const features = [
  {
    icon: FileText,
    title: 'Dynamic QR feedback forms',
    description:
      'Versioned forms with conditional questions, published per branch or service area.',
  },
  {
    icon: Sparkles,
    title: 'AI complaint classification',
    description:
      'Category, sub-category, sentiment and priority with a confidence score and human override.',
  },
  {
    icon: Timer,
    title: 'SLA & hierarchical escalation',
    description:
      'Acknowledgement and resolution timers that escalate staff → supervisor → manager.',
  },
  {
    icon: Smartphone,
    title: 'Staff mobile app',
    description:
      'Claim, update, attach evidence and resolve from the floor — with real-time alerts.',
  },
  {
    icon: Gift,
    title: 'Service recovery',
    description: 'Customer cases, scheduled follow-ups and post-resolution satisfaction surveys.',
  },
  {
    icon: ChartColumn,
    title: 'Analytics & reports',
    description:
      'Branch comparison, SLA violation rate, staff performance, PDF and CSV export.',
  },
]

export function Features() {
  return (
    <section id="features" className="flex flex-col items-center gap-12 bg-surface px-6 py-20 lg:px-20">
      <SectionHeading
        eyebrow="Features"
        title="Everything between the complaint and the comeback"
      />

      <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-6"
          >
            <span className="flex size-11 items-center justify-center rounded-md bg-brand text-on-brand">
              <feature.icon size={22} />
            </span>
            <h3 className="text-lg leading-6.5 font-semibold">{feature.title}</h3>
            <p className="text-sm leading-5 text-content-secondary">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
