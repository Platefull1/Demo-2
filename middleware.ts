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
import { isCronApiRequest, matchApiTool } from '@/lib/auth/api-tool-map';

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

async function enforceApiTool(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/api/')) return null;
  if (isCronApiRequest(request.headers)) return null;
  // Ingest / relatórios via ServiceApiKey (sem sessão Stack)
  if (request.headers.get('x-api-key') && !hasStackSessionCookies(request)) {
    return null;
  }

  const gate = matchApiTool(pathname);
  if (!gate || gate.type === 'skip') return null;

  const tools = gate.type === 'any' ? gate.tools : [gate.tool];
  let sawUnauthenticated = false;

  for (const tool of tools) {
    const url = new URL('/api/auth/check-tool-permission', request.url);
    url.searchParams.set('tool', tool);
    const res = await fetch(url, {
      headers: { cookie: request.headers.get('cookie') ?? '' },
      cache: 'no-store',
    });
    if (res.status === 401) {
      sawUnauthenticated = true;
      continue;
    }
    if (res.ok) {
      const data = (await res.json()) as { hasPermission?: boolean };
      if (data.hasPermission === true) return null;
    }
  }

  if (sawUnauthenticated) {
    return NextResponse.json(
      {
        error: 'Não autenticado',
        message: 'Você precisa estar logado para acessar esta ferramenta',
      },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      error: 'Acesso negado',
      message: `Você não tem permissão para acessar a ferramenta: ${tools[0]}. Entre em contato com o administrador.`,
    },
    { status: 403 },
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  let isolationToken: string | null = null;

  if (!isIsolationApiPath(pathname)) {
    const { only, tokenToSet } = await resolveOcorrenciasOnly(request);
    isolationToken = tokenToSet;
    if (only && !isOcorrenciasAllowedPath(pathname)) {
      return withIsolationCookie(denyOcorrenciasOnly(request), tokenToSet);
    }
  }

  const toolDeny = await enforceApiTool(request);
  if (toolDeny) {
    return withIsolationCookie(toolDeny, isolationToken);
  }

  if (pathname.startsWith('/rider')) {
    const publicRiderPaths = ['/rider/login', '/rider/setup'];
    const isPublic = publicRiderPaths.some((p) => pathname.startsWith(p));

    if (!isPublic) {
      const session = await getRiderSession(request);
      if (!session) {
        return withIsolationCookie(
          NextResponse.redirect(new URL('/rider/login', request.url)),
          isolationToken,
        );
      }
    }
  }

  if (pathname.startsWith('/handler')) {
    const code = searchParams.get('code');
    const afterAuthReturnTo = searchParams.get('after_auth_return_to');
    if (code || afterAuthReturnTo) {
      return withIsolationCookie(NextResponse.next(), isolationToken);
    }
  }

  if (pathname.startsWith('/dashboard')) {
    const code = searchParams.get('code');
    if (code) {
      const url = request.nextUrl.clone();
      url.search = '';
      return withIsolationCookie(NextResponse.redirect(url), isolationToken);
    }
  }

  return withIsolationCookie(NextResponse.next(), isolationToken);
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
