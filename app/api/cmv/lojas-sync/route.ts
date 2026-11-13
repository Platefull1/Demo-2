export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireServiceApiKey } from '@/lib/auth/service-api-key';
import { listarLojasSyncDoTenant } from '@/lib/cmv-real/sync-vendas-auto';

/**
 * GET /api/cmv/lojas-sync
 *
 * Lista lojas do tenant da ServiceApiKey para o n8n iterar no sync automático.
 * Auth: header x-api-key (ServiceApiKey).
 */
export async function GET(req: NextRequest) {
  const auth = await requireServiceApiKey(req);
  if (auth instanceof NextResponse) return auth;

  const lojas = await listarLojasSyncDoTenant(auth.userId);
  return NextResponse.json({ ok: true, lojas });
}
