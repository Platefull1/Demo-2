export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { isOcorrenciasOnlyUser } from '@/lib/ocorrencias-auth';
import {
  isolationCookieOptions,
  sessionFingerprint,
  signIsolationCookie,
} from '@/lib/ocorrencias-isolation';

/**
 * GET /api/ocorrencias/isolation
 * Decide pela sessão (banco), não pelo cookie. Usado pelo middleware
 * quando o cache assinado está ausente ou expirou.
 */
export async function GET(request: NextRequest) {
  const only = await isOcorrenciasOnlyUser();
  const response = NextResponse.json({ only });
  const token = await signIsolationCookie(only, await sessionFingerprint(request));
  if (token) {
    response.cookies.set(
      'platefull_ocorrencias_only',
      token,
      isolationCookieOptions(),
    );
  }
  return response;
}
