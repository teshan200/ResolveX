import { CtaBand } from '../features/landing/CtaBand'
import { Features } from '../features/landing/Features'
import { Hero } from '../features/landing/Hero'
import { HowItWorks } from '../features/landing/HowItWorks'
import { Pricing } from '../features/landing/Pricing'
import { Stats } from '../features/landing/Stats'
import { MarketingFooter } from '../layout/MarketingFooter'
import { MarketingNav } from '../layout/MarketingNav'

export function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-surface">
      <MarketingNav />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <Pricing />
        <CtaBand />
      </main>
      <MarketingFooter />
    </div>
  )
}
