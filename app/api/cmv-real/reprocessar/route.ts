export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSessionDbUser } from '@/lib/rh-api-auth';
import { reprocessarNotasEmRevisao } from '@/lib/nfe/reprocessar';

/**
 * POST /api/cmv-real/reprocessar
 * Roda o pipeline de novo nas notas EM_REVISAO / ERRO_PROCESSAMENTO
 * (útil após importar o catálogo CMV Real).
 */
export async function POST() {
  const user = await getSessionDbUser();
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  try {
    const result = await reprocessarNotasEmRevisao(user.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[cmv-real/reprocessar]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao reprocessar' },
      { status: 500 },
    );
  }
}
