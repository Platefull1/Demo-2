export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getEstoqueTenantContext } from '@/lib/estoque-tenant';
import { getLojasDoUsuario, singleStoreSlug } from '@/lib/store-access';

/**
 * GET /api/estoque/access
 * Escopo de loja do módulo Estoque (mesma regra do CMV Real).
 * Não exige permissão cmv_real.* — só sessão + tenant Estoque.
 */
export async function GET() {
  const ctx = await getEstoqueTenantContext();
  if (!ctx) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { store } = ctx;
  const allowedStoreSlugs = getLojasDoUsuario(store);

  return NextResponse.json({
    ok: true,
    isAdmin: store.isAdmin,
    tenantUserId: store.tenantUserId,
    allowedStoreSlugs,
    lojaTravada: allowedStoreSlugs !== null && allowedStoreSlugs.length === 1,
    lojaNaoConfigurada: store.lojaNaoConfigurada,
    singleStoreSlug: singleStoreSlug(store),
    perfil: store.perfil,
  });
}
