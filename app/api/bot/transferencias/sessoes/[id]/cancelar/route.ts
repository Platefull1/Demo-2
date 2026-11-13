export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireBotAuth } from '@/lib/bot-auth';
import { cancelar } from '@/transferencias/sessoes';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireBotAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    actorGerenteId?: string;
  };

  try {
    const sessao = await cancelar({
      sessaoId: id,
      actorGerenteId: body.actorGerenteId,
      forcar: true,
    });
    return NextResponse.json({ ok: true, sessao });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Falha' },
      { status: 400 },
    );
  }
}
