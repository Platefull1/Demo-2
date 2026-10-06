export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { gerarLancamentosAprovacao } from '@/lib/nfe/approve';
import { Prisma } from '@prisma/client';

type Ctx = { params: Promise<{ id: string }> };

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

/** GET /api/cmv-real/notas/[id] */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;
  const { id } = await params;

  const nota = await prisma.nfeNota.findFirst({
    where: { id, userId: tenant.tenantUserId },
    include: {
      fornecedor: true,
      itens: { orderBy: { numeroItem: 'asc' } },
    },
  });
  if (!nota) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });

  if (
    !tenant.isAdmin &&
    tenant.allowedStoreSlugs &&
    !tenant.allowedStoreSlugs.includes(nota.storeSlug)
  ) {
    return NextResponse.json({ error: 'Sem acesso a esta loja' }, { status: 403 });
  }

  const { getRhContext } = await import('@/lib/rh-auth');
  const ctx = await getRhContext();

  const [nfeConfig, lancamentosRecentes] = await Promise.all([
    prisma.nfeConfig.findUnique({
      where: { userId: tenant.tenantUserId },
      select: { limiteVariacaoCustoPercent: true },
    }),
    prisma.cmvLancamento.findMany({
      where: {
        userId: tenant.tenantUserId,
        tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
        data: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
      select: { estoqueInsumoId: true, quantidade: true, valorTotal: true },
    }),
  ]);

  const custoMedioPorInsumo: Record<string, number> = {};
  const acc = new Map<string, { qtd: number; valor: number }>();
  for (const l of lancamentosRecentes) {
    const q = Number(l.quantidade);
    const v = Number(l.valorTotal);
    if (q <= 0) continue;
    const cur = acc.get(l.estoqueInsumoId) ?? { qtd: 0, valor: 0 };
    cur.qtd += q;
    cur.valor += v;
    acc.set(l.estoqueInsumoId, cur);
  }
  for (const [insumoId, a] of acc) {
    if (a.qtd > 0) custoMedioPorInsumo[insumoId] = a.valor / a.qtd;
  }

  return NextResponse.json({
    ok: true,
    canRevisar:
      tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_REVISAR_APROVAR) ?? false),
    canMapeamentoCriar:
      tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_MAPEAMENTO_CRIAR) ?? false),
    canMapeamentoEditar:
      tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_MAPEAMENTO_EDITAR) ?? false),
    custoMedioPorInsumo,
    limiteVariacaoCustoPercent: Number(nfeConfig?.limiteVariacaoCustoPercent ?? 30),
    nota: {
      id: nota.id,
      numero: nota.numero,
      storeSlug: nota.storeSlug,
      status: nota.status,
      dataEntrada: nota.dataEntrada,
      dataEmissao: nota.dataEmissao,
      valorTotal: Number(nota.valorTotal),
      competencia: nota.competencia,
      alertas: nota.alertas,
      chaveAcesso: nota.chaveAcesso,
      fornecedor: {
        id: nota.fornecedor.id,
        razaoSocial: nota.fornecedor.razaoSocial,
        nomeFantasia: nota.fornecedor.nomeFantasia,
        cnpj: nota.fornecedor.cnpj,
        ignorarCmv: nota.fornecedor.ignorarCmv,
      },
      itens: nota.itens.map((it) => ({
        id: it.id,
        saiposItemId: it.saiposItemId,
        numeroItem: it.numeroItem,
        descricao: it.descricao,
        status: it.status,
        quantidade: Number(it.quantidade),
        unidadeComercial: it.unidadeComercial,
        valorBruto: Number(it.valorBruto),
        valorLiquido: it.valorLiquido != null ? Number(it.valorLiquido) : null,
        fatorSugerido:
          it.fatorSugerido != null ? Number(it.fatorSugerido) : null,
        fatorSugeridoOrigem: it.fatorSugeridoOrigem,
        fatorConversao:
          it.fatorConversao != null ? Number(it.fatorConversao) : null,
        quantidadeConvertida:
          it.quantidadeConvertida != null
            ? Number(it.quantidadeConvertida)
            : null,
        unidadeConvertida: it.unidadeConvertida,
        sugestaoInsumoId: it.sugestaoInsumoId,
        sugestaoScore: it.sugestaoScore,
        sugestoes: it.sugestoes,
        estoqueInsumoId: it.estoqueInsumoId,
        alertas: it.alertas,
        ncm: it.ncm,
      })),
    },
  });
}

/**
 * POST /api/cmv-real/notas/[id]
 * body.action:
 *  - confirmar_item { itemId, estoqueInsumoId, fatorConversao, criarMapeamento? }
 *  - ignorar_item { itemId }
 *  - fornecedor_fora_cmv
 *  - aprovar_nota
 */
export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json()) as {
    action?: string;
    itemId?: string;
    estoqueInsumoId?: string;
    fatorConversao?: number;
    criarMapeamento?: boolean;
  };

  if (body.action === 'fornecedor_fora_cmv') {
    const { tenant, error } = await requireCmvRealAccess(
      P.CMV_REAL_MAPEAMENTO_EDITAR,
    );
    if (error) return error;

    const nota = await prisma.nfeNota.findFirst({
      where: { id, userId: tenant.tenantUserId },
      include: { fornecedor: true, itens: true },
    });
    if (!nota) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await tx.nfeFornecedor.update({
        where: { id: nota.fornecedorId },
        data: { ignorarCmv: true, motivoIgnorar: 'Marcado na revisão CMV Real' },
      });
      await tx.nfeNota.update({
        where: { id: nota.id },
        data: { status: 'IGNORADA' },
      });
      await tx.nfeItem.updateMany({
        where: { notaId: nota.id },
        data: { status: 'IGNORADO' },
      });
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'ignorar_item') {
    const { tenant, error } = await requireCmvRealAccess(
      P.CMV_REAL_REVISAR_APROVAR,
    );
    if (error) return error;
    if (!body.itemId) {
      return NextResponse.json({ error: 'itemId obrigatório' }, { status: 400 });
    }
    await prisma.nfeItem.updateMany({
      where: { id: body.itemId, nota: { userId: tenant.tenantUserId, id } },
      data: { status: 'IGNORADO', estoqueInsumoId: null, fatorConversao: null },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'confirmar_item') {
    const { tenant, ctx, error } = await requireCmvRealAccess(
      P.CMV_REAL_REVISAR_APROVAR,
    );
    if (error) return error;
    if (!body.itemId || !body.estoqueInsumoId || body.fatorConversao == null) {
      return NextResponse.json(
        { error: 'itemId, estoqueInsumoId e fatorConversao obrigatórios' },
        { status: 400 },
      );
    }

    const item = await prisma.nfeItem.findFirst({
      where: { id: body.itemId, nota: { id, userId: tenant.tenantUserId } },
      include: { nota: true },
    });
    if (!item) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });

    const cfg = await prisma.cmvRealInsumoConfig.findFirst({
      where: {
        userId: tenant.tenantUserId,
        estoqueInsumoId: body.estoqueInsumoId,
        ativo: true,
      },
    });
    const unidade = cfg?.unidade ?? 'KG';
    const fator = Number(body.fatorConversao);
    const qtdConv = Number(item.quantidade) * fator;

    let mapeamentoId: string | null = item.mapeamentoId;
    const canCreateMap =
      tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_MAPEAMENTO_CRIAR) ?? false);

    if (body.criarMapeamento && canCreateMap) {
      const { chaveMapeamentoDesc, chaveMapeamentoEan, normalizarDescricao, normalizarUnidade } =
        await import('@/lib/nfe/normalize');
      const und = normalizarUnidade(item.unidadeComercial);
      const chave = item.ean
        ? chaveMapeamentoEan(item.ean)
        : chaveMapeamentoDesc(normalizarDescricao(item.descricao), und);

      const map = await prisma.nfeMapeamento.upsert({
        where: {
          userId_fornecedorId_chave: {
            userId: tenant.tenantUserId,
            fornecedorId: item.nota.fornecedorId,
            chave,
          },
        },
        create: {
          userId: tenant.tenantUserId,
          fornecedorId: item.nota.fornecedorId,
          chave,
          ean: item.ean,
          descricaoNormalizada: normalizarDescricao(item.descricao),
          unidadeComercial: und,
          estoqueInsumoId: body.estoqueInsumoId,
          fatorConversao: decimal(fator),
          criadoPorId: tenant.actorUserId,
        },
        update: {
          estoqueInsumoId: body.estoqueInsumoId,
          fatorConversao: decimal(fator),
          usos: { increment: 1 },
          ultimoUsoEm: new Date(),
        },
      });
      mapeamentoId = map.id;
    }

    await prisma.nfeItem.update({
      where: { id: item.id },
      data: {
        status: 'MAPEADO',
        estoqueInsumoId: body.estoqueInsumoId,
        fatorConversao: decimal(fator),
        quantidadeConvertida: decimal(qtdConv),
        unidadeConvertida: unidade,
        mapeamentoId,
        custoUnitario:
          item.valorLiquido != null && qtdConv > 0
            ? decimal(Number(item.valorLiquido) / qtdConv)
            : null,
      },
    });

    return NextResponse.json({ ok: true });
  }

  if (body.action === 'aprovar_nota') {
    const { tenant, error } = await requireCmvRealAccess(
      P.CMV_REAL_REVISAR_APROVAR,
    );
    if (error) return error;

    const nota = await prisma.nfeNota.findFirst({
      where: { id, userId: tenant.tenantUserId },
      include: { itens: true },
    });
    if (!nota) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });

    const pendentes = nota.itens.filter(
      (i) => i.status === 'SUGERIDO' || i.status === 'SEM_MAPEAMENTO',
    );
    if (pendentes.length > 0) {
      return NextResponse.json(
        { error: `${pendentes.length} item(ns) ainda pendente(s)` },
        { status: 400 },
      );
    }

    await prisma.nfeNota.update({
      where: { id: nota.id },
      data: {
        status: 'APROVADA',
        aprovadaEm: new Date(),
        aprovadaPorId: tenant.actorUserId,
      },
    });

    const n = await gerarLancamentosAprovacao({
      userId: tenant.tenantUserId,
      notaId: nota.id,
      storeSlug: nota.storeSlug,
      competencia: nota.competencia,
      dataEntrada: nota.dataEntrada,
    });

    return NextResponse.json({ ok: true, lancamentos: n });
  }

  return NextResponse.json({ error: 'action inválida' }, { status: 400 });
}
