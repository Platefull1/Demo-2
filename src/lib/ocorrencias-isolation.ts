/**
 * Isolamento de usuários que só têm REGISTRAR_OCORRENCIAS.
 * Usado no middleware (Edge): sem Prisma. A decisão vem da sessão
 * via GET /api/ocorrencias/isolation; o cookie é cache assinado.
 */

import { SignJWT, jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

export const OCORRENCIAS_ONLY_COOKIE = 'platefull_ocorrencias_only';
export const ISOLATION_COOKIE_MAX_AGE = 5 * 60;
export const ISOLATION_JWT_ISSUER = 'ocorrencias-isolation';

const ALLOWED_PREFIXES = [
  '/ocorrencias/nova',
  '/api/ocorrencias',
  '/handler',
  '/auth',
  '/api/auth',
  '/_next',
];

export function isOcorrenciasAllowedPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function hasStackSessionCookies(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => /stack/i.test(c.name));
}

export async function sessionFingerprint(request: NextRequest): Promise<string> {
  const raw = request.cookies
    .getAll()
    .filter((c) => /stack/i.test(c.name))
    .map((c) => `${c.name}=${c.value}`)
    .sort()
    .join('|');
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(buf).slice(0, 16))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

let loggedMissingSecret = false;

export function isIsolationSecretConfigured(): boolean {
  return Boolean(process.env.OCORRENCIAS_ISOLATION_SECRET);
}

export function warnIfIsolationSecretMissing(): void {
  if (isIsolationSecretConfigured() || loggedMissingSecret) return;
  loggedMissingSecret = true;
  console.error(
    '[ocorrencias] OCORRENCIAS_ISOLATION_SECRET não configurado. Cache do cookie desligado; decisão a cada request.',
  );
}

function isolationSecret(): Uint8Array | null {
  const raw = process.env.OCORRENCIAS_ISOLATION_SECRET;
  if (!raw) {
    warnIfIsolationSecretMissing();
    return null;
  }
  return new TextEncoder().encode(raw);
}

export function isolationCookieOptions() {
  return {
    path: '/',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: ISOLATION_COOKIE_MAX_AGE,
  };
}

export async function signIsolationCookie(
  only: boolean,
  fingerprint: string,
): Promise<string | null> {
  const secret = isolationSecret();
  if (!secret || !fingerprint) return null;
  return new SignJWT({ only, fp: fingerprint })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISOLATION_JWT_ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${ISOLATION_COOKIE_MAX_AGE}s`)
    .sign(secret);
}

export async function readIsolationCookie(
  token: string | undefined,
  fingerprint: string,
): Promise<boolean | null> {
  if (!token || !fingerprint) return null;
  const secret = isolationSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
      issuer: ISOLATION_JWT_ISSUER,
    });
    if (payload.fp !== fingerprint) return null;
    return payload.only === true;
  } catch {
    return null;
  }
}

export function isIsolationApiPath(pathname: string): boolean {
  return (
    pathname === '/api/ocorrencias/isolation' ||
    pathname.startsWith('/api/ocorrencias/isolation/')
  );
}
