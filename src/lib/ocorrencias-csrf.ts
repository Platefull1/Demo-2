import type { NextRequest } from 'next/server';

/** POST/DELETE: exige Origin (ou Referer) do mesmo host. */
export function isSameOriginMutation(request: NextRequest): boolean {
  const expected = request.nextUrl.origin;
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).origin === expected;
    } catch {
      return false;
    }
  }
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).origin === expected;
    } catch {
      return false;
    }
  }
  return false;
}
