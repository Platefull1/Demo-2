export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { listRefeicoesCompetencia } from '@/lib/cmv-real/sync-refeicoes';
import {
  calcularCustoRefeicoes,
  parseRefeicaoRegras,
  parseVendaMesConfig,
} from '@/lib/cmv-real/refeicoes';
import { montarFechamento } from '@/lib/nfe/fechamento';

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

/** GET /api/cmv-real/refeicoes?storeSlug=&competencia= */
export async function GET(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  const storeSlug = sp.get('storeSlug') || sp.get('loja');
  const competencia = sp.get('competencia');
  if (!storeSlug || !competencia) {
    return NextResponse.json(
      { error: 'storeSlug e competencia obrigatórios' },
      { status: 400 }
    );
  }

  const rows = await listRefeicoesCompetencia({
    tenantUserId: tenant.tenantUserId,
    storeSlug,
    competencia,
  });

  const fech = await montarFechamento({
    tenantUserId: tenant.tenantUserId,
    storeSlug,
    competencia,
  });

  const consumoMp = fech.linhas
    .filter((l) => l.secao === 'MATERIA_PRIMA')
    .reduce((a, l) => a + l.consumoValor, 0);

  const vendaMes =
    fech.fechamento.vendaMes != null ? Number(fech.fechamento.vendaMes) : 0;

  const calc = calcularCustoRefeicoes({
    consumoMp,
    vendaMes,
    refeicoes: rows.map((r) => ({
      categoria: r.categoria,
      valorItens: Number(r.valorItens),
      ignorada: r.ignorada,
    })),
  });

  return NextResponse.json({
    ok: true,
    items: rows.map((r) => ({
      id: r.id,
      data: r.data.toISOString().slice(0, 10),
      categoria: r.categoria,
      consumidor: r.consumidor,
      formaPagamento: r.formaPagamento,
      valorItens: Number(r.valorItens),
      saiposSaleId: r.saiposSaleId,
      origem: r.origem,
      ignorada: r.ignorada,
    })),
    resumo: calc,
    consumoMp,
    vendaMes: fech.fechamento.vendaMes != null ? Number(fech.fechamento.vendaMes) : null,
  });
}

/**
 * PATCH — manual / ignorar
 * body.action: add_manual | set_ignorada
 */
export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as {
    action?: string;
    storeSlug?: string;
    competencia?: string;
    id?: string;
    ignorada?: boolean;
    categoria?: string;
    consumidor?: string;
    formaPagamento?: string;
    valorItens?: number;
    data?: string;
  };

  if (!body.action || !body.storeSlug || !body.competencia) {
    return NextResponse.json(
      { error: 'action, storeSlug e competencia obrigatórios' },
      { status: 400 }
    );
  }

  const { tenant, error } = await requireCmvRealAccess(
    P.CMV_REAL_FECHAMENTO,
    body.storeSlug
  );
  if (error) return error;

  const fechamento = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: tenant.tenantUserId,
        storeSlug: body.storeSlug,
        competencia: body.competencia,
      },
    },
  });
  if (fechamento?.status === 'FECHADO') {
    return NextResponse.json({ error: 'Competência fechada' }, { status: 400 });
  }

  if (body.action === 'set_ignorada') {
    if (!body.id || body.ignorada == null) {
      return NextResponse.json(
        { error: 'id e ignorada obrigatórios' },
        { status: 400 }
      );
    }
    const row = await prisma.cmvRefeicao.updateMany({
      where: { id: body.id, userId: tenant.tenantUserId },
      data: { ignorada: Boolean(body.ignorada) },
    });
    if (!row.count) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'add_manual') {
    if (body.valorItens == null || !body.categoria || !body.data) {
      return NextResponse.json(
        { error: 'categoria, data e valorItens obrigatórios' },
        { status: 400 }
      );
    }
    const manualId = `manual:${randomUUID()}`;
    const created = await prisma.cmvRefeicao.create({
      data: {
        userId: tenant.tenantUserId,
        storeSlug: body.storeSlug,
        competencia: body.competencia,
        data: new Date(`${body.data}T12:00:00.000Z`),
        categoria: body.categoria,
        consumidor: body.consumidor || null,
        formaPagamento: body.formaPagamento || null,
        valorItens: decimal(Number(body.valorItens)),
        saiposSaleId: manualId,
        origem: 'MANUAL',
        ignorada: false,
      },
    });
    return NextResponse.json({
      ok: true,
      id: created.id,
    });
  }

  return NextResponse.json({ error: 'action inválida' }, { status: 400 });
}
