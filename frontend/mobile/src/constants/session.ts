// Length of an authenticated staff session.
// TEMPORARY testing value (10 seconds). The intended production value is 12 hours:
//   12 * 60 * 60 * 1000
export const SESSION_TIMEOUT_MS = 12 * 60 * 60 * 1000;

// Routes that require an active session (the screens inside src/app/(tabs)).
export const PROTECTED_ROUTES: readonly string[] = ["/home", "/tickets", "/alerts", "/profile"];

// True for a protected route and anything nested under it (e.g. /tickets/t-1045/update-progress).
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
