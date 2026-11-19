import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { temContatoValido } from '@/lib/holerites/publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

/** Portal + holerites do funcionário (todas as competências). */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_VIEW,
    SystemTool.HOLERITES,
  );
  if (error) return error;

  const { id } = await params;
  const func = await prisma.rhFuncionario.findFirst({
    where: { id, userId: ctx.userId },
    select: {
      id: true,
      nome: true,
      portalStatus: true,
      portalLastLoginAt: true,
      telefone: true,
      whatsappLid: true,
    },
  });
  if (!func) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const items = await prisma.payslip.findMany({
    where: {
      userId: ctx.userId,
      funcionarioId: id,
      status: { in: ['PUBLISHED', 'VIEWED', 'ACKNOWLEDGED', 'REVOKED'] },
    },
    orderBy: [{ competencia: 'desc' }, { publishedAt: 'desc' }],
    select: {
      id: true,
      competencia: true,
      type: true,
      status: true,
      replacesId: true,
      publishedAt: true,
      firstViewedAt: true,
      acknowledgedAt: true,
      loja: { select: { id: true, nome: true } },
    },
  });

  return NextResponse.json({
    portal: {
      status: func.portalStatus,
      lastLoginAt: func.portalLastLoginAt?.toISOString() ?? null,
      temWhatsapp: temContatoValido(func),
    },
    items: items.map((p) => ({
      id: p.id,
      competencia: p.competencia,
      type: p.type,
      status: p.status,
      isRetificacao: Boolean(p.replacesId),
      publishedAt: p.publishedAt?.toISOString() ?? null,
      firstViewedAt: p.firstViewedAt?.toISOString() ?? null,
      acknowledgedAt: p.acknowledgedAt?.toISOString() ?? null,
      loja: p.loja,
      funcionario: {
        id: func.id,
        nome: func.nome,
        temWhatsapp: temContatoValido(func),
      },
    })),
  });
}
