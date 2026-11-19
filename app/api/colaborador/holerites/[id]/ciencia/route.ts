import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getEmployeeSession } from '@/lib/employee-auth';
import { clientIp } from '@/lib/holerites/otp';
import {
  PORTAL_VISIBLE_STATUSES,
  applySessionCookie,
} from '@/lib/holerites/portal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  aceite: z.literal(true),
});

export async function POST(req: NextRequest, ctx: Ctx) {
  const session = await getEmployeeSession(req);
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'payload_invalido' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'payload_invalido' }, { status: 400 });
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
      status: true,
      firstViewedAt: true,
      acknowledgedAt: true,
      fileSha256: true,
    },
  });

  if (!payslip) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (!payslip.firstViewedAt) {
    return NextResponse.json(
      { error: 'Abra o holerite antes de confirmar' },
      { status: 400 },
    );
  }

  if (payslip.status === 'ACKNOWLEDGED' && payslip.acknowledgedAt) {
    const res = NextResponse.json({
      acknowledgedAt: payslip.acknowledgedAt.toISOString(),
    });
    applySessionCookie(res, session);
    return res;
  }

  const now = new Date();
  const ip = clientIp(req);
  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.payslip.updateMany({
      where: {
        id: payslip.id,
        funcionarioId: session.funcionarioId,
        status: { in: ['PUBLISHED', 'VIEWED'] },
        firstViewedAt: { not: null },
      },
      data: {
        status: 'ACKNOWLEDGED',
        acknowledgedAt: now,
        ackIp: ip,
        ackUserAgent: userAgent,
        ackFileSha256: payslip.fileSha256,
      },
    });

    if (result.count === 0) {
      const again = await tx.payslip.findFirst({
        where: {
          id: payslip.id,
          funcionarioId: session.funcionarioId,
          status: 'ACKNOWLEDGED',
        },
        select: { acknowledgedAt: true },
      });
      return again?.acknowledgedAt ?? null;
    }

    await tx.payslipAccessLog.create({
      data: {
        payslipId: payslip.id,
        actorType: 'employee',
        actorId: session.funcionarioId,
        action: 'acknowledge',
        ip,
        userAgent,
      },
    });

    return now;
  });

  if (!updated) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const res = NextResponse.json({
    acknowledgedAt: updated.toISOString(),
  });
  applySessionCookie(res, session);
  return res;
}
