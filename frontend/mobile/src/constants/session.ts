// Length of an authenticated staff session.
// TEMPORARY testing value (10 seconds). The intended production value is 12 hours:
//   12 * 60 * 60 * 1000
export const SESSION_TIMEOUT_MS = 12 * 60 * 60 * 1000;

// Routes that require an active session (the screens inside src/app/(tabs)).
export const PROTECTED_ROUTES: readonly string[] = ["/home", "/tickets", "/alerts", "/profile"];
