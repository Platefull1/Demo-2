export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { syncRefeicoesSaipos } from '@/lib/cmv-real/sync-refeicoes';
import { SaiposDataApiError } from '@/lib/saipos/dataApi';

/**
 * POST /api/cmv-real/refeicoes/sync?loja=&competencia=
 * (também aceita storeSlug=)
 */
export async function POST(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const storeSlug = sp.get('loja') || sp.get('storeSlug');
  const competencia = sp.get('competencia');

  if (!storeSlug || !competencia) {
    return NextResponse.json(
      { error: 'loja (ou storeSlug) e competencia obrigatórios' },
      { status: 400 }
    );
  }

  if (!/^\d{4}-\d{2}$/.test(competencia)) {
    return NextResponse.json(
      { error: 'competencia deve ser YYYY-MM' },
      { status: 400 }
    );
  }

  const { tenant, error } = await requireCmvRealAccess(
    P.CMV_REAL_FECHAMENTO,
    storeSlug
  );
  if (error) return error;

  try {
    const result = await syncRefeicoesSaipos({
      tenantUserId: tenant.tenantUserId,
      storeSlug,
      competencia,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    if (e instanceof SaiposDataApiError) {
      return NextResponse.json(
        { error: e.message, status: e.status },
        { status: e.status && e.status >= 400 && e.status < 600 ? e.status : 502 }
      );
    }
    const msg = e instanceof Error ? e.message : 'Falha no sync';
    const closed = /fechada/i.test(msg);
    return NextResponse.json(
      { error: msg },
      { status: closed ? 400 : 500 }
    );
  }
}
