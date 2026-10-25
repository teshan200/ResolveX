// Stand-in for the case records the backend will hold. Cases submitted in this
// browser session are remembered so the tracking lookup works end to end.

export interface KnownCase {
  caseId: string
  email: string
}

const STORAGE_KEY = 'resolvex.submittedCases'

const demoCase: KnownCase = { caseId: 'RX-1042', email: 'nimal.perera@gmail.com' }

function readSubmitted(): KnownCase[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as KnownCase[]) : []
  } catch {
    return []
  }
}

export function registerCase(entry: KnownCase) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...readSubmitted(), entry]))
  } catch {
    // Storage can be blocked; the demo case still works.
  }
}

export function findCase(caseId: string, email: string): KnownCase | undefined {
  const wanted = { caseId: caseId.trim().toUpperCase(), email: email.trim().toLowerCase() }
  return [demoCase, ...readSubmitted()].find(
    (entry) =>
      entry.caseId.toUpperCase() === wanted.caseId && entry.email.toLowerCase() === wanted.email,
  )
}
