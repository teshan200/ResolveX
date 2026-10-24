// Mock implementation. Replace with the Asgardeo password reset flow.

function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function requestPasswordReset(email: string): Promise<void> {
  await delay()
  console.info(`Mock: password reset link sent to ${email}`)
}
