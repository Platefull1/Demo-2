export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireCmvRealAccess, resolveCmvRealStoreFilter } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { listarSessoesVisiveis } from '@/transferencias/sessoes';

export async function GET(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const storeOverride = req.nextUrl.searchParams.get('storeSlug');
  const storeFilter = resolveCmvRealStoreFilter(tenant, storeOverride);
  if (storeFilter !== null && storeFilter.length === 0) {
    return NextResponse.json({ ok: true, sessoes: [] });
  }

  const sessoes = await listarSessoesVisiveis({
    tenantUserId: tenant.tenantUserId,
    storeSlugs: storeFilter,
  });

  return NextResponse.json({ ok: true, sessoes });
}
