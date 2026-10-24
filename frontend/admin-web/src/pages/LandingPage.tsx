import { Features } from '../features/landing/Features'
import { Hero } from '../features/landing/Hero'
import { HowItWorks } from '../features/landing/HowItWorks'
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
      </main>
      <MarketingFooter />
    </div>
  )
}
