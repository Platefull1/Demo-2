export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireBotAuth } from '@/lib/bot-auth';
import { confirmarOrigem } from '@/transferencias/sessoes';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireBotAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    gerenteId?: string;
    dataConfirmacao?: string;
  };
  if (!body.gerenteId) {
    return NextResponse.json({ error: 'gerenteId obrigatório' }, { status: 400 });
  }

  try {
    const sessao = await confirmarOrigem({
      sessaoId: id,
      gerenteId: body.gerenteId,
      dataConfirmacao: body.dataConfirmacao
        ? new Date(body.dataConfirmacao)
        : undefined,
    });
    return NextResponse.json({ ok: true, sessao });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Falha' },
      { status: 400 },
    );
  }
}
