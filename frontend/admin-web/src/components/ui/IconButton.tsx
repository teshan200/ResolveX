import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from './cn'

const sizes = {
  sm: { box: 'size-8', icon: 16 },
  md: { box: 'size-10', icon: 18 },
}

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon
  // Icon-only, so a label is required for screen readers.
  label: string
  size?: keyof typeof sizes
}

export function IconButton({ icon: Icon, label, size = 'md', className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-md text-content-tertiary transition-colors hover:bg-muted',
        sizes[size].box,
        className,
      )}
      {...props}
    >
      <Icon size={sizes[size].icon} />
    </button>
  )
}
