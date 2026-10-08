export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import {
  aplicarContagemComoSaldo,
  listarContagensConcluidasGrupo,
} from '@/lib/nfe/contagem';

/** GET /api/cmv-real/contagens — contagens concluídas do grupo */
export async function GET(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const storeSlug = req.nextUrl.searchParams.get('storeSlug');
  const list = await listarContagensConcluidasGrupo({
    memberUserIds: tenant.userIds,
    storeSlug: storeSlug || null,
  });

  return NextResponse.json({
    ok: true,
    contagens: list.map((c) => ({
      id: c.id,
      lojaNome: c.lojaNome,
      storeSlug: c.storeSlug,
      lojaNaoIdentificada: c.lojaNaoIdentificada,
      dataCriacao: c.dataCriacao,
      updatedAt: c.updatedAt,
      itensCount: c.itens.length,
    })),
  });
}

/**
 * POST /api/cmv-real/contagens
 * body: { contagemId, storeSlug, competencia }
 * Aplica estoque final (origem CONTAGEM). Exige cmv_real.fechamento.
 */
export async function POST(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_FECHAMENTO);
  if (error) return error;

  const body = (await req.json()) as {
    contagemId?: string;
    storeSlug?: string;
    competencia?: string;
  };
  if (!body.contagemId || !body.storeSlug || !body.competencia) {
    return NextResponse.json(
      { error: 'contagemId, storeSlug e competencia obrigatórios' },
      { status: 400 },
    );
  }
  if (
    !tenant.isAdmin &&
    tenant.allowedStoreSlugs &&
    !tenant.allowedStoreSlugs.includes(body.storeSlug)
  ) {
    return NextResponse.json({ error: 'Sem acesso a esta loja' }, { status: 403 });
  }

  const list = await listarContagensConcluidasGrupo({
    memberUserIds: tenant.userIds,
  });
  const contagem = list.find((c) => c.id === body.contagemId);
  if (!contagem) {
    return NextResponse.json({ error: 'Contagem não encontrada' }, { status: 404 });
  }

  const result = await aplicarContagemComoSaldo({
    tenantUserId: tenant.tenantUserId,
    storeSlug: body.storeSlug,
    competencia: body.competencia,
    contagem,
  });

  return NextResponse.json({ ok: true, ...result, contagemId: contagem.id });
}
