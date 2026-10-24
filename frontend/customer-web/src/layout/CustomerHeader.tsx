import { MapPinIcon, ShieldCheckIcon, UtensilsIcon } from '../components/icons'
import type { TenantBranding } from '../mocks/branding'

export function CustomerHeader({
  restaurant,
  location,
}: Pick<TenantBranding, 'restaurant' | 'location'>) {
  return (
    <header className="flex items-center gap-3 border-b border-line-subtle bg-surface p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-content-brand">
        <UtensilsIcon className="size-[22px]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-lg/[26px] font-semibold text-content">{restaurant}</p>
        <p className="flex items-center gap-1 text-[13px]/[18px] text-content-secondary">
          <MapPinIcon className="size-3.5 shrink-0" />
          <span className="truncate">{location}</span>
        </p>
      </div>
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs/4 font-semibold text-content-secondary">
        <ShieldCheckIcon className="size-3" />
        ResolveX
      </span>
    </header>
  )
}
