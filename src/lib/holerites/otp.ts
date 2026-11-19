import { createHash, timingSafeEqual, randomInt } from 'crypto';

export function getOtpPepper(): string {
  const pepper = process.env.EMPLOYEE_OTP_PEPPER;
  if (!pepper || pepper.length < 16) {
    throw new Error('EMPLOYEE_OTP_PEPPER ausente ou curto demais (≥16)');
  }
  return pepper;
}

export function hashOtpCode(code: string, pepper = getOtpPepper()): string {
  return createHash('sha256').update(`${code}${pepper}`).digest('hex');
}

/** Dummy hash para equalizar tempo quando não enviamos código. */
export function dummyOtpWork(): void {
  hashOtpCode(String(randomInt(0, 1_000_000)).padStart(6, '0'), 'x'.repeat(16));
}

export async function jitterMs(min = 40, max = 120): Promise<void> {
  const ms = min + randomInt(0, Math.max(1, max - min + 1));
  await new Promise((r) => setTimeout(r, ms));
}

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'hex');
  const bb = Buffer.from(b, 'hex');
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function clientIp(req: {
  headers: { get(name: string): string | null };
}): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}
