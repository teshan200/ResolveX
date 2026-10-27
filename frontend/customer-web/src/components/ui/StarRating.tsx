import { StarIcon } from '../icons'
import { cn } from './cn'

interface StarRatingProps {
  /** Number of stars selected, from 1 to 5. */
  value: number
  onChange: (value: number) => void
  /** Accessible name of the group. */
  label: string
}

const words = ['', 'Very poor', 'Poor', 'Okay', 'Good', 'Excellent']

export function StarRating({ value, onChange, label }: StarRatingProps) {
  return (
    <div className="flex flex-col gap-2">
      <div role="radiogroup" aria-label={label} className="flex justify-between">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= value
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} ${star === 1 ? 'star' : 'stars'} - ${words[star]}`}
              onClick={() => onChange(star)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
            >
              <StarIcon
                className={cn(
                  'size-8 transition-colors',
                  filled ? 'fill-amber-500 text-amber-500' : 'text-neutral-300',
                )}
              />
            </button>
          )
        })}
      </div>
      <div className="flex items-start justify-between text-xs/4">
        <span
          className={cn(
            value === 1 ? 'font-semibold text-warning-fg' : 'font-medium text-content-tertiary',
          )}
        >
          Very poor
        </span>
        <span
          className={cn(
            value === 5 ? 'font-semibold text-success-fg' : 'font-medium text-content-tertiary',
          )}
        >
          Excellent
        </span>
      </div>
    </div>
  )
}
