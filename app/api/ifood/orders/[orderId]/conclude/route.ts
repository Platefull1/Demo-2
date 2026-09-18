export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrderDetails, verifyDeliveryCode } from '@/lib/ifood-api';
import { resolveOrderAction } from '@/lib/ifood-order-action';

const SANDBOX_FALLBACK_CODES = ['9999'];

async function tryVerify(orderId: string, code: string): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const { data } = await verifyDeliveryCode(orderId, code);
    if (data.valid === false) {
      return { ok: false, message: 'Código de confirmação inválido.' };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao validar código';
    return { ok: false, message };
  }
}

/**
 * Conclui o pedido no iFood via POST /orders/{id}/verifyDeliveryCode.
 *
 * Importante: o localizer do 0800 NÃO é o código de confirmação — a API
 * responde "Confirmation code is invalid". Use delivery.pickupCode ou o
 * código informado pelo cliente/entregador.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const resolved = await resolveOrderAction(orderId);
    if (resolved.ok === false) return resolved.response;

    let bodyCode: string | undefined;
    try {
      const body = (await req.json()) as { code?: string };
      bodyCode = body.code?.trim() || undefined;
    } catch {
      // body opcional
    }

    const dbOrder = await db.ifoodOrder.findUnique({ where: { orderId } });
    const { data: details } = await getOrderDetails(orderId);
    const pickupCode =
      details.delivery?.pickupCode?.trim() ||
      details.pickupCode?.trim() ||
      undefined;

    // Candidatos: código do formulário → pickupCode (nunca localizer).
    const candidates = [
      bodyCode,
      pickupCode,
      ...(dbOrder?.isTest ? SANDBOX_FALLBACK_CODES : []),
    ].filter((c, i, arr): c is string => Boolean(c) && arr.indexOf(c) === i);

    if (candidates.length === 0) {
      return NextResponse.json(
        {
          error:
            'Informe o código de confirmação da entrega (código de 4 dígitos do pedido).',
        },
        { status: 400 },
      );
    }

    let lastError = 'Código de confirmação inválido.';
    for (const code of candidates) {
      const result = await tryVerify(orderId, code);
      if (result.ok) {
        await db.ifoodOrder.update({
          where: { orderId },
          data: { status: 'CONCLUDED' },
        });
        return NextResponse.json({ success: true, status: 'CONCLUDED', codeUsed: code });
      }
      lastError = result.message;
      // Se o código foi aceito pela API mas inválido, tenta o próximo candidato.
      if (!/invalid|InvalidParameter|400/i.test(result.message) && candidates.length === 1) {
        return NextResponse.json({ error: result.message }, { status: 502 });
      }
    }

    return NextResponse.json(
      {
        error:
          'Código de confirmação inválido. Use o código de entrega do pedido (não o localizer 0800).',
        detail: lastError,
        hint: { pickupCode: pickupCode ?? null },
      },
      { status: 400 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    console.error('[POST ifood conclude]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
