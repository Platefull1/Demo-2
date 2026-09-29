export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getRhContext } from '@/lib/rh-auth';
import { getCmvRealTenantFromSession } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';

/**
 * GET /api/cmv-real/access
 * Sessão: se o usuário pode ver o módulo CMV Real (menu / gate).
 * Não usa UserToolPermission — só cmv_real.visualizar (ou dono).
 */
export async function GET() {
  const ctx = await getRhContext();
  if (!ctx) {
    return NextResponse.json({ ok: false, canView: false }, { status: 401 });
  }

  const canView = ctx.isAdmin || ctx.hasPermission(P.CMV_REAL_VISUALIZAR);
  if (!canView) {
    return NextResponse.json({
      ok: true,
      canView: false,
      isAdmin: ctx.isAdmin,
    });
  }

  const tenant = await getCmvRealTenantFromSession();
  return NextResponse.json({
    ok: true,
    canView: true,
    isAdmin: ctx.isAdmin,
    tenantUserId: tenant?.tenantUserId ?? ctx.userId,
    allowedStoreSlugs: tenant?.allowedStoreSlugs ?? null,
    lojaNaoConfigurada: tenant?.lojaNaoConfigurada ?? false,
    perfil: tenant?.perfil ?? null,
  });
}
