import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEmployeeSession } from '@/lib/employee-auth';
import {
  PORTAL_VISIBLE_STATUSES,
  applySessionCookie,
  serializePortalPayslip,
} from '@/lib/holerites/portal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const session = await getEmployeeSession(req);
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;

  const payslip = await prisma.payslip.findFirst({
    where: {
      id,
      funcionarioId: session.funcionarioId,
      status: { in: [...PORTAL_VISIBLE_STATUSES] },
    },
    select: {
      id: true,
      competencia: true,
      type: true,
      status: true,
      netAmountCents: true,
      replacesId: true,
      publishedAt: true,
      acknowledgedAt: true,
      firstViewedAt: true,
    },
  });

  if (!payslip) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const item = serializePortalPayslip(payslip);
  const res = NextResponse.json({
    ...item,
    firstViewedAt: payslip.firstViewedAt?.toISOString() ?? null,
    replacedAt: payslip.replacesId
      ? (payslip.publishedAt?.toISOString() ?? null)
      : null,
  });
  applySessionCookie(res, session);
  return res;
}
