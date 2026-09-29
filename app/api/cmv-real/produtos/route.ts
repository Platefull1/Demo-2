export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';

/** GET /api/cmv-real/produtos — lista CmvRealInsumoConfig do tenant */
export async function GET() {
  const { tenant, ctx, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: tenant.tenantUserId },
    include: {
      estoqueInsumo: {
        select: { id: true, nome: true, insumoId: true, unidade: true },
      },
    },
    orderBy: [{ secao: 'asc' }, { ordem: 'asc' }, { createdAt: 'asc' }],
  });

  return NextResponse.json({
    ok: true,
    tenantUserId: tenant.tenantUserId,
    canConfig:
      tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_CONFIG) ?? false),
    itens: configs.map((c) => ({
      id: c.id,
      estoqueInsumoId: c.estoqueInsumoId,
      nome: c.estoqueInsumo.nome,
      slug: c.estoqueInsumo.insumoId,
      secao: c.secao,
      unidade: c.unidade,
      ordem: c.ordem,
      ativo: c.ativo,
    })),
  });
}

/** PATCH /api/cmv-real/produtos — atualiza um config { id, secao?, unidade?, ordem?, ativo? } */
export async function PATCH(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_CONFIG);
  if (error) return error;

  const body = (await req.json()) as {
    id?: string;
    secao?: 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';
    unidade?: 'KG' | 'UN';
    ordem?: number;
    ativo?: boolean;
  };
  if (!body.id) {
    return NextResponse.json({ error: 'id obrigatório' }, { status: 400 });
  }

  const existing = await prisma.cmvRealInsumoConfig.findFirst({
    where: { id: body.id, userId: tenant.tenantUserId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }

  const updated = await prisma.cmvRealInsumoConfig.update({
    where: { id: body.id },
    data: {
      ...(body.secao ? { secao: body.secao } : {}),
      ...(body.unidade ? { unidade: body.unidade } : {}),
      ...(body.ordem != null ? { ordem: body.ordem } : {}),
      ...(body.ativo != null ? { ativo: body.ativo } : {}),
    },
  });

  return NextResponse.json({ ok: true, item: updated });
}
