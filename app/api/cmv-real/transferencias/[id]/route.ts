export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import {
  atualizarTransferencia,
  competenciaEstaFechada,
  excluirTransferencia,
  obterTransferencia,
} from '@/lib/nfe/transferencia-documento';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;
  const { id } = await params;
  const doc = await obterTransferencia({ userId: tenant.tenantUserId, id });
  if (!doc) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
  const [origemFechada, destinoFechada] = await Promise.all([
    competenciaEstaFechada(tenant.tenantUserId, doc.lojaOrigem, doc.competencia),
    competenciaEstaFechada(tenant.tenantUserId, doc.lojaDestino, doc.competencia),
  ]);
  return NextResponse.json({
    ok: true,
    transferencia: doc,
    competenciaFechada: origemFechada || destinoFechada,
    lojasFechadas: [
      ...(origemFechada ? [doc.lojaOrigem] : []),
      ...(destinoFechada ? [doc.lojaDestino] : []),
    ],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_LANCAMENTOS);
  if (error) return error;
  const { id } = await params;

  const body = (await req.json()) as {
    data?: string;
    observacao?: string | null;
    itens?: Array<{
      estoqueInsumoId: string;
      quantidade: number;
      custoUnitario?: number | null;
    }>;
  };

  if (!body.itens || body.itens.length === 0) {
    return NextResponse.json({ error: 'itens obrigatórios' }, { status: 400 });
  }

  let data: Date | undefined;
  if (body.data) {
    data = new Date(`${body.data}T15:00:00.000Z`);
    if (Number.isNaN(data.getTime())) {
      return NextResponse.json({ error: 'Data inválida' }, { status: 400 });
    }
  }

  try {
    const doc = await atualizarTransferencia({
      userId: tenant.tenantUserId,
      actorUserId: tenant.actorUserId,
      id,
      data,
      observacao: body.observacao,
      itens: body.itens,
    });
    return NextResponse.json({ ok: true, transferencia: doc });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Falha ao atualizar' },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_LANCAMENTOS);
  if (error) return error;
  const { id } = await params;
  try {
    await excluirTransferencia({
      userId: tenant.tenantUserId,
      actorUserId: tenant.actorUserId,
      id,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Falha ao excluir' },
      { status: 400 },
    );
  }
}
