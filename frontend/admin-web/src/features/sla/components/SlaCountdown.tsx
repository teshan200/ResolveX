import { SlaTimer } from '../../../components/ui'
import { timerLabel, toTimerState } from '../sla'
import type { SlaTiming } from '../sla'

/** Countdown pill from the shared SlaTimer, as used in the Figma ticket lists. */
export function SlaCountdown({ timing }: { timing: SlaTiming }) {
  return <SlaTimer state={toTimerState(timing.status)} label={timerLabel(timing)} />
}
