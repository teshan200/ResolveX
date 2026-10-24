import { cn } from './cn'

const sizes = {
  sm: 'size-8 text-xs leading-4 font-semibold',
  md: 'size-10 text-[13px] leading-4.5 font-medium',
}

interface AvatarProps {
  initials: string
  size?: keyof typeof sizes
  className?: string
}

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-brand-muted text-content-brand',
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  )
}
