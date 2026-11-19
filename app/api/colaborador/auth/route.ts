import { NextResponse } from 'next/server';
import { clearEmployeeCookie } from '@/lib/employee-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearEmployeeCookie(res);
  return res;
}
