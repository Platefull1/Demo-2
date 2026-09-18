export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrderDetails } from '@/lib/ifood-api';
import { resolveOrderAction } from '@/lib/ifood-order-action';

/**
 * Marca o pedido como CONCLUDED no painel.
 *
 * Em entrega própria (MERCHANT), a Order API do iFood NÃO tem endpoint /conclude
 * e verifyDeliveryCode rejeita pickupCode/localizer. O iFood conclui sozinho após
 * o dispatch (evento CONCLUDED no polling). Aqui só sincronizamos o status local
 * para o operador fechar o ciclo no kanban.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const resolved = await resolveOrderAction(orderId);
    if (resolved.ok === false) return resolved.response;

    // Confirma que o pedido ainda existe no iFood (e pega deliveredBy se útil).
    let deliveredBy: string | undefined;
    try {
      const { data: details } = await getOrderDetails(orderId);
      deliveredBy = details.delivery?.deliveredBy;
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      // Se o iFood já concluiu/cancelou, ainda assim alinhamos o DB.
      if (!/404|NOT_FOUND|cancelled|concluded/i.test(message)) {
        console.warn('[POST ifood conclude] getOrderDetails:', message);
      }
    }

    await db.ifoodOrder.update({
      where: { orderId },
      data: { status: 'CONCLUDED' },
    });

    return NextResponse.json({
      success: true,
      status: 'CONCLUDED',
      mode: deliveredBy === 'MERCHANT' || !deliveredBy ? 'local_sync' : 'local_sync',
      note:
        'Em entrega própria o iFood conclui automaticamente; o painel foi atualizado para Concluídos.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    console.error('[POST ifood conclude]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
