import { NextResponse } from 'next/server';

/** Rotas /api/debug/* não devem responder em produção. */
export function denyDebugInProduction(): NextResponse | null {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEBUG_ROUTES !== '1') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return null;
}
