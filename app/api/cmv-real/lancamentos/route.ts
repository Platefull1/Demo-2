export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireCmvRealAccess, resolveCmvRealStoreFilter } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { competenciaFromDataEntrada } from '@/lib/nfe/dates';
import { CMV_STORE_SLUGS } from '@/lib/nfe/lojas';

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

/** GET /api/cmv-real/lancamentos?storeSlug=&competencia=&tipo= */
export async function GET(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  const storeOverride = sp.get('storeSlug');
  const competencia = sp.get('competencia');
  const tipo = sp.get('tipo');

  const storeFilter = resolveCmvRealStoreFilter(tenant, storeOverride);
  if (storeFilter !== null && storeFilter.length === 0) {
    return NextResponse.json({ ok: true, lancamentos: [] });
  }

  const where: Record<string, unknown> = { userId: tenant.tenantUserId };
  if (storeFilter) where.storeSlug = { in: storeFilter };
  if (competencia) where.competencia = competencia;
  if (tipo) where.tipo = tipo;

  const lancamentos = await prisma.cmvLancamento.findMany({
    where,
    orderBy: { data: 'desc' },
    take: 200,
  });

  return NextResponse.json({
    ok: true,
    allowedStoreSlugs: tenant.allowedStoreSlugs,
    lojaTravada: !tenant.isAdmin && tenant.allowedStoreSlugs != null,
    storeLabels: Object.fromEntries(
      CMV_STORE_SLUGS.map((s) => [s, s]),
    ),
    lancamentos: lancamentos.map((l) => ({
      id: l.id,
      storeSlug: l.storeSlug,
      competencia: l.competencia,
      data: l.data,
      tipo: l.tipo,
      estoqueInsumoId: l.estoqueInsumoId,
      quantidade: Number(l.quantidade),
      unidade: l.unidade,
      valorTotal: Number(l.valorTotal),
      lojaOrigem: l.lojaOrigem,
      lojaDestino: l.lojaDestino,
      observacao: l.observacao,
      nfeItemId: l.nfeItemId,
    })),
  });
}

/**
 * POST /api/cmv-real/lancamentos
 * body: { tipo, storeSlug, data, estoqueInsumoId, quantidade, valorTotal,
 *         lojaDestino?, lojaOrigem?, observacao? }
 * Tipos manuais: COMPRA_MANUAL | DESPERDICIO | TRANSFERENCIA_SAIDA | TRANSFERENCIA_ENTRADA
 */
export async function POST(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_LANCAMENTOS);
  if (error) return error;

  const body = (await req.json()) as {
    tipo?: string;
    storeSlug?: string;
    data?: string;
    estoqueInsumoId?: string;
    quantidade?: number;
    valorTotal?: number;
    unidade?: 'KG' | 'UN';
    lojaDestino?: string;
    lojaOrigem?: string;
    observacao?: string;
  };

  const tiposOk = [
    'COMPRA_MANUAL',
    'DESPERDICIO',
    'TRANSFERENCIA_SAIDA',
    'TRANSFERENCIA_ENTRADA',
  ];
  if (!body.tipo || !tiposOk.includes(body.tipo)) {
    return NextResponse.json({ error: 'tipo inválido' }, { status: 400 });
  }
  if (!body.storeSlug || !body.data || !body.estoqueInsumoId) {
    return NextResponse.json(
      { error: 'storeSlug, data e estoqueInsumoId obrigatórios' },
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

  if (body.tipo === 'TRANSFERENCIA_SAIDA' && !body.lojaDestino) {
    return NextResponse.json({ error: 'lojaDestino obrigatória' }, { status: 400 });
  }
  if (body.tipo === 'TRANSFERENCIA_ENTRADA' && !body.lojaOrigem) {
    return NextResponse.json({ error: 'lojaOrigem obrigatória' }, { status: 400 });
  }

  const data = new Date(body.data);
  if (Number.isNaN(data.getTime())) {
    return NextResponse.json({ error: 'data inválida' }, { status: 400 });
  }
  const competencia = competenciaFromDataEntrada(data);
  const qtd = Number(body.quantidade);
  const valor = Number(body.valorTotal);
  if (!Number.isFinite(qtd) || qtd <= 0) {
    return NextResponse.json({ error: 'quantidade inválida' }, { status: 400 });
  }
  if (!Number.isFinite(valor) || valor < 0) {
    return NextResponse.json({ error: 'valorTotal inválido' }, { status: 400 });
  }

  const fechado = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: tenant.tenantUserId,
        storeSlug: body.storeSlug,
        competencia,
      },
    },
  });
  if (fechado?.status === 'FECHADO') {
    return NextResponse.json(
      { error: 'Competência fechada — reabra para lançar' },
      { status: 400 },
    );
  }

  const cfg = await prisma.cmvRealInsumoConfig.findFirst({
    where: {
      userId: tenant.tenantUserId,
      estoqueInsumoId: body.estoqueInsumoId,
      ativo: true,
    },
  });
  if (!cfg) {
    return NextResponse.json({ error: 'Produto CMV não encontrado' }, { status: 404 });
  }

  const created = await prisma.cmvLancamento.create({
    data: {
      userId: tenant.tenantUserId,
      storeSlug: body.storeSlug,
      competencia,
      data,
      tipo: body.tipo as
        | 'COMPRA_MANUAL'
        | 'DESPERDICIO'
        | 'TRANSFERENCIA_SAIDA'
        | 'TRANSFERENCIA_ENTRADA',
      estoqueInsumoId: body.estoqueInsumoId,
      quantidade: decimal(qtd),
      unidade: body.unidade || cfg.unidade,
      valorTotal: decimal(valor),
      lojaDestino: body.lojaDestino || null,
      lojaOrigem: body.lojaOrigem || null,
      observacao: body.observacao || null,
      criadoPorId: tenant.actorUserId,
    },
  });

  return NextResponse.json({
    ok: true,
    lancamento: {
      id: created.id,
      competencia: created.competencia,
      tipo: created.tipo,
    },
  });
}

/** DELETE /api/cmv-real/lancamentos?id= — só manuais, competência aberta */
export async function DELETE(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_LANCAMENTOS);
  if (error) return error;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 });

  const lanc = await prisma.cmvLancamento.findFirst({
    where: { id, userId: tenant.tenantUserId },
  });
  if (!lanc) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  if (lanc.nfeItemId) {
    return NextResponse.json(
      { error: 'Lançamento de NF-e — reabra a nota' },
      { status: 400 },
    );
  }
  if (
    !tenant.isAdmin &&
    tenant.allowedStoreSlugs &&
    !tenant.allowedStoreSlugs.includes(lanc.storeSlug)
  ) {
    return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });
  }

  const fechado = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: tenant.tenantUserId,
        storeSlug: lanc.storeSlug,
        competencia: lanc.competencia,
      },
    },
  });
  if (fechado?.status === 'FECHADO') {
    return NextResponse.json({ error: 'Competência fechada' }, { status: 400 });
  }

  await prisma.cmvLancamento.delete({ where: { id: lanc.id } });
  return NextResponse.json({ ok: true });
}
