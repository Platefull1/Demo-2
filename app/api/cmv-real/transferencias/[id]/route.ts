export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import {
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
  return NextResponse.json({ ok: true, transferencia: doc });
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
