export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess, resolveCmvRealStoreFilter } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import {
  buscarCustoTransferencia,
  listarTransferencias,
  registrarLadoManual,
} from '@/lib/nfe/transferencia-documento';
import { competenciaFromDataEntrada } from '@/lib/nfe/dates';

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

  return NextResponse.json({
    ok: true,
    allowedStoreSlugs: tenant.allowedStoreSlugs,
    lojaTravada: !tenant.isAdmin && tenant.allowedStoreSlugs != null,
    transferencias,
  });
}

export async function POST(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_LANCAMENTOS);
  if (error) return error;

  const body = (await req.json()) as {
    tipoLado?: 'SAIDA' | 'ENTRADA';
    lojaOrigem?: string;
    lojaDestino?: string;
    data?: string;
    numeroDocumento?: string;
    observacao?: string;
    itens?: Array<{
      estoqueInsumoId: string;
      quantidade: number;
      custoUnitario?: number | null;
    }>;
  };

  if (body.tipoLado !== 'SAIDA' && body.tipoLado !== 'ENTRADA') {
    return NextResponse.json({ error: 'tipoLado inválido' }, { status: 400 });
  }
  if (!body.lojaOrigem || !body.lojaDestino || !body.data || !body.numeroDocumento) {
    return NextResponse.json(
      { error: 'lojaOrigem, lojaDestino, data e numeroDocumento obrigatórios' },
      { status: 400 },
    );
  }

  const storeDoLado = body.tipoLado === 'SAIDA' ? body.lojaOrigem : body.lojaDestino;
  if (
    !tenant.isAdmin &&
    tenant.allowedStoreSlugs &&
    !tenant.allowedStoreSlugs.includes(storeDoLado)
  ) {
    return NextResponse.json({ error: 'Sem acesso a esta loja' }, { status: 403 });
  }

  const data = new Date(`${body.data}T15:00:00.000Z`);
  if (Number.isNaN(data.getTime())) {
    return NextResponse.json({ error: 'data inválida' }, { status: 400 });
  }

  try {
    const doc = await registrarLadoManual({
      userId: tenant.tenantUserId,
      actorUserId: tenant.actorUserId,
      tipoLado: body.tipoLado,
      lojaOrigem: body.lojaOrigem,
      lojaDestino: body.lojaDestino,
      data,
      numeroDocumento: body.numeroDocumento,
      observacao: body.observacao,
      itens: body.itens ?? [],
    });
    return NextResponse.json({ ok: true, transferencia: doc }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Falha ao gravar';
    const status = msg.includes('já foi registrado') ? 409 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
