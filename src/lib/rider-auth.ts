import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { JWT_ALGORITHMS, RIDER_JWT_ISSUER } from '@/lib/auth/jwt-config';

export const RIDER_COOKIE = 'rider_token';
const SESSION_DURATION = 8 * 60 * 60; // 8 horas

export interface RiderSession {
  riderId: string;
  userId: string; // userId do RH que gerencia o rider
  email: string;
  name: string;
  lojaId: string;
}

function getSecret(): string {
  const secret = process.env.RIDER_JWT_SECRET;
  if (!secret) throw new Error('RIDER_JWT_SECRET não configurado');
  if (secret.length < 32) {
    throw new Error('RIDER_JWT_SECRET deve ter pelo menos 32 caracteres.');
  }
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createRiderToken(session: RiderSession): string {
  return jwt.sign(session, getSecret(), {
    expiresIn: SESSION_DURATION,
    algorithm: 'HS256',
    issuer: RIDER_JWT_ISSUER,
  });
}

export function verifyRiderJwt(token: string): RiderSession {
  const decoded = jwt.verify(token, getSecret(), {
    algorithms: [...JWT_ALGORITHMS],
    issuer: RIDER_JWT_ISSUER,
  }) as RiderSession & { exp?: number };
  if (!decoded.riderId) {
    throw new Error('Token de rider sem riderId');
  }
  if (decoded.exp && decoded.exp < Date.now() / 1000) {
    throw new Error('Token de rider expirado');
  }
  return decoded;
}

export async function getRiderSession(): Promise<RiderSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(RIDER_COOKIE)?.value;
    if (!token) return null;
    return verifyRiderJwt(token);
  } catch {
    return null;
  }
}

export async function requireRiderSession(
  req: NextRequest
): Promise<RiderSession | NextResponse> {
  try {
    const token = req.cookies.get(RIDER_COOKIE)?.value;
    if (!token) return NextResponse.redirect(new URL('/rider/login', req.url));
    return verifyRiderJwt(token);
  } catch {
    return NextResponse.redirect(new URL('/rider/login', req.url));
  }
}

export function generateInviteToken(): string {
  return crypto.randomUUID();
}
