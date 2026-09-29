export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireServiceApiKey } from '@/lib/auth/service-api-key';
import { ingestNfeSync, type IngestSyncPayload } from '@/lib/nfe/ingest';

/**
 * POST /api/nfe/ingest
 *
 * Recebe a resposta de POST /nfe/sync do saipos-scraper.
 * Auth: header x-api-key (ServiceApiKey) — mesmo padrão de /api/reports/due.
 */
export async function POST(req: NextRequest) {
  const auth = await requireServiceApiKey(req);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

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
    const result = await ingestNfeSync(userId, body);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[api/nfe/ingest]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro no ingest.' },
      { status: 500 },
    );
  }
}
