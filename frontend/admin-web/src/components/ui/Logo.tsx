import { SquareCheck } from 'lucide-react'
import { cn } from './cn'

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-md',
          inverse ? 'bg-surface text-brand' : 'bg-brand text-on-brand',
        )}
      >
        <SquareCheck size={18} />
      </span>
      <span
        className={cn(
          'text-lg leading-6.5 font-semibold',
          inverse ? 'text-on-brand' : 'text-content',
        )}
      >
        Resolve<span className={inverse ? 'text-brand-muted' : 'text-teal-600'}>X</span>
      </span>
    </span>
  )
}
