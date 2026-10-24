import { cn } from './cn'

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-md font-bold',
          inverse ? 'bg-surface text-brand' : 'bg-brand text-on-brand',
        )}
      >
        R
      </span>
      <span className={cn('text-xl font-bold', inverse ? 'text-on-brand' : 'text-brand')}>
        ResolveX
      </span>
    </span>
  )
}
