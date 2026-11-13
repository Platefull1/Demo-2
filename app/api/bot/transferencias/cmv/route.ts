export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireBotAuth } from '@/lib/bot-auth';
import {
  registrarTransferenciaCompleta,
  registrarTransferenciaDivergenteWhatsapp,
} from '@/lib/nfe/transferencia-documento';

/**
 * POST /api/bot/transferencias/cmv
 * Body: { acao: 'completa'|'divergente', userId, actorUserId, lojaOrigem, lojaDestino, data?, observacao?, itens|itensSaida/itensEntrada }
 */
export async function POST(req: NextRequest) {
  const authError = requireBotAuth(req);
  if (authError) return authError;

  const body = (await req.json()) as {
    acao?: string;
    userId?: string;
    actorUserId?: string;
    lojaOrigem?: string;
    lojaDestino?: string;
    data?: string;
    observacao?: string | null;
    itens?: Array<{
      estoqueInsumoId: string;
      quantidade: number;
      custoUnitario?: number | null;
    }>;
    itensSaida?: Array<{
      estoqueInsumoId: string;
      quantidade: number;
      custoUnitario?: number | null;
    }>;
    itensEntrada?: Array<{
      estoqueInsumoId: string;
      quantidade: number;
      custoUnitario?: number | null;
    }>;
  };

  if (!body.userId || !body.lojaOrigem || !body.lojaDestino) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
  }

  const data = body.data ? new Date(body.data) : new Date();
  const actorUserId = body.actorUserId || body.userId;

  try {
    if (body.acao === 'completa') {
      if (!body.itens?.length) {
        return NextResponse.json({ error: 'itens obrigatórios' }, { status: 400 });
      }
      const doc = await registrarTransferenciaCompleta({
        userId: body.userId,
        actorUserId,
        lojaOrigem: body.lojaOrigem,
        lojaDestino: body.lojaDestino,
        data,
        observacao: body.observacao,
        origem: 'WHATSAPP',
        itens: body.itens,
      });
      return NextResponse.json({ ok: true, transferencia: doc });
    }

    if (body.acao === 'divergente') {
      if (!body.itensSaida?.length || !body.itensEntrada?.length) {
        return NextResponse.json(
          { error: 'itensSaida e itensEntrada obrigatórios' },
          { status: 400 },
        );
      }
      const doc = await registrarTransferenciaDivergenteWhatsapp({
        userId: body.userId,
        actorUserId,
        lojaOrigem: body.lojaOrigem,
        lojaDestino: body.lojaDestino,
        data,
        observacao: body.observacao,
        itensSaida: body.itensSaida,
        itensEntrada: body.itensEntrada,
      });
      return NextResponse.json({ ok: true, transferencia: doc });
    }

    return NextResponse.json({ error: 'acao inválida' }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Falha' },
      { status: 400 },
    );
  }
}
