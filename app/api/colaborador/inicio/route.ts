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

export async function GET(req: NextRequest) {
  const session = await getEmployeeSession(req);
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const loja = session.lojaId
    ? await prisma.rhLoja.findFirst({
        where: { id: session.lojaId },
        select: { nome: true },
      })
    : null;

  const pendentes = await prisma.payslip.findMany({
    where: {
      funcionarioId: session.funcionarioId,
      status: { in: ['PUBLISHED', 'VIEWED'] },
    },
    orderBy: [{ publishedAt: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      competencia: true,
      type: true,
      status: true,
      netAmountCents: true,
      replacesId: true,
      publishedAt: true,
      acknowledgedAt: true,
    },
  });

  const ultimo = await prisma.payslip.findFirst({
    where: {
      funcionarioId: session.funcionarioId,
      status: { in: [...PORTAL_VISIBLE_STATUSES] },
    },
    orderBy: [{ competencia: 'desc' }, { publishedAt: 'desc' }],
    select: {
      id: true,
      competencia: true,
      type: true,
      status: true,
      netAmountCents: true,
      replacesId: true,
      publishedAt: true,
      acknowledgedAt: true,
    },
  });

  const res = NextResponse.json({
    nome: session.name,
    loja: loja?.nome ?? null,
    pendentes: pendentes.length,
    maisAntigoPendenteId: pendentes[0]?.id ?? null,
    ultimo: ultimo ? serializePortalPayslip(ultimo) : null,
  });
  applySessionCookie(res, session);
  return res;
}
