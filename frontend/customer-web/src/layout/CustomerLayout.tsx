import { Outlet } from 'react-router-dom'
import { mockBranding } from '../mocks/branding'
import { CustomerHeader } from './CustomerHeader'

// Mobile-first column: the Figma frames are 390px wide, so on larger screens
// the app is centered in a phone-width strip.
export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-canvas sm:border-x sm:border-line">
        <CustomerHeader restaurant={mockBranding.restaurant} location={mockBranding.location} />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
