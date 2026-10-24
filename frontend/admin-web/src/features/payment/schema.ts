import { z } from 'zod'

function isFutureExpiry(value: string) {
  const match = /^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/.exec(value.trim())
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  // A card is valid until the end of its expiry month.
  return new Date(year, month, 1) > new Date()
}

export const paymentSchema = z.object({
  cardholderName: z.string().trim().min(2, 'Enter the name on the card'),
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s/g, ''))
    .pipe(z.string().regex(/^\d{16}$/, 'Enter a 16 digit card number')),
  expiry: z.string().refine(isFutureExpiry, 'Enter a valid future date, e.g. 12 / 28'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Enter 3 or 4 digits'),
  country: z.string().trim().min(1, 'Enter your country'),
  postalCode: z.string().trim().min(1, 'Enter your postal code'),
})

export type PaymentFormInput = z.input<typeof paymentSchema>
export type PaymentFormValues = z.output<typeof paymentSchema>
