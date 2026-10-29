import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { RIDER_JWT_ISSUER } from '@/lib/auth/jwt-config';
import {
  OCORRENCIAS_ONLY_COOKIE,
  hasStackSessionCookies,
  isolationCookieOptions,
  isIsolationApiPath,
  isIsolationSecretConfigured,
  isOcorrenciasAllowedPath,
  readIsolationCookie,
  sessionFingerprint,
  signIsolationCookie,
  warnIfIsolationSecretMissing,
} from '@/lib/ocorrencias-isolation';

const RIDER_COOKIE = 'rider_token';

async function getRiderSession(request: NextRequest) {
  try {
    const token = request.cookies.get(RIDER_COOKIE)?.value;
    if (!token) return null;
    const secret = process.env.RIDER_JWT_SECRET;
    if (!secret) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ['HS256'],
      issuer: RIDER_JWT_ISSUER,
    });
    return payload as { riderId: string };
  } catch {
    return null;
  }
}

function denyOcorrenciasOnly(request: NextRequest): NextResponse {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Acesso restrito' }, { status: 403 });
  }
  return NextResponse.redirect(new URL('/ocorrencias/nova', request.url));
}

/**
 * Decisão pela sessão. Cookie assinado é só cache (5 min).
 * Apagar o cookie força nova consulta a /api/ocorrencias/isolation.
 */
async function resolveOcorrenciasOnly(request: NextRequest): Promise<{
  only: boolean;
  tokenToSet: string | null;
}> {
  const cacheEnabled = isIsolationSecretConfigured();
  if (!cacheEnabled) {
    warnIfIsolationSecretMissing();
  } else {
    const fp = await sessionFingerprint(request);
    const cached = await readIsolationCookie(
      request.cookies.get(OCORRENCIAS_ONLY_COOKIE)?.value,
      fp,
    );
    if (cached !== null) {
      return { only: cached, tokenToSet: null };
    }
  }

  if (!hasStackSessionCookies(request)) {
    return { only: false, tokenToSet: null };
  }

  try {
    const isolationUrl = new URL('/api/ocorrencias/isolation', request.url);
    const res = await fetch(isolationUrl, {
      headers: { cookie: request.headers.get('cookie') ?? '' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return { only: true, tokenToSet: null };
    }
    const data = (await res.json()) as { only?: boolean };
    const only = data.only === true;
    const tokenToSet = cacheEnabled
      ? await signIsolationCookie(only, await sessionFingerprint(request))
      : null;
    return { only, tokenToSet };
  } catch {
    return { only: true, tokenToSet: null };
  }
}

function withIsolationCookie(response: NextResponse, token: string | null) {
  if (token) {
    response.cookies.set(OCORRENCIAS_ONLY_COOKIE, token, isolationCookieOptions());
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (!isIsolationApiPath(pathname)) {
    const { only, tokenToSet } = await resolveOcorrenciasOnly(request);
    if (only && !isOcorrenciasAllowedPath(pathname)) {
      return withIsolationCookie(denyOcorrenciasOnly(request), tokenToSet);
    }
    if (tokenToSet) {
      const next = NextResponse.next();
      return withIsolationCookie(next, tokenToSet);
    }
  }

  if (pathname.startsWith('/rider')) {
    const publicRiderPaths = ['/rider/login', '/rider/setup'];
    const isPublic = publicRiderPaths.some((p) => pathname.startsWith(p));

    if (!isPublic) {
      const session = await getRiderSession(request);
      if (!session) {
        return NextResponse.redirect(new URL('/rider/login', request.url));
      }
    }
  }

  if (pathname.startsWith('/handler')) {
    const code = searchParams.get('code');
    const afterAuthReturnTo = searchParams.get('after_auth_return_to');
    if (code || afterAuthReturnTo) {
      return NextResponse.next();
    }
  }

  if (pathname.startsWith('/dashboard')) {
    const code = searchParams.get('code');
    if (code) {
      const url = request.nextUrl.clone();
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/handler/:path*',
    '/dashboard/:path*',
    '/rider/:path*',
    '/rh/usuarios/:path*',
    '/((?!_next/static|_next/image|favicon|public|icons).*)',
  ],
};
