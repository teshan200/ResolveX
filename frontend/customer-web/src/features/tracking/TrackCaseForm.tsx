import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRightIcon, HelpCircleIcon, MailIcon, SearchIcon, TicketIcon } from '../../components/icons'
import { AlertBanner, Button, TextField } from '../../components/ui'
import { lookupCase } from '../../services/trackingService'
import { trackCaseSchema } from './schema'
import type { TrackCaseValues } from './schema'

// Sent by the submission success screen so the guest does not have to retype them.
interface PrefillState {
  caseId?: string
  email?: string | null
}

export function TrackCaseForm() {
  const navigate = useNavigate()
  const prefill = (useLocation().state as PrefillState | null) ?? {}
  const [serverError, setServerError] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackCaseValues>({
    resolver: zodResolver(trackCaseSchema),
    defaultValues: { caseId: prefill.caseId ?? '', email: prefill.email ?? '' },
  })

  const onSubmit = async (values: TrackCaseValues) => {
    setServerError(null)
    try {
      const result = await lookupCase(values.caseId, values.email)
      navigate(`/track/${result.caseId}`, { state: { caseId: result.caseId, email: values.email } })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <span className="flex size-12 items-center justify-center rounded-lg bg-brand-subtle text-content-brand">
        <SearchIcon className="size-[22px]" />
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl/8 font-semibold tracking-tight text-content">Track your case</h1>
        <p className="text-sm/5 text-content-secondary">
          Enter your case ID and the email you used when submitting feedback.
        </p>
      </div>

      {serverError && <AlertBanner title="No matching case" description={serverError} />}

      <TextField
        label="Case ID"
        placeholder="RX-1042"
        leadingIcon={<TicketIcon />}
        helper="Found on your confirmation screen and email"
        autoCapitalize="characters"
        autoComplete="off"
        error={errors.caseId?.message}
        {...register('caseId')}
      />

      <TextField
        label="Email"
        type="email"
        placeholder="you@example.com"
        leadingIcon={<MailIcon />}
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full text-base">
        {isSubmitting ? 'Looking up…' : 'Track case'}
        {!isSubmitting && <ArrowRightIcon className="size-5" />}
      </Button>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          aria-expanded={showHelp}
          onClick={() => setShowHelp((open) => !open)}
          className="flex w-fit cursor-pointer items-center gap-1.5 text-[13px]/[18px] font-semibold text-content-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
        >
          <HelpCircleIcon className="size-3.5" />
          Can’t find your case ID?
        </button>
        {showHelp && (
          <p className="text-xs/4 text-content-secondary">
            Your case ID starts with RX- and is shown on the confirmation screen and in the email we
            sent you after you submitted feedback.
          </p>
        )}
      </div>
    </form>
  )
}
