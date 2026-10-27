import { Camera, ChevronDown, CircleDot, Layers, Star, Type, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Sample data for the Feedback form builder, taken from the Figma "Form Builder" frame. No backend is connected.
export type QuestionType = 'rating' | 'text' | 'choice' | 'dropdown' | 'tiles' | 'photo' | 'contact' | 'section'

export interface Question {
  id: string
  type: QuestionType
  text: string
  required: boolean
  aiHint: boolean
  options: string[]
}

export const questionTypes: Record<QuestionType, { label: string; icon: LucideIcon; text: string; options: string[] }> = {
  rating: { label: 'Rating', icon: Star, text: 'How was your overall experience?', options: [] },
  text: { label: 'Text', icon: Type, text: 'Tell us more', options: [] },
  choice: { label: 'Multiple Choice', icon: CircleDot, text: 'Choose one option', options: ['Option 1', 'Option 2'] },
  dropdown: { label: 'Dropdown', icon: ChevronDown, text: 'Select an option', options: ['Option 1', 'Option 2'] },
  tiles: { label: 'Choice tiles', icon: ChevronDown, text: 'Which area was the problem?', options: ['Option 1', 'Option 2'] },
  photo: { label: 'Photo upload', icon: Camera, text: 'Add a photo', options: [] },
  contact: { label: 'Contact details', icon: User, text: 'How can we reach you?', options: [] },
  section: { label: 'Section break', icon: Layers, text: 'New section', options: [] },
}

/** Question types offered in the "Add question" palette, in the order the Figma frame shows them. */
export const paletteTypes: { type: QuestionType; label: string }[] = [
  { type: 'rating', label: 'Rating' },
  { type: 'text', label: 'Text' },
  { type: 'choice', label: 'Multiple choice' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'photo', label: 'Photo upload' },
  { type: 'contact', label: 'Contact details' },
  { type: 'section', label: 'Section break' },
]

export const choiceTypes: QuestionType[] = ['choice', 'dropdown', 'tiles']

/** The "Guest feedback · Dine-in" v5 draft shown in the Figma frame. */
export const dineInDraft: Question[] = [
  { id: 'q1', type: 'rating', text: 'How was your visit today?', required: true, aiHint: true, options: [] },
  { id: 'q2', type: 'choice', text: 'How did you dine?', required: true, aiHint: true, options: ['Dine in', 'Takeaway', 'Delivery'] },
  {
    id: 'q3',
    type: 'tiles',
    text: 'Which area was the problem?',
    required: true,
    aiHint: true,
    options: ['Food', 'Service', 'Cleanliness', 'Waiting time', 'Other'],
  },
  { id: 'q4', type: 'text', text: 'Tell us what happened', required: true, aiHint: true, options: [] },
  { id: 'q5', type: 'dropdown', text: 'Which staff member served you?', required: true, aiHint: true, options: [] },
]
