export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getEstoqueTenantContext } from '@/lib/estoque-tenant';
import { prisma } from '@/lib/prisma';
import { reprocessarNotasEmRevisao } from '@/lib/nfe/reprocessar';

/**
 * POST /api/cmv-real/reprocessar
 *
 * Catálogo = tenant RH (mesmo da aba Produtos).
 * Notas = todas as contas do time (NF-e hoje estão na API key calenzano.ahu,
 * que é membro — não no tenant platefull.app).
 */
export async function POST() {
  const ctx = await getEstoqueTenantContext();
  if (!ctx) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  try {
    // Contas do time que têm notas em revisão
    const owners = await prisma.nfeNota.findMany({
      where: {
        userId: { in: ctx.userIds },
        status: { in: ['EM_REVISAO', 'ERRO_PROCESSAMENTO'] },
      },
      select: { userId: true },
      distinct: ['userId'],
    });

    if (owners.length === 0) {
      return NextResponse.json({
        ok: true,
        processadas: 0,
        aprovadas: 0,
        aindaEmRevisao: 0,
        sugeridos: 0,
        catalogoSize: null,
        tenantUserId: ctx.tenantUserId,
        aviso: 'Nenhuma nota EM_REVISAO nas contas do time.',
      });
    }

    const totals = {
      processadas: 0,
      aprovadas: 0,
      aindaEmRevisao: 0,
      sugeridos: 0,
      catalogoSize: 0,
      tenantUserId: ctx.tenantUserId,
      contas: [] as string[],
    };

    for (const o of owners) {
      const r = await reprocessarNotasEmRevisao(o.userId);
      totals.processadas += r.processadas;
      totals.aprovadas += r.aprovadas;
      totals.aindaEmRevisao += r.aindaEmRevisao;
      totals.sugeridos += r.sugeridos;
      totals.catalogoSize = r.catalogoSize;
      totals.tenantUserId = r.tenantUserId;
      totals.contas.push(o.userId);
    }

    return NextResponse.json({ ok: true, ...totals });
  } catch (err) {
    console.error('[cmv-real/reprocessar]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao reprocessar' },
      { status: 500 },
    );
  }
}
