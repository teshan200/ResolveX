import { useState } from 'react'
import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircleIcon,
  ClockIcon,
  LockIcon,
  MailIcon,
  MoreHorizontalIcon,
  SendIcon,
  SparklesIcon,
  UsersIcon,
  UtensilsIcon,
} from '../../components/icons'
import {
  AlertBanner,
  Button,
  ChoiceTile,
  FileUpload,
  FormCard,
  RadioGroup,
  StarRating,
  TextField,
  Textarea,
} from '../../components/ui'
import { submitFeedback } from '../../services/feedbackService'
import { LOW_RATING_MAX, MAX_DESCRIPTION, PHOTO_TYPES, dineTypes, problemAreas } from './options'
import type { ProblemArea } from './options'
import { validatePhoto } from './photo'
import { feedbackDefaults, feedbackSchema } from './schema'
import type { FeedbackFormValues } from './schema'

const areaIcons: Record<ProblemArea, ReactNode> = {
  Food: <UtensilsIcon />,
  Service: <UsersIcon />,
  Cleanliness: <SparklesIcon />,
  'Waiting time': <ClockIcon />,
  Other: <MoreHorizontalIcon />,
}

function FieldError({ message }: { message: string }) {
  return (
    <p role="alert" className="flex items-center gap-1.5 text-xs/4 font-medium text-danger-fg">
      <AlertCircleIcon className="size-3.5 shrink-0" />
      {message}
    </p>
  )
}

export function FeedbackForm({ qrId }: { qrId: string }) {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: feedbackDefaults,
  })

  const rating = useWatch({ control, name: 'rating' })
  const description = useWatch({ control, name: 'description' })
  const errorCount = Object.keys(errors).length
  const detailsRequired = rating <= LOW_RATING_MAX

  const onSubmit = async (values: FeedbackFormValues) => {
    setServerError(null)
    try {
      const receipt = await submitFeedback(qrId, values)
      navigate(`/feedback/${qrId}/success`, { state: receipt })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-1 flex-col">
      <div className="flex flex-col gap-3 p-4">
        {submitCount > 0 && errorCount > 0 && (
          <AlertBanner
            title={`Please fix ${errorCount} ${errorCount === 1 ? 'thing' : 'things'} before submitting`}
            description="We’ve highlighted the questions that need your attention."
          />
        )}
        {serverError && <AlertBanner title="We couldn’t send your feedback" description={serverError} />}

        <FormCard title="How was your visit today?" tag="Required" invalid={Boolean(errors.rating)}>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <StarRating
                label="Rate your visit"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value)
                  // Whether details are required depends on the rating, so re-check them.
                  if (submitCount > 0) void trigger(['areas', 'description'])
                }}
              />
            )}
          />
          {errors.rating?.message && <FieldError message={errors.rating.message} />}
        </FormCard>

        <FormCard title="How did you dine?">
          <Controller
            control={control}
            name="dineType"
            render={({ field }) => (
              <RadioGroup
                name="dineType"
                label="How did you dine?"
                options={dineTypes}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <TextField
            label="Table number (optional)"
            placeholder="e.g. 7"
            leadingIcon={<UtensilsIcon />}
            helper="One QR for all tables — add yours"
            error={errors.tableNumber?.message}
            {...register('tableNumber')}
          />
        </FormCard>

        <FormCard title="Which area was the problem?">
          <p className="text-[13px]/[18px] text-content-secondary">
            Select all that apply{detailsRequired ? '' : ' (optional)'}
          </p>
          <Controller
            control={control}
            name="areas"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {problemAreas.map((area) => (
                  <ChoiceTile
                    key={area}
                    label={area}
                    icon={areaIcons[area]}
                    selected={field.value.includes(area)}
                    onToggle={() =>
                      field.onChange(
                        field.value.includes(area)
                          ? field.value.filter((item) => item !== area)
                          : [...field.value, area],
                      )
                    }
                  />
                ))}
              </div>
            )}
          />
          {errors.areas?.message && <FieldError message={errors.areas.message} />}
        </FormCard>

        <FormCard>
          <Textarea
            label="Tell us what happened"
            placeholder="What went wrong, or what went well?"
            hint="Only the branch team can see this"
            maxLength={MAX_DESCRIPTION}
            count={description.length}
            error={errors.description?.message}
            {...register('description')}
          />
        </FormCard>

        <FormCard title="Add a photo" tag="Optional">
          <Controller
            control={control}
            name="photo"
            render={({ field }) => (
              <FileUpload
                file={field.value}
                onChange={field.onChange}
                accept={PHOTO_TYPES.join(',')}
                hint="JPG, PNG or PDF · up to 10 MB"
                validate={validatePhoto}
              />
            )}
          />
        </FormCard>

        <FormCard title="Contact details" tag="Optional">
          <p className="text-[13px]/[18px] text-content-secondary">
            Optional — so we can email you when it’s resolved.
          </p>
          <TextField
            label="Your name"
            placeholder="Nimal Perera"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <TextField
            label="Email (optional)"
            type="email"
            leadingIcon={<MailIcon />}
            placeholder="you@example.com"
            autoComplete="email"
            helper="We’ll email you once your complaint is resolved"
            error={errors.email?.message}
            {...register('email')}
          />
        </FormCard>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col items-center gap-2 border-t border-line-subtle bg-surface p-4">
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full text-base">
          {isSubmitting ? 'Submitting…' : 'Submit feedback'}
          {!isSubmitting && <SendIcon className="size-5" />}
        </Button>
        <p className="flex items-center gap-1.5 text-xs/4 text-content-tertiary">
          <LockIcon className="size-3" />
          Protected by ResolveX · contact used only for this case
        </p>
      </div>
    </form>
  )
}
