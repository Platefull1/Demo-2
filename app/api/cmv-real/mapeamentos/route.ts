export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

/** GET /api/cmv-real/mapeamentos?q= */
export async function GET(req: NextRequest) {
  const { tenant, ctx, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const q = (req.nextUrl.searchParams.get('q') || '').trim().toLowerCase();

  const rows = await prisma.nfeMapeamento.findMany({
    where: {
      userId: tenant.tenantUserId,
      ignorar: false,
      ...(q
        ? {
            OR: [
              { descricaoNormalizada: { contains: q, mode: 'insensitive' } },
              { ean: { contains: q } },
              { chave: { contains: q, mode: 'insensitive' } },
              {
                fornecedor: {
                  OR: [
                    { razaoSocial: { contains: q, mode: 'insensitive' } },
                    { nomeFantasia: { contains: q, mode: 'insensitive' } },
                  ],
                },
              },
            ],
          }
        : {}),
    },
    include: {
      fornecedor: {
        select: {
          id: true,
          razaoSocial: true,
          nomeFantasia: true,
          cnpj: true,
        },
      },
    },
    orderBy: [{ updatedAt: 'desc' }],
    take: q ? 100 : 50,
  });

  const insumoIds = [
    ...new Set(
      rows
        .map((r) => r.estoqueInsumoId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const insumos = insumoIds.length
    ? await prisma.estoqueInsumo.findMany({
        where: { id: { in: insumoIds } },
        select: { id: true, nome: true },
      })
    : [];
  const nomeById = new Map(insumos.map((i) => [i.id, i.nome]));

  return NextResponse.json({
    ok: true,
    canEditar:
      tenant.isAdmin ||
      (ctx?.hasPermission(P.CMV_REAL_MAPEAMENTO_EDITAR) ?? false) ||
      (ctx?.hasPermission(P.CMV_REAL_MAPEAMENTO_CRIAR) ?? false),
    itens: rows.map((r) => ({
      id: r.id,
      chave: r.chave,
      ean: r.ean,
      descricao: r.descricaoNormalizada,
      unidadeComercial: r.unidadeComercial,
      fatorConversao: Number(r.fatorConversao),
      estoqueInsumoId: r.estoqueInsumoId,
      produtoNome: r.estoqueInsumoId
        ? nomeById.get(r.estoqueInsumoId) || null
        : null,
      usos: r.usos,
      fornecedor: {
        id: r.fornecedor.id,
        nome:
          r.fornecedor.nomeFantasia || r.fornecedor.razaoSocial,
        cnpj: r.fornecedor.cnpj,
      },
      updatedAt: r.updatedAt.toISOString(),
    })),
  });
}

/**
 * PATCH /api/cmv-real/mapeamentos
 * body: { id, fatorConversao }
 */
export async function PATCH(req: NextRequest) {
  const { tenant, ctx, error } = await requireCmvRealAccess(
    P.CMV_REAL_VISUALIZAR,
  );
  if (error) return error;
  const canEditar =
    tenant.isAdmin ||
    (ctx?.hasPermission(P.CMV_REAL_MAPEAMENTO_EDITAR) ?? false) ||
    (ctx?.hasPermission(P.CMV_REAL_MAPEAMENTO_CRIAR) ?? false);
  if (!canEditar) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  const body = (await req.json()) as {
    id?: string;
    fatorConversao?: number;
  };

  if (!body.id || body.fatorConversao == null) {
    return NextResponse.json(
      { error: 'id e fatorConversao obrigatórios' },
      { status: 400 },
    );
  }

  const fator = Number(body.fatorConversao);
  if (!Number.isFinite(fator) || fator <= 0) {
    return NextResponse.json({ error: 'fatorConversao inválido' }, { status: 400 });
  }

  const existing = await prisma.nfeMapeamento.findFirst({
    where: { id: body.id, userId: tenant.tenantUserId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }

  const updated = await prisma.nfeMapeamento.update({
    where: { id: existing.id },
    data: { fatorConversao: decimal(fator) },
  });

  return NextResponse.json({
    ok: true,
    id: updated.id,
    fatorConversao: Number(updated.fatorConversao),
  });
}
