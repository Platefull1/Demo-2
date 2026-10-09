export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireCmvRealAccess, resolveCmvRealStoreFilter } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import {
  montarFechamento,
  parseAjustes,
  parseRefeicoes,
  type AjusteFechamento,
  type RefeicaoFuncionario,
} from '@/lib/nfe/fechamento';
import { CMV_STORE_SLUGS, storeLabel } from '@/lib/nfe/lojas';
import { exportarFechamentoXlsx } from '@/lib/nfe/exportar-fechamento';
import { randomUUID } from 'crypto';

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

/** GET /api/cmv-real/fechamento?storeSlug=&competencia=&export=xlsx */
export async function GET(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  const storeSlug = sp.get('storeSlug');
  const competencia = sp.get('competencia');
  const exportXlsx = sp.get('export') === 'xlsx';

  if (!storeSlug || !competencia) {
    return NextResponse.json(
      { error: 'storeSlug e competencia obrigatórios' },
      { status: 400 },
    );
  }

  const filter = resolveCmvRealStoreFilter(tenant, storeSlug);
  if (filter !== null && !filter.includes(storeSlug)) {
    return NextResponse.json({ error: 'Sem acesso a esta loja' }, { status: 403 });
  }

  const data = await montarFechamento({
    tenantUserId: tenant.tenantUserId,
    storeSlug,
    competencia,
  });

  if (exportXlsx) {
    const buf = exportarFechamentoXlsx({
      storeSlug,
      competencia,
      linhas: data.linhas,
      vendaMes: data.totais.vendaMes,
      ajustes: parseAjustes(data.fechamento.ajustes),
    });
    const filename = `cmv-${storeSlug}-${competencia}.xlsx`;
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  const { getRhContext } = await import('@/lib/rh-auth');
  const ctx = await getRhContext();

  return NextResponse.json({
    ok: true,
    storeLabel: storeLabel(storeSlug),
    allowedStoreSlugs: tenant.allowedStoreSlugs ?? CMV_STORE_SLUGS,
    lojaTravada: !tenant.isAdmin && tenant.allowedStoreSlugs != null,
    canFechar:
      tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_FECHAMENTO) ?? false),
    canReabrir:
      tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_REABRIR) ?? false),
    canLancamentos:
      tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_LANCAMENTOS) ?? false),
    fechamento: {
      id: data.fechamento.id,
      status: data.fechamento.status,
      vendaMes:
        data.fechamento.vendaMes != null
          ? Number(data.fechamento.vendaMes)
          : null,
      vendaMesOrigem: data.fechamento.vendaMesOrigem,
      ajustes: parseAjustes(data.fechamento.ajustes),
      /** Legado JSON no fechamento — preferir `refeicoesSaipos` */
      refeicoes: parseRefeicoes(data.fechamento.refeicoesFuncionarios),
      contagemId: data.fechamento.contagemId,
      fechadoEm: data.fechamento.fechadoEm,
    },
    refeicoesSaipos: data.refeicoes,
    linhas: data.linhas,
    alertasTransferencia: data.alertasTransferencia,
    pendencias: data.pendencias,
    totais: data.totais,
  });
}

/**
 * PATCH /api/cmv-real/fechamento
 * body.action:
 *  - set_venda { storeSlug, competencia, vendaMes }
 *  - usar_venda_saipos { storeSlug, competencia, vendaMesSaipos }
 *  - add_ajuste { storeSlug, competencia, secao, descricao, valor }
 *  - remove_ajuste { storeSlug, competencia, ajusteId }
 *  - set_refeicoes { storeSlug, competencia, refeicoes }
 *  - fechar { storeSlug, competencia }
 *  - reabrir { storeSlug, competencia }
 */
export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as {
    action?: string;
    storeSlug?: string;
    competencia?: string;
    vendaMes?: number | null;
    vendaMesSaipos?: number;
    secao?: AjusteFechamento['secao'];
    descricao?: string;
    valor?: number;
    ajusteId?: string;
    refeicoes?: RefeicaoFuncionario[];
  };

  if (!body.action || !body.storeSlug || !body.competencia) {
    return NextResponse.json(
      { error: 'action, storeSlug e competencia obrigatórios' },
      { status: 400 },
    );
  }

  const perm =
    body.action === 'reabrir'
      ? P.CMV_REAL_REABRIR
      : P.CMV_REAL_FECHAMENTO;

  const { tenant, error } = await requireCmvRealAccess(perm, body.storeSlug);
  if (error) return error;

  const key = {
    userId_storeSlug_competencia: {
      userId: tenant.tenantUserId,
      storeSlug: body.storeSlug,
      competencia: body.competencia,
    },
  };

  let fechamento = await prisma.cmvFechamento.upsert({
    where: key,
    create: {
      userId: tenant.tenantUserId,
      storeSlug: body.storeSlug,
      competencia: body.competencia,
      status: 'ABERTO',
      ajustes: [],
      refeicoesFuncionarios: [],
    },
    update: {},
  });

  if (body.action === 'set_venda') {
    if (fechamento.status === 'FECHADO') {
      return NextResponse.json({ error: 'Competência fechada' }, { status: 400 });
    }
    fechamento = await prisma.cmvFechamento.update({
      where: { id: fechamento.id },
      data: {
        vendaMes:
          body.vendaMes == null ? null : decimal(Number(body.vendaMes)),
        vendaMesOrigem: 'MANUAL',
      },
    });
    return NextResponse.json({
      ok: true,
      vendaMes: fechamento.vendaMes != null ? Number(fechamento.vendaMes) : null,
      vendaMesOrigem: fechamento.vendaMesOrigem,
    });
  }

  if (body.action === 'usar_venda_saipos') {
    if (fechamento.status === 'FECHADO') {
      return NextResponse.json({ error: 'Competência fechada' }, { status: 400 });
    }
    if (body.vendaMesSaipos == null || !Number.isFinite(Number(body.vendaMesSaipos))) {
      return NextResponse.json(
        { error: 'vendaMesSaipos obrigatório' },
        { status: 400 }
      );
    }
    fechamento = await prisma.cmvFechamento.update({
      where: { id: fechamento.id },
      data: {
        vendaMes: decimal(Number(body.vendaMesSaipos)),
        vendaMesOrigem: 'SAIPOS',
      },
    });
    return NextResponse.json({
      ok: true,
      vendaMes: Number(fechamento.vendaMes),
      vendaMesOrigem: fechamento.vendaMesOrigem,
    });
  }

  if (body.action === 'add_ajuste') {
    if (fechamento.status === 'FECHADO') {
      return NextResponse.json({ error: 'Competência fechada' }, { status: 400 });
    }
    if (!body.secao || !body.descricao || body.valor == null) {
      return NextResponse.json(
        { error: 'secao, descricao e valor obrigatórios' },
        { status: 400 },
      );
    }
    const ajustes = parseAjustes(fechamento.ajustes);
    ajustes.push({
      id: randomUUID(),
      secao: body.secao,
      descricao: body.descricao,
      valor: Number(body.valor),
      criadoPorId: tenant.actorUserId,
      criadoEm: new Date().toISOString(),
    });
    fechamento = await prisma.cmvFechamento.update({
      where: { id: fechamento.id },
      data: { ajustes },
    });
    return NextResponse.json({ ok: true, ajustes: parseAjustes(fechamento.ajustes) });
  }

  if (body.action === 'remove_ajuste') {
    if (fechamento.status === 'FECHADO') {
      return NextResponse.json({ error: 'Competência fechada' }, { status: 400 });
    }
    const ajustes = parseAjustes(fechamento.ajustes).filter(
      (a) => a.id !== body.ajusteId,
    );
    fechamento = await prisma.cmvFechamento.update({
      where: { id: fechamento.id },
      data: { ajustes },
    });
    return NextResponse.json({ ok: true, ajustes });
  }

  if (body.action === 'set_refeicoes') {
    if (fechamento.status === 'FECHADO') {
      return NextResponse.json({ error: 'Competência fechada' }, { status: 400 });
    }
    const refeicoes = (body.refeicoes || []).map((r) => ({
      id: r.id || randomUUID(),
      descricao: r.descricao,
      valorVenda: Number(r.valorVenda),
    }));
    fechamento = await prisma.cmvFechamento.update({
      where: { id: fechamento.id },
      data: { refeicoesFuncionarios: refeicoes },
    });
    return NextResponse.json({
      ok: true,
      refeicoes: parseRefeicoes(fechamento.refeicoesFuncionarios),
    });
  }

  if (body.action === 'fechar') {
    if (fechamento.status === 'FECHADO') {
      return NextResponse.json({ ok: true, status: 'FECHADO' });
    }
    const snap = await montarFechamento({
      tenantUserId: tenant.tenantUserId,
      storeSlug: body.storeSlug,
      competencia: body.competencia,
    });
    fechamento = await prisma.cmvFechamento.update({
      where: { id: fechamento.id },
      data: {
        status: 'FECHADO',
        fechadoEm: new Date(),
        fechadoPorId: tenant.actorUserId,
        snapshot: {
          totais: snap.totais,
          refeicoes: snap.refeicoes,
          pendencias: snap.pendencias,
          alertasTransferencia: snap.alertasTransferencia,
          linhasCount: snap.linhas.length,
          pctCmvMpBruto: snap.totais.pctCmvMpBruto,
          custoRefeicoes: snap.totais.custoRefeicoes,
        },
      },
    });
    return NextResponse.json({
      ok: true,
      status: fechamento.status,
      pendencias: snap.pendencias,
    });
  }

  if (body.action === 'reabrir') {
    fechamento = await prisma.cmvFechamento.update({
      where: { id: fechamento.id },
      data: {
        status: 'ABERTO',
        fechadoEm: null,
        fechadoPorId: null,
        snapshot: Prisma.DbNull,
      },
    });
    return NextResponse.json({ ok: true, status: fechamento.status });
  }

  return NextResponse.json({ error: 'action inválida' }, { status: 400 });
}
