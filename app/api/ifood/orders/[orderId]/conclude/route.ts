export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrderDetails, verifyDeliveryCode } from '@/lib/ifood-api';
import { resolveOrderAction } from '@/lib/ifood-order-action';

/**
 * Conclui o pedido no iFood via POST /orders/{id}/verifyDeliveryCode
 * (não existe endpoint /conclude — a validação do código dispara CONCLUDED).
 *
 * Código usado (nesta ordem):
 * 1. body.code (override manual)
 * 2. customer.phone.localizer (entrega própria)
 * 3. delivery.pickupCode / pickupCode (retirada)
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

    let code = bodyCode;
    if (!code) {
      const { data: details } = await getOrderDetails(orderId);
      code =
        details.customer?.phone?.localizer?.trim() ||
        details.delivery?.pickupCode?.trim() ||
        details.pickupCode?.trim() ||
        undefined;
    }

    if (!code) {
      return NextResponse.json(
        {
          error:
            'Código de confirmação não encontrado. Informe o localizer (entrega própria) ou o código de retirada.',
        },
        { status: 400 },
      );
    }

    const { data } = await verifyDeliveryCode(orderId, code);
    if (data.valid === false) {
      return NextResponse.json(
        { error: 'Código de confirmação inválido.' },
        { status: 400 },
      );
    }

    await db.ifoodOrder.update({
      where: { orderId },
      data: { status: 'CONCLUDED' },
    });

    return NextResponse.json({ success: true, status: 'CONCLUDED' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    console.error('[POST ifood conclude]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
