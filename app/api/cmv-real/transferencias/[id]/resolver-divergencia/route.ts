export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { resolverDivergenciaWhatsapp } from '@/lib/nfe/transferencia-documento';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_LANCAMENTOS);
  if (error) return error;

  const { id } = await params;
  const body = (await req.json()) as {
    motivo?: string;
    itens?: Array<{
      estoqueInsumoId: string;
      escolha: 'ENVIADA' | 'RECEBIDA' | 'OUTRA';
      quantidade?: number | null;
    }>;
  };

  if (!body.motivo?.trim()) {
    return NextResponse.json({ error: 'Motivo obrigatório' }, { status: 400 });
  }
  if (!body.itens?.length) {
    return NextResponse.json({ error: 'Itens obrigatórios' }, { status: 400 });
  }

  try {
    const doc = await resolverDivergenciaWhatsapp({
      userId: tenant.tenantUserId,
      actorUserId: tenant.actorUserId,
      id,
      motivo: body.motivo,
      itens: body.itens,
    });
    return NextResponse.json({ ok: true, transferencia: doc });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Falha ao resolver' },
      { status: 400 },
    );
  }
}
