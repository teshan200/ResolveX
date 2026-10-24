import { CircleCheck, CircleDot } from 'lucide-react'
import { cn } from '../../components/ui/cn'
import { passwordRules } from './schema'

const levels = [
  { label: 'Weak strength', bar: 'bg-danger-solid', text: 'text-danger-fg' },
  { label: 'Weak strength', bar: 'bg-danger-solid', text: 'text-danger-fg' },
  { label: 'Medium strength', bar: 'bg-warning-solid', text: 'text-warning-fg' },
  { label: 'Strong password', bar: 'bg-success-solid', text: 'text-success-fg' },
  { label: 'Excellent password', bar: 'bg-success-solid', text: 'text-success-fg' },
]

export function PasswordRequirements({ password }: { password: string }) {
  const results = passwordRules.map((rule) => ({ ...rule, met: rule.test(password) }))
  const score = results.filter((rule) => rule.met).length
  const level = levels[score]

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-canvas p-4">
      <div className="flex gap-1">
        {passwordRules.map((rule, index) => (
          <span
            key={rule.id}
            className={cn('h-1 flex-1 rounded-[2px]', index < score ? level.bar : 'bg-muted')}
          />
        ))}
      </div>
      <p
        className={cn(
          'text-xs leading-4 font-semibold',
          password ? level.text : 'text-content-tertiary',
        )}
      >
        {password ? level.label : 'Enter a password'}
      </p>
      {results.map((rule) => (
        <p
          key={rule.id}
          className={cn(
            'flex items-center gap-2 text-[13px] leading-4.5',
            rule.met ? 'text-content' : 'text-content-tertiary',
          )}
        >
          {rule.met ? (
            <CircleCheck size={16} className="text-success-fg" />
          ) : (
            <CircleDot size={16} className="text-content-disabled" />
          )}
          {rule.label}
        </p>
      ))}
    </div>
  )
}
