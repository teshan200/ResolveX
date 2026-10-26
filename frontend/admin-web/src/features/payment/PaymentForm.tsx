import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CircleHelp, CreditCard, Lock, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select } from '../../components/ui'
import { startTrial } from '../../services/paymentService'
import type { PlanId } from '../../types/plan'
import { paymentSchema } from './schema'
import type { PaymentFormInput, PaymentFormValues } from './schema'

const countries = [
  'Sri Lanka',
  'India',
  'Maldives',
  'Bangladesh',
  'Singapore',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
]

interface PaymentFormProps {
  planId: PlanId
  outlets: number
  onBack: () => void
  onSuccess: () => void
}

export function PaymentForm({ planId, outlets, onBack, onSuccess }: PaymentFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormInput, unknown, PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      country: 'Sri Lanka',
      postalCode: '',
    },
  })

  const onSubmit = async (values: PaymentFormValues) => {
    setServerError(null)
    try {
      await startTrial({ planId, outlets, cardNumber: values.cardNumber })
      onSuccess()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-8"
    >
      <div className="flex gap-3 rounded-lg border border-warning-border bg-warning-bg px-4 py-3">
        <TriangleAlert size={20} className="mt-0.5 shrink-0 text-warning-fg" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm leading-5 font-semibold text-warning-fg">Sandbox mode</p>
          <p className="text-[13px] leading-4.5 text-content-secondary">
            Test gateway — no real charges. Use card 4242 4242 4242 4242.
          </p>
        </div>
      </div>

      <h2 className="text-lg leading-6.5 font-semibold">Payment details</h2>

      <Input
        label="Cardholder name"
        placeholder="Marcus Vance"
        error={errors.cardholderName?.message}
        {...register('cardholderName')}
      />
      <Input
        label="Card number"
        inputMode="numeric"
        placeholder="4242 4242 4242 4242"
        leadingIcon={<CreditCard size={18} />}
        error={errors.cardNumber?.message}
        {...register('cardNumber')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiry date"
          placeholder="12 / 28"
          error={errors.expiry?.message}
          {...register('expiry')}
        />
        <Input
          label="CVC"
          inputMode="numeric"
          placeholder="•••"
          trailing={<CircleHelp size={18} />}
          error={errors.cvc?.message}
          {...register('cvc')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Country"
          options={countries}
          error={errors.country?.message}
          {...register('country')}
        />
        <Input
          label="Postal code"
          placeholder="00300"
          error={errors.postalCode?.message}
          {...register('postalCode')}
        />
      </div>

      <p className="flex items-center gap-2 text-xs leading-4 text-content-tertiary">
        <ShieldCheck size={14} />
        Encrypted 256-bit TLS · PCI-DSS compliant gateway
      </p>

      {serverError && (
        <p className="rounded-md border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-fg">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        <Lock size={20} />
        Start 14-day free trial
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="flex w-fit cursor-pointer items-center gap-1.5 text-[13px] leading-4.5 font-semibold text-content-link hover:underline"
      >
        <ArrowLeft size={16} />
        Back to plans
      </button>
    </form>
  )
}
