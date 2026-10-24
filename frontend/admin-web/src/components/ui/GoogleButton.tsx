import type { ComponentProps } from 'react'
import { cn } from './cn'

interface GoogleButtonProps extends ComponentProps<'button'> {
  label?: string
}

// The "G" is a placeholder, as in the Figma file. Replace it with the official
// Google mark before release.
export function GoogleButton({
  label = 'Continue with Google',
  className,
  ...props
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md border border-line-strong bg-surface px-4 text-sm leading-5 font-semibold hover:bg-muted',
        className,
      )}
      {...props}
    >
      <span className="flex size-5 items-center justify-center">G</span>
      {label}
    </button>
  )
}
