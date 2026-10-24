import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button, Input } from '../../components/ui'
import { startTrial } from '../../services/paymentService'
import type { PlanId } from '../../types/plan'
import { paymentSchema } from './schema'
import type { PaymentFormInput, PaymentFormValues } from './schema'

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Payment details</h2>

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
          error={errors.cvc?.message}
          {...register('cvc')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Country" error={errors.country?.message} {...register('country')} />
        <Input
          label="Postal code"
          placeholder="00300"
          error={errors.postalCode?.message}
          {...register('postalCode')}
        />
      </div>

      <p className="text-xs text-content-tertiary">
        Encrypted 256-bit TLS · PCI-DSS compliant gateway
      </p>

      {serverError && (
        <p className="rounded-md border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-fg">
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" size="lg" loading={isSubmitting}>
          Start 14-day free trial
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Back to plans
        </Button>
      </div>
    </form>
  )
}
