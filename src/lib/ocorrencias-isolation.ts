/**
 * Isolamento de usuários que só têm REGISTRAR_OCORRENCIAS.
 * Usado no middleware (Edge): sem Prisma. A decisão vem da sessão
 * via GET /api/ocorrencias/isolation; o cookie é cache assinado.
 */

import { SignJWT, jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

export const OCORRENCIAS_ONLY_COOKIE = 'platefull_ocorrencias_only';
export const ISOLATION_COOKIE_MAX_AGE = 5 * 60;

const ALLOWED_PREFIXES = [
  '/ocorrencias/nova',
  '/api/ocorrencias',
  '/handler',
  '/auth',
  '/api/auth/check-tool-permission',
];

export function isOcorrenciasAllowedPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return ALLOWED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(p),
  );
}

export function hasStackSessionCookies(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => /stack/i.test(c.name));
}

function isolationSecret(): Uint8Array | null {
  const raw =
    process.env.ADMIN_JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.STACK_SECRET_SERVER_KEY;
  if (!raw) return null;
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

export async function signIsolationCookie(only: boolean): Promise<string | null> {
  const secret = isolationSecret();
  if (!secret) return null;
  return new SignJWT({ only })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ISOLATION_COOKIE_MAX_AGE}s`)
    .sign(secret);
}

export async function readIsolationCookie(
  token: string | undefined,
): Promise<boolean | null> {
  if (!token) return null;
  const secret = isolationSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
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
