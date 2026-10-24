interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-[11px] leading-4 font-semibold tracking-[0.66px] text-content-brand uppercase">
        {eyebrow}
      </p>
      <h2 className="text-3xl leading-9.5 font-semibold tracking-[-0.3px]">{title}</h2>
      {description && (
        <p className="max-w-160 text-base leading-6 text-content-secondary">{description}</p>
      )}
    </div>
  )
}
