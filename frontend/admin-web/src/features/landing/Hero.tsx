import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui'
import { IncidentPreview } from './IncidentPreview'

export function Hero() {
  return (
    <section
      id="product"
      className="bg-linear-to-b from-brand-subtle to-white px-6 pt-20 pb-16 lg:px-20"
    >
      <div className="mx-auto flex flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[13px] leading-4.5 font-medium text-content-brand">
          <Sparkles size={14} />
          AI-assisted complaint triage for multi-outlet restaurants
        </span>

        <h1 className="max-w-3xl text-4xl leading-tight font-bold tracking-[-0.96px] lg:text-5xl lg:leading-14">
          Turn every guest complaint{' '}
          <br className="hidden lg:block" />
          into a recovered customer
        </h1>

        <p className="max-w-160 text-base leading-6 text-content-secondary">
          QR feedback, AI classification, SLA-driven escalation and service recovery — in one
          platform built for restaurant chains.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/register">
            <Button size="lg">
              Start 14-day free trial
              <ArrowRight size={20} />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Book a demo
          </Button>
        </div>

        <p className="text-[13px] leading-4.5 text-content-tertiary">
          No credit card required · Setup in under 10 minutes · Cancel anytime
        </p>

        <IncidentPreview />
      </div>
    </section>
  )
}
