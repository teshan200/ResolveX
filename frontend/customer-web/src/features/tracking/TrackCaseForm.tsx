import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRightIcon, SearchIcon, TicketIcon } from '../../components/icons'
import { AlertBanner, Button, TextField } from '../../components/ui'
import { lookupCase } from '../../services/trackingService'
import { trackCaseSchema } from './schema'
import type { TrackCaseValues } from './schema'

// Sent by the submission success screen and the back link so the guest does not have to retype it.
interface PrefillState {
  caseId?: string
}

export function TrackCaseForm() {
  const navigate = useNavigate()
  const prefill = (useLocation().state as PrefillState | null) ?? {}
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackCaseValues>({
    resolver: zodResolver(trackCaseSchema),
    defaultValues: { caseId: prefill.caseId ?? '' },
  })

  const onSubmit = async (values: TrackCaseValues) => {
    setServerError(null)
    try {
      const result = await lookupCase(values.caseId)
      navigate(`/track/${result.caseId}`)
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
          Enter the case ID from your confirmation screen or email.
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

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full text-base">
        {isSubmitting ? 'Looking up…' : 'Track case'}
        {!isSubmitting && <ArrowRightIcon className="size-5" />}
      </Button>
    </form>
  )
}
