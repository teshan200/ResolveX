import { Hero } from '../features/landing/Hero'
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
      </main>
      <MarketingFooter />
    </div>
  )
}
