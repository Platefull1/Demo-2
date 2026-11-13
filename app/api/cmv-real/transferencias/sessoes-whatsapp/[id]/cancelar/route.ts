export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { cancelar } from '@/transferencias/sessoes';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_LANCAMENTOS);
  if (error) return error;

  const { id } = await ctx.params;
  const sessao = await prisma.sessaoTransferencia.findFirst({
    where: { id, tenantUserId: tenant.tenantUserId },
    select: { id: true },
  });
  if (!sessao) {
    return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 });
  }

  try {
    const updated = await cancelar({ sessaoId: id, forcar: true });
    return NextResponse.json({ ok: true, sessao: updated });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro ao cancelar' },
      { status: 400 },
    );
  }
}
