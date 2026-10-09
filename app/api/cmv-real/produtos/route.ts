export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dedupeInsumosByNome } from '@/lib/estoque-nome';
import { dedupeInsumosBySlug } from '@/lib/estoque-tenant';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';

type CmvSecao = 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';
type CmvUnidade = 'KG' | 'UN';

function secaoFromCategoria(categoriaId: string): CmvSecao {
  const id = categoriaId.toLowerCase();
  if (id.includes('embalag')) return 'EMBALAGEM';
  if (id.includes('bebid')) return 'BEBIDA';
  return 'MATERIA_PRIMA';
}

function unidadeFromEstoque(unidade: string): CmvUnidade {
  return unidade.toLowerCase() === 'un' ? 'UN' : 'KG';
}

/**
 * GET /api/cmv-real/produtos
 * - default: CmvRealInsumoConfig (tela /cmv-real/produtos)
 * - ?fonte=estoque: catálogo da aba Produtos do /estoque (seletor de notas)
 */
export async function GET(req: NextRequest) {
  const { tenant, ctx, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const fonte = req.nextUrl.searchParams.get('fonte');
  const canConfig =
    tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_CONFIG) ?? false);

  if (fonte === 'estoque') {
    const [insumos, cmvConfigs] = await Promise.all([
      prisma.estoqueInsumo.findMany({
        where: { userId: { in: tenant.userIds } },
        orderBy: [{ categoriaId: 'asc' }, { createdAt: 'asc' }],
      }),
      prisma.cmvRealInsumoConfig.findMany({
        where: { userId: tenant.tenantUserId },
        select: {
          id: true,
          estoqueInsumoId: true,
          secao: true,
          unidade: true,
          ordem: true,
          ativo: true,
        },
      }),
    ]);

    let deduped = dedupeInsumosBySlug(insumos, tenant.tenantUserId);
    deduped = dedupeInsumosByNome(deduped, tenant.tenantUserId);

    const cmvByInsumoId = new Map(
      cmvConfigs.map((c) => [c.estoqueInsumoId, c] as const),
    );

    const itens = deduped
      .map((p) => {
        const cmv = cmvByInsumoId.get(p.id);
        return {
          id: cmv?.id ?? null,
          estoqueInsumoId: p.id,
          nome: p.nome,
          slug: p.insumoId,
          secao: (cmv?.secao ?? secaoFromCategoria(p.categoriaId)) as CmvSecao,
          unidade: (cmv?.unidade ?? unidadeFromEstoque(p.unidade)) as CmvUnidade,
          ordem: cmv?.ordem ?? 0,
          ativo: cmv?.ativo ?? true,
        };
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    return NextResponse.json({
      ok: true,
      tenantUserId: tenant.tenantUserId,
      canConfig,
      fonte: 'estoque',
      itens,
    });
  }

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
    canConfig,
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
