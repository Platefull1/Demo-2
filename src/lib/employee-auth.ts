import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import type { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  EMPLOYEE_JWT_AUDIENCE,
  EMPLOYEE_JWT_ISSUER,
} from '@/lib/auth/jwt-config';
import { podeAcessarPortal } from '@/lib/holerites/funcionario';

export const EMPLOYEE_COOKIE = 'employee_token';

const SESSION_DAYS = 30;
const SESSION_SECONDS = SESSION_DAYS * 24 * 60 * 60;
const SLIDING_RENEW_SECONDS = 7 * 24 * 60 * 60;

export type EmployeeTokenPayload = {
  funcionarioId: string;
  userId: string;
  lojaId: string | null;
  name: string;
  tv: number;
};

export type EmployeeSession = EmployeeTokenPayload & {
  /** Token renovado (sliding) se aplicável */
  renewedToken?: string;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.EMPLOYEE_JWT_SECRET;
  if (!secret) {
    throw new Error('EMPLOYEE_JWT_SECRET não configurado');
  }
  if (secret.length < 32) {
    throw new Error('EMPLOYEE_JWT_SECRET deve ter pelo menos 32 caracteres.');
  }
  return new TextEncoder().encode(secret);
}

export async function signEmployeeToken(
  payload: EmployeeTokenPayload,
): Promise<string> {
  return new SignJWT({
    funcionarioId: payload.funcionarioId,
    userId: payload.userId,
    lojaId: payload.lojaId,
    name: payload.name,
    tv: payload.tv,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(EMPLOYEE_JWT_ISSUER)
    .setAudience(EMPLOYEE_JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

/**
 * Só assinatura + issuer + audience + exp. Sem banco.
 * Usado no middleware (Edge).
 */
export async function verifyEmployeeTokenEdge(
  token: string,
): Promise<EmployeeTokenPayload & JWTPayload> {
  const { payload } = await jwtVerify(token, getSecretKey(), {
    algorithms: ['HS256'],
    issuer: EMPLOYEE_JWT_ISSUER,
    audience: EMPLOYEE_JWT_AUDIENCE,
  });

  const funcionarioId = payload.funcionarioId;
  const userId = payload.userId;
  const name = payload.name;
  const tv = payload.tv;

  if (
    typeof funcionarioId !== 'string' ||
    typeof userId !== 'string' ||
    typeof name !== 'string' ||
    typeof tv !== 'number'
  ) {
    throw new Error('Token de colaborador inválido');
  }

  const lojaId =
    payload.lojaId === null || typeof payload.lojaId === 'string'
      ? (payload.lojaId as string | null)
      : null;

  return {
    ...payload,
    funcionarioId,
    userId,
    lojaId,
    name,
    tv,
  };
}

function extractToken(req: NextRequest): string | null {
  const cookie = req.cookies.get(EMPLOYEE_COOKIE)?.value;
  if (cookie) return cookie;
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    const t = auth.slice(7).trim();
    return t || null;
  }
  return null;
}

/**
 * Valida JWT + estado do funcionário no banco.
 * tv / portalStatus / ativo — único ponto da regra de sessão.
 */
export async function getEmployeeSession(
  req: NextRequest,
): Promise<EmployeeSession | null> {
  try {
    const token = extractToken(req);
    if (!token) return null;

    const payload = await verifyEmployeeTokenEdge(token);

    const func = await prisma.rhFuncionario.findFirst({
      where: { id: payload.funcionarioId, userId: payload.userId },
      select: {
        id: true,
        userId: true,
        nome: true,
        lojaId: true,
        ativo: true,
        portalStatus: true,
        portalTokenVersion: true,
      },
    });

    if (!func) return null;
    if (!podeAcessarPortal(func)) return null;
    if (payload.tv !== func.portalTokenVersion) return null;

    const session: EmployeeSession = {
      funcionarioId: func.id,
      userId: func.userId,
      lojaId: func.lojaId,
      name: func.nome,
      tv: func.portalTokenVersion,
    };

    const exp = typeof payload.exp === 'number' ? payload.exp : 0;
    const secondsLeft = exp - Math.floor(Date.now() / 1000);
    if (secondsLeft > 0 && secondsLeft < SLIDING_RENEW_SECONDS) {
      session.renewedToken = await signEmployeeToken(session);
    }

    return session;
  } catch {
    return null;
  }
}

export function setEmployeeCookie(res: NextResponse, token: string): void {
  res.cookies.set(EMPLOYEE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export function clearEmployeeCookie(res: NextResponse): void {
  res.cookies.set(EMPLOYEE_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
