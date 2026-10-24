import { useEffect, useState } from 'react'
import { MOCK_NOW_MS } from './sla'

/** Mock clock that starts at MOCK_NOW_MS and advances in real time, so countdowns visibly tick. */
export function useMockNow(): number {
  const [now, setNow] = useState(MOCK_NOW_MS)

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setNow(MOCK_NOW_MS + (Date.now() - start)), 1000)
    return () => clearInterval(id)
  }, [])

  return now
}
