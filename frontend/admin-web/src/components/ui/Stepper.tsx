import { Check } from 'lucide-react'
import { cn } from './cn'

interface StepperProps {
  steps: string[]
  current: number
  // Longer connectors, used in the onboarding header.
  wide?: boolean
}

export function Stepper({ steps, current, wide = false }: StepperProps) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, index) => {
        const number = index + 1
        const done = number < current
        const active = number === current

        return (
          <li key={label} className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-xs font-semibold',
                  done || active
                    ? 'bg-brand text-on-brand'
                    : 'border-[1.5px] border-line-strong bg-surface text-content-tertiary',
                )}
              >
                {done ? <Check size={14} /> : number}
              </span>
              <span
                className={cn(
                  'text-[13px] leading-4.5 font-medium',
                  done || active ? 'text-content' : 'text-content-tertiary',
                )}
              >
                {label}
              </span>
            </span>
            {number < steps.length && (
              <span
                aria-hidden
                className={cn('h-0.5', wide ? 'w-10' : 'w-6', done ? 'bg-brand' : 'bg-line')}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
