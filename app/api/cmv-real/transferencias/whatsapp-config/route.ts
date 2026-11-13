export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import {
  obterConfigTransferenciasWhatsapp,
  salvarConfigTransferenciasWhatsapp,
} from '@/transferencias/config';

export async function GET() {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const config = await obterConfigTransferenciasWhatsapp(tenant.tenantUserId);
  return NextResponse.json({ ok: true, ...config });
}

export async function PUT(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_LANCAMENTOS);
  if (error) return error;

  const body = (await req.json()) as { botId?: string | null };
  try {
    const config = await salvarConfigTransferenciasWhatsapp({
      tenantUserId: tenant.tenantUserId,
      botId: body.botId ?? null,
    });
    return NextResponse.json({ ok: true, ...config });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro ao salvar' },
      { status: 400 },
    );
  }
}
