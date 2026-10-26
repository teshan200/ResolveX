import { cn } from '../../components/ui/cn'
import type { PasswordStrength as Strength } from './schema'

const levels: Record<Strength, { bars: number; bar: string; text: string; message: string }> = {
  empty: {
    bars: 0,
    bar: '',
    text: 'text-content-tertiary',
    message: 'Use 8+ characters with upper and lower case letters and a number',
  },
  weak: {
    bars: 1,
    bar: 'bg-warning-solid',
    text: 'text-warning-fg',
    message: 'Use 8+ characters with upper and lower case letters and a number',
  },
  strong: {
    bars: 3,
    bar: 'bg-success-solid',
    text: 'text-success-fg',
    message: 'Strong password · add a symbol to make it excellent',
  },
  excellent: {
    bars: 4,
    bar: 'bg-success-solid',
    text: 'text-success-fg',
    message: 'Excellent password',
  },
}

export function PasswordStrength({ strength }: { strength: Strength }) {
  const level = levels[strength]

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn('h-1 flex-1 rounded-[2px]', index < level.bars ? level.bar : 'bg-muted')}
          />
        ))}
      </div>
      <p className={cn('text-xs leading-4 font-medium', level.text)}>{level.message}</p>
    </div>
  )
}
