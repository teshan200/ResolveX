import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button, Card, Input, PriorityBadge } from '../../../components/ui'
import { WARN_MAX, WARN_MIN } from './duration'
import { defaultSlaPolicies, slaPoliciesSchema } from './schema'
import type { SlaPoliciesFormValues } from './schema'

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="pointer-events-none absolute left-3 top-[11px] size-[18px] text-content-secondary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function SlaPolicyForm() {
  const [savedValues, setSavedValues] = useState<SlaPoliciesFormValues>(defaultSlaPolicies)
  const [justSaved, setJustSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SlaPoliciesFormValues>({
    resolver: zodResolver(slaPoliciesSchema),
    defaultValues: defaultSlaPolicies,
  })

  const onSubmit = async (values: SlaPoliciesFormValues) => {
    setJustSaved(false)
    // Simulated save: no backend is connected, so the values only live in this component.
    await new Promise((resolve) => setTimeout(resolve, 600))
    setSavedValues(values)
    reset(values)
    setJustSaved(true)
  }

  const hasErrors = Boolean(errors.policies)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="SLA policies"
      className="flex flex-col gap-6"
    >
      <header className="flex flex-wrap items-center gap-4">
        <div className="min-w-64 flex-1">
          <h1 className="text-2xl font-semibold">SLA policies</h1>
          <p className="text-sm text-content-secondary">
            Acknowledgement and resolution targets for each complaint priority.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            disabled={!isDirty || isSubmitting}
            onClick={() => {
              reset(savedValues)
              setJustSaved(false)
            }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save changes
          </Button>
        </div>
      </header>

      {justSaved && !isDirty && (
        <div
          role="status"
          className="rounded-lg border border-success-border bg-success-bg px-4 py-3 text-sm font-medium text-success-fg"
        >
          SLA policies saved. This is a simulated save: nothing is sent to a server.
        </div>
      )}
      {hasErrors && (
        <div
          role="alert"
          className="rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-sm font-medium text-danger-fg"
        >
          Some targets are not valid. Review the highlighted fields and try again.
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-line-subtle px-5 py-4">
          <h2 className="text-base font-semibold">Targets by priority</h2>
          <p className="text-xs text-content-tertiary">Applied to every branch unless overridden</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-canvas text-xs text-content-secondary">
              <tr>
                <th scope="col" className="w-40 px-4 py-2.5 font-semibold">
                  Priority
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Acknowledge within
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Resolve within
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Warn at (% of target elapsed)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {defaultSlaPolicies.policies.map((row, index) => {
                const rowErrors = errors.policies?.[index]
                const name = `policies.${index}` as const
                return (
                  <tr key={row.priority}>
                    <th scope="row" className="px-4 py-3 align-top font-normal">
                      <span className="inline-flex h-10 items-center">
                        <PriorityBadge priority={row.priority} />
                      </span>
                    </th>
                    <td className="px-4 py-3 align-top">
                      <div className="relative w-44">
                        <ClockIcon />
                        <Input
                          aria-label={`${row.priority} acknowledge within`}
                          className="pl-10"
                          placeholder="e.g. 15 min"
                          error={rowErrors?.acknowledge?.message}
                          {...register(`${name}.acknowledge`)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="relative w-44">
                        <ClockIcon />
                        <Input
                          aria-label={`${row.priority} resolve within`}
                          className="pl-10"
                          placeholder="e.g. 2 h"
                          error={rowErrors?.resolve?.message}
                          {...register(`${name}.resolve`)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="w-36">
                        <Input
                          aria-label={`${row.priority} warn at percent`}
                          inputMode="numeric"
                          placeholder="e.g. 80 %"
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

        <p className="border-t border-line-subtle px-5 py-3 text-xs font-medium text-content-secondary">
          Staff get an SLA warning when this share of the acknowledge/resolve target has passed.
          Allowed range: {WARN_MIN}–{WARN_MAX}%.
        </p>
      </Card>
    </form>
  )
}
