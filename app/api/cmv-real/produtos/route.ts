export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dedupeInsumosByNome } from '@/lib/estoque-nome';
import { dedupeInsumosBySlug } from '@/lib/estoque-tenant';
import {
  incluirOrfaosNoCatalogoCmv,
  listarOrfaosCmvCatalogo,
  secaoFromCategoriaId,
  unidadeFromEstoque,
} from '@/lib/nfe/cmv-catalogo';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';

type CmvSecao = 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';
type CmvUnidade = 'KG' | 'UN';

function secaoFromCategoria(categoriaId: string): CmvSecao {
  return secaoFromCategoriaId(categoriaId);
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

  if (fonte === 'orfaos') {
    const competenciaSaldo =
      req.nextUrl.searchParams.get('competenciaSaldo') || undefined;
    const comprasRaw = req.nextUrl.searchParams.get('competenciasCompras');
    const competenciasCompras = comprasRaw
      ? comprasRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;
    const orfaos = await listarOrfaosCmvCatalogo({
      tenantUserId: tenant.tenantUserId,
      competenciaSaldo,
      competenciasCompras,
    });
    return NextResponse.json({
      ok: true,
      canConfig,
      orfaos,
    });
  }

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

/**
 * POST /api/cmv-real/produtos
 * body.action: incluir_orfaos { itens: [{ estoqueInsumoId, secao, unidade? }] }
 */
export async function POST(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_CONFIG);
  if (error) return error;

  const body = (await req.json()) as {
    action?: string;
    itens?: Array<{
      estoqueInsumoId: string;
      secao: CmvSecao;
      unidade?: CmvUnidade;
    }>;
  };

  if (body.action === 'incluir_orfaos') {
    if (!body.itens?.length) {
      return NextResponse.json({ error: 'itens obrigatório' }, { status: 400 });
    }
    const result = await incluirOrfaosNoCatalogoCmv({
      tenantUserId: tenant.tenantUserId,
      itens: body.itens.map((it) => ({
        estoqueInsumoId: it.estoqueInsumoId,
        secao: it.secao,
        unidade: it.unidade,
      })),
    });
    return NextResponse.json({ ok: true, ...result });
  }

  return NextResponse.json({ error: 'action inválida' }, { status: 400 });
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
