export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess, resolveCmvRealStoreFilter } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import {
  buscarCustoTransferencia,
  competenciaEstaFechada,
  listarTransferencias,
  registrarTransferenciaCompleta,
} from '@/lib/nfe/transferencia-documento';
import { competenciaFromDataEntrada } from '@/lib/nfe/dates';
import { CMV_STORE_SLUGS } from '@/lib/nfe/lojas';

export async function GET(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  if (sp.get('acao') === 'custo') {
    const lojaOrigem = sp.get('lojaOrigem');
    const estoqueInsumoId = sp.get('estoqueInsumoId');
    const competencia =
      sp.get('competencia') || competenciaFromDataEntrada(new Date());
    if (!lojaOrigem || !estoqueInsumoId) {
      return NextResponse.json(
        { error: 'lojaOrigem e estoqueInsumoId obrigatórios' },
        { status: 400 },
      );
    }
    const custo = await buscarCustoTransferencia({
      userId: tenant.tenantUserId,
      lojaOrigem,
      estoqueInsumoId,
      competencia,
    });
    return NextResponse.json({ ok: true, ...custo });
  }

  const storeOverride = sp.get('storeSlug');
  const storeFilter = resolveCmvRealStoreFilter(tenant, storeOverride);
  if (storeFilter !== null && storeFilter.length === 0) {
    return NextResponse.json({ ok: true, transferencias: [] });
  }

  const transferencias = await listarTransferencias({
    userId: tenant.tenantUserId,
    storeSlugs: storeFilter,
    competencia: sp.get('competencia'),
    status: sp.get('status'),
  });

  const slugsFechamento =
    storeFilter && storeFilter.length > 0
      ? storeFilter
      : [...CMV_STORE_SLUGS];
  const competencia = sp.get('competencia') || competenciaFromDataEntrada(new Date());
  const lojasFechadas: string[] = [];
  for (const s of slugsFechamento) {
    if (await competenciaEstaFechada(tenant.tenantUserId, s, competencia)) {
      lojasFechadas.push(s);
    }
  }

  return NextResponse.json({
    ok: true,
    allowedStoreSlugs: tenant.allowedStoreSlugs,
    lojaTravada: !tenant.isAdmin && tenant.allowedStoreSlugs != null,
    lojasFechadas,
    competenciaFechada:
      storeOverride
        ? lojasFechadas.includes(storeOverride)
        : lojasFechadas.length === slugsFechamento.length,
    transferencias,
  });
}

export async function POST(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_LANCAMENTOS);
  if (error) return error;

  const body = (await req.json()) as {
    lojaOrigem?: string;
    lojaDestino?: string;
    data?: string;
    observacao?: string;
    itens?: Array<{
      estoqueInsumoId: string;
      quantidade: number;
      custoUnitario?: number | null;
    }>;
  };

  if (!body.lojaOrigem || !body.lojaDestino || !body.data) {
    return NextResponse.json(
      { error: 'lojaOrigem, lojaDestino e data são obrigatórios' },
      { status: 400 },
    );
  }

  // Verifica acesso a ambas as lojas
  if (
    !tenant.isAdmin &&
    tenant.allowedStoreSlugs &&
    (!tenant.allowedStoreSlugs.includes(body.lojaOrigem) ||
      !tenant.allowedStoreSlugs.includes(body.lojaDestino))
  ) {
    return NextResponse.json({ error: 'Sem acesso a uma das lojas' }, { status: 403 });
  }

  const data = new Date(`${body.data}T15:00:00.000Z`);
  if (Number.isNaN(data.getTime())) {
    return NextResponse.json({ error: 'Data inválida' }, { status: 400 });
  }

  try {
    const doc = await registrarTransferenciaCompleta({
      userId: tenant.tenantUserId,
      actorUserId: tenant.actorUserId,
      lojaOrigem: body.lojaOrigem,
      lojaDestino: body.lojaDestino,
      data,
      observacao: body.observacao,
      itens: body.itens ?? [],
    });
    return NextResponse.json({ ok: true, transferencia: doc }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Falha ao gravar';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
