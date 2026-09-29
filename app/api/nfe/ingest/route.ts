export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireServiceApiKey } from '@/lib/auth/service-api-key';
import { ingestNfeSync, type IngestSyncPayload } from '@/lib/nfe/ingest';
import { getCmvRealTenantFromUserId } from '@/lib/nfe/tenant';

/**
 * POST /api/nfe/ingest
 *
 * Auth: x-api-key (ServiceApiKey) — key continua na calenzano.ahu.
 * Gravação: tenantUserId do dono do grupo (resolvido a partir do userId da key).
 */
export async function POST(req: NextRequest) {
  const auth = await requireServiceApiKey(req);
  if (auth instanceof NextResponse) return auth;
  const { userId: apiKeyUserId } = auth;

  let body: IngestSyncPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON inválido.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !body.porLoja) {
    return NextResponse.json(
      { error: 'Body deve ser a resposta do /nfe/sync (campo porLoja).' },
      { status: 400 },
    );
  }

  try {
    const tenant = await getCmvRealTenantFromUserId(apiKeyUserId);
    const result = await ingestNfeSync(apiKeyUserId, body);
    return NextResponse.json({
      ok: true,
      tenantUserId: tenant?.tenantUserId ?? null,
      actorUserId: apiKeyUserId,
      ...result,
    });
  } catch (err) {
    console.error('[api/nfe/ingest]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro no ingest.' },
      { status: 500 },
    );
  }
}
