import type { PlanId } from '../types/plan'

// Mock implementation of the PayHere sandbox. Replace with POST /subscription/checkout.

const DECLINED_CARD = '4000000000000002'

export interface StartTrialRequest {
  planId: PlanId
  outlets: number
  cardNumber: string
}

export async function startTrial(request: StartTrialRequest): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (request.cardNumber.replace(/\s/g, '') === DECLINED_CARD) {
    throw new Error('Your card was declined by the test gateway.')
  }
}
