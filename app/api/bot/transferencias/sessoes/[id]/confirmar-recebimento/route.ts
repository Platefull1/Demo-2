export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireBotAuth } from '@/lib/bot-auth';
import { confirmarRecebimento } from '@/transferencias/sessoes';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireBotAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const body = (await req.json()) as {
    gerenteId?: string;
    quantidadesRecebidas?: Record<string, number>;
    actorUserId?: string;
  };
  if (!body.gerenteId) {
    return NextResponse.json({ error: 'gerenteId obrigatório' }, { status: 400 });
  }

  try {
    const sessao = await confirmarRecebimento({
      sessaoId: id,
      gerenteId: body.gerenteId,
      quantidadesRecebidas: body.quantidadesRecebidas,
      actorUserId: body.actorUserId,
    });
    return NextResponse.json({ ok: true, sessao });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Falha' },
      { status: 400 },
    );
  }
}
