export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { requireServiceApiKey } from '@/lib/auth/service-api-key';
import { runSyncVendasAuto } from '@/lib/cmv-real/sync-vendas-auto';
import { SaiposDataApiError } from '@/lib/saipos/dataApi';

/**
 * POST /api/cmv/vendas/sync-auto
 *
 * Sync automático (n8n) — uma loja por chamada.
 * Auth: header x-api-key (ServiceApiKey), igual /api/reports/due.
 *
 * Body: { lojaId: string, de?: "YYYY-MM-DD", ate?: "YYYY-MM-DD" }
 * Sem datas: dia 1 do mês → ontem (SP); dias 1–3 incluem mês anterior.
 */
export async function POST(req: NextRequest) {
  const auth = await requireServiceApiKey(req);
  if (auth instanceof NextResponse) return auth;

  let body: { lojaId?: unknown; de?: unknown; ate?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON inválido' }, { status: 400 });
  }

  const lojaId = typeof body.lojaId === 'string' ? body.lojaId.trim() : '';
  if (!lojaId) {
    return NextResponse.json(
      { error: 'lojaId obrigatório — uma chamada por loja' },
      { status: 400 },
    );
  }

  const de = typeof body.de === 'string' ? body.de.trim() : undefined;
  const ate = typeof body.ate === 'string' ? body.ate.trim() : undefined;

  try {
    const result = await runSyncVendasAuto({
      serviceUserId: auth.userId,
      lojaId,
      de,
      ate,
    });
    return NextResponse.json(result, {
      status: result.ok ? 200 : 502,
    });
  } catch (e) {
    const status =
      e && typeof e === 'object' && 'status' in e && typeof (e as { status: unknown }).status === 'number'
        ? (e as { status: number }).status
        : e instanceof SaiposDataApiError
          ? e.status && e.status >= 400 && e.status < 600
            ? e.status
            : 502
          : 500;
    const msg = e instanceof Error ? e.message : 'Falha no sync automático';
    return NextResponse.json({ error: msg }, { status });
  }
}
