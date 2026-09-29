export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireCmvRealTenantFromSession } from '@/lib/nfe/tenant';
import { reprocessarNotasEmRevisao } from '@/lib/nfe/reprocessar';

/**
 * POST /api/cmv-real/reprocessar
 * Notas e catálogo no tenant dono.
 */
export async function POST() {
  const tenant = await requireCmvRealTenantFromSession();
  if (tenant instanceof NextResponse) return tenant;

  try {
    const result = await reprocessarNotasEmRevisao(tenant.tenantUserId);
    return NextResponse.json({
      ok: true,
      ...result,
      defaultStoreSlug: tenant.defaultStoreSlug,
      lojaVinculo: tenant.lojaVinculo,
    });
  } catch (err) {
    console.error('[cmv-real/reprocessar]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao reprocessar' },
      { status: 500 },
    );
  }
}
