import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, CircleCheck, Clock, Info, Timer } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button, Input, PriorityBadge } from '../../../components/ui'
import { WARN_MAX, WARN_MIN, parseWarnAt } from './duration'
import { defaultSlaPolicies, slaPoliciesSchema } from './schema'
import type { SlaPoliciesFormValues } from './schema'

const allowedRange = `Allowed range: ${WARN_MIN}–${WARN_MAX}%.`
const defaultNote = `Staff get an SLA warning when this share of the acknowledge/resolve target has passed. ${allowedRange}`

const headCell = 'h-10 border-b border-line bg-canvas px-4 text-xs leading-4 font-semibold text-content-secondary'
const bodyCell = 'h-[61px] border-b border-line-subtle px-4'
const noWrap = '[&_p]:whitespace-nowrap'

function describeWarnChanges(before: SlaPoliciesFormValues, after: SlaPoliciesFormValues) {
  return after.policies.flatMap((row, i) => {
    const was = parseWarnAt(before.policies[i].warnAt)
    const now = parseWarnAt(row.warnAt)
    return was !== null && now !== null && was !== now
      ? [{ priority: row.priority, was, now }]
      : []
  })
}

export function SlaPolicyForm() {
  const [savedValues, setSavedValues] = useState<SlaPoliciesFormValues>(defaultSlaPolicies)
  const [savedNote, setSavedNote] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SlaPoliciesFormValues>({
    resolver: zodResolver(slaPoliciesSchema),
    defaultValues: defaultSlaPolicies,
  })

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(id)
  }, [toast])

  const onSubmit = (values: SlaPoliciesFormValues) => {
    // Simulated save: no backend is connected, so the values only live in this component.
    const changes = describeWarnChanges(savedValues, values)
    setSavedValues(values)
    reset(values)
    setSavedNote(
      changes.length
        ? `Saved just now · ${changes.map((c) => `${c.priority} warns at ${c.now}% (was ${c.was}%)`).join(', ')}. ${allowedRange}`
        : `Saved just now. ${allowedRange}`,
    )
    setToast(
      changes.length
        ? `SLA policies saved · ${changes[0].priority} warns at ${changes[0].now}%`
        : 'SLA policies saved',
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="SLA policies"
      className="flex flex-col gap-6"
    >
      <header className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-64 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">SLA policies</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Acknowledgement and resolution targets for each complaint priority.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="font-semibold!"
            onClick={() => {
              reset(savedValues)
              setSavedNote(null)
            }}
          >
            Cancel
          </Button>
          <Button type="submit" className="font-semibold!">
            <Check size={18} aria-hidden />
            Save changes
          </Button>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
          <Timer size={18} className="shrink-0 text-content" aria-hidden />
          <div>
            <h2 className="text-base leading-6 font-semibold">Targets by priority</h2>
            <p className="text-xs leading-4 text-content-tertiary">
              Applied to every branch unless overridden
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className={`${headCell} w-40`}>
                  Priority
                </th>
                <th scope="col" className={`${headCell} w-[200px]`}>
                  Acknowledge within
                </th>
                <th scope="col" className={`${headCell} w-[200px]`}>
                  Resolve within
                </th>
                <th scope="col" className={headCell}>
                  Warn at (% of target elapsed)
                </th>
              </tr>
            </thead>
            <tbody>
              {defaultSlaPolicies.policies.map((row, index) => {
                const rowErrors = errors.policies?.[index]
                const name = `policies.${index}` as const
                return (
                  <tr key={row.priority}>
                    <th scope="row" className={`${bodyCell} font-normal`}>
                      <PriorityBadge priority={row.priority} />
                    </th>
                    <td className={bodyCell}>
                      <div className={`w-[164px] ${noWrap}`}>
                        <Input
                          aria-label={`${row.priority} acknowledge within`}
                          leadingIcon={<Clock size={18} className="shrink-0 text-content" aria-hidden />}
                          error={rowErrors?.acknowledge?.message}
                          {...register(`${name}.acknowledge`)}
                        />
                      </div>
                    </td>
                    <td className={bodyCell}>
                      <div className={`w-[164px] ${noWrap}`}>
                        <Input
                          aria-label={`${row.priority} resolve within`}
                          leadingIcon={<Clock size={18} className="shrink-0 text-content" aria-hidden />}
                          error={rowErrors?.resolve?.message}
                          {...register(`${name}.resolve`)}
                        />
                      </div>
                    </td>
                    <td className={bodyCell}>
                      <div className={`w-[150px] ${noWrap}`}>
                        <Input
                          aria-label={`${row.priority} warn at percent`}
                          inputMode="numeric"
                          error={rowErrors?.warnAt?.message}
                          {...register(`${name}.warnAt`)}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="flex items-center gap-1.5 px-5 py-3 text-xs leading-4 font-medium text-content-secondary">
          <Info size={14} className="shrink-0" aria-hidden />
          {savedNote && !isDirty ? savedNote : defaultNote}
        </p>
      </div>

      <div role="status" aria-live="polite">
        {toast && (
          <div className="fixed top-22 right-8 z-50 flex w-[360px] max-w-[calc(100vw-4rem)] items-center gap-3 rounded-lg bg-inverse px-4 py-3 shadow-[0_12px_24px_-4px_rgba(11,19,18,0.1),0_4px_8px_-4px_rgba(11,19,18,0.05)]">
            <CircleCheck size={18} className="shrink-0 text-green-500" aria-hidden />
            <p className="text-sm leading-5 font-medium text-content-inverse">{toast}</p>
          </div>
        )}
      </div>
    </form>
  )
}
