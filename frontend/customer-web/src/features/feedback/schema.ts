import { z } from 'zod'
import { LOW_RATING_MAX, MAX_DESCRIPTION, MIN_DESCRIPTION, dineTypes, problemAreas } from './options'

export const feedbackSchema = z
  .object({
    // The rating starts at 1 star, so it is always set.
    rating: z.number().min(1).max(5),
    dineType: z.enum(dineTypes),
    areas: z.array(z.enum(problemAreas)),
    description: z.string().trim().max(MAX_DESCRIPTION),
    // Type and size are checked when the file is picked (see photo.ts), so only valid files get here.
    photo: z.instanceof(File).nullable(),
    name: z.string().trim().max(80, 'Use 80 characters or fewer'),
    email: z
      .string()
      .trim()
      .refine((value) => value === '' || z.email().safeParse(value).success, 'Enter a valid email address'),
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
          message: `Please add at least ${MIN_DESCRIPTION} characters`,
        })
      }
    }
  })

export type FeedbackFormValues = z.infer<typeof feedbackSchema>

export const feedbackDefaults: FeedbackFormValues = {
  rating: 1,
  dineType: 'Dine in',
  areas: [],
  description: '',
  photo: null,
  name: '',
  email: '',
}
