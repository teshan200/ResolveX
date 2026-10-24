import { z } from 'zod'
import {
  LOW_RATING_MAX,
  MAX_DESCRIPTION,
  MAX_PHOTO_BYTES,
  MIN_DESCRIPTION,
  PHOTO_TYPES,
  dineTypes,
  problemAreas,
} from './options'

export const feedbackSchema = z
  .object({
    // 0 means the guest has not rated yet.
    rating: z.number().min(1, 'Please rate your visit').max(5),
    dineType: z.enum(dineTypes),
    tableNumber: z.string().trim().max(10, 'Use 10 characters or fewer'),
    areas: z.array(z.enum(problemAreas)),
    description: z.string().trim().max(MAX_DESCRIPTION),
    photo: z.instanceof(File).nullable(),
    name: z.string().trim().max(80, 'Use 80 characters or fewer'),
    email: z
      .string()
      .trim()
      .refine((value) => value === '' || z.email().safeParse(value).success, 'Enter a valid email'),
  })
  .superRefine((values, ctx) => {
    // Conditional logic: an unhappy (or missing) rating needs details so the branch can act on it.
    if (values.rating <= LOW_RATING_MAX) {
      if (values.areas.length === 0) {
        ctx.addIssue({ code: 'custom', path: ['areas'], message: 'Select at least one area' })
      }
      if (values.description.length < MIN_DESCRIPTION) {
        ctx.addIssue({
          code: 'custom',
          path: ['description'],
          message: `Tell us a little more (at least ${MIN_DESCRIPTION} characters)`,
        })
      }
    }

    if (values.photo) {
      if (!PHOTO_TYPES.includes(values.photo.type)) {
        ctx.addIssue({
          code: 'custom',
          path: ['photo'],
          message: 'Use a JPG, PNG, WEBP or HEIC image',
        })
      } else if (values.photo.size > MAX_PHOTO_BYTES) {
        ctx.addIssue({ code: 'custom', path: ['photo'], message: 'Photo must be under 10 MB' })
      }
    }
  })

export type FeedbackFormValues = z.infer<typeof feedbackSchema>

export const feedbackDefaults: FeedbackFormValues = {
  rating: 0,
  dineType: 'Dine in',
  tableNumber: '',
  areas: [],
  description: '',
  photo: null,
  name: '',
  email: '',
}
