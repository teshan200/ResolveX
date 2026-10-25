import { cn } from '../../../components/ui/cn'
import { reportTemplates } from '../mocks'
import { FormatTag } from './FormatTag'

interface TemplateGridProps {
  selected: string
  onSelect: (id: string) => void
}

/** "Report templates": six cards in two columns. The selected one is highlighted in green. */
export function TemplateGrid({ selected, onSelect }: TemplateGridProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <h2 className="text-lg leading-[26px] font-semibold whitespace-nowrap">Report templates</h2>
      <div role="group" aria-label="Report templates" className="flex flex-wrap content-start items-start gap-4">
        {reportTemplates.map((t) => {
          const active = t.id === selected
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(t.id)}
              className={cn(
                'flex w-[340px] max-w-full cursor-pointer flex-col items-start gap-3 rounded-lg p-5 text-left',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
                active ? 'border-[1.5px] border-line-brand bg-brand-subtle' : 'border border-line bg-surface',
              )}
            >
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-md',
                  active ? 'bg-brand text-on-brand' : 'bg-brand-subtle text-content-brand',
                )}
              >
                <Icon size={18} aria-hidden />
              </span>
              <span className="text-sm leading-5 font-semibold">{t.title}</span>
              <span className="text-[13px] leading-4.5 text-content-secondary">{t.description}</span>
              <span className="flex gap-2">
                <FormatTag format="PDF" />
                <FormatTag format="CSV" />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
