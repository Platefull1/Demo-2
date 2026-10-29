export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { isOcorrenciasOnlyUser } from '@/lib/ocorrencias-auth';
import { isSameOriginMutation } from '@/lib/ocorrencias-csrf';
import {
  isolationCookieOptions,
  OCORRENCIAS_ONLY_COOKIE,
  sessionFingerprint,
  signIsolationCookie,
} from '@/lib/ocorrencias-isolation';

function applyIsolationCookie(response: NextResponse, token: string | null, only: boolean) {
  if (only && token) {
    response.cookies.set(OCORRENCIAS_ONLY_COOKIE, token, isolationCookieOptions());
  } else if (!only) {
    response.cookies.delete(OCORRENCIAS_ONLY_COOKIE);
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
  }

  const stackUser = await stackServerApp.getUser({ or: 'return-null' });
  if (!stackUser) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const isOnly = await isOcorrenciasOnlyUser();
  const response = NextResponse.json({ ocorrenciasOnly: isOnly });
  applyIsolationCookie(
    response,
    await signIsolationCookie(isOnly, await sessionFingerprint(request)),
    isOnly,
  );
  return response;
}

/**
 * Logout autenticado: apaga o cache. Sem sessão, 401.
 * Apagar o cookie não libera outras APIs — o middleware reconsulta a sessão.
 */
export async function DELETE(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
  }

  const stackUser = await stackServerApp.getUser({ or: 'return-null' });
  if (!stackUser) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(OCORRENCIAS_ONLY_COOKIE);
  return response;
}
