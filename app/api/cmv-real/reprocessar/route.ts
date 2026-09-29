export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { reprocessarNotasEmRevisao } from '@/lib/nfe/reprocessar';
import { P } from '@/lib/rh-permissions';

/**
 * POST /api/cmv-real/reprocessar
 * Exige cmv_real.config; notas no tenant dono.
 */
export async function POST() {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_CONFIG);
  if (error) return error;

  try {
    const result = await reprocessarNotasEmRevisao(tenant.tenantUserId);
    return NextResponse.json({
      ok: true,
      ...result,
      allowedStoreSlugs: tenant.allowedStoreSlugs,
    });
  } catch (err) {
    console.error('[cmv-real/reprocessar]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao reprocessar' },
      { status: 500 },
    );
  }
}
