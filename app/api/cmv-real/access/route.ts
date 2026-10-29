export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getRhContext } from '@/lib/rh-auth';
import { getCmvRealTenantFromSession } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { canAccessTool } from '@/lib/auth/toolPermissions';
import { SystemTool } from '@/types/admin';

/**
 * GET /api/cmv-real/access
 * Camada 1: tool CMV_REAL. Camada 2: cmv_real.visualizar (ou dono) + loja.
 */
export async function GET() {
  const ctx = await getRhContext();
  if (!ctx) {
    return NextResponse.json({ ok: false, canView: false }, { status: 401 });
  }

  if (!(await canAccessTool(ctx.stackUserId, SystemTool.CMV_REAL))) {
    return NextResponse.json({
      ok: true,
      canView: false,
      isAdmin: ctx.isAdmin,
    });
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
