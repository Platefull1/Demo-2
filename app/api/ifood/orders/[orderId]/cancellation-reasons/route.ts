export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resolveOrderAction } from '@/lib/ifood-order-action';
import { getCancellationReasons } from '@/lib/ifood-api';

type RawReason = {
  cancelCodeId?: string;
  code?: string;
  description?: string;
};

function normalizeReasons(data: unknown): Array<{ cancelCodeId: string; description: string }> {
  const list: RawReason[] = Array.isArray(data)
    ? (data as RawReason[])
    : Array.isArray((data as { reasons?: RawReason[] })?.reasons)
      ? ((data as { reasons: RawReason[] }).reasons)
      : [];

  return list
    .map((r) => ({
      cancelCodeId: String(r.cancelCodeId ?? r.code ?? ''),
      description: String(r.description ?? r.cancelCodeId ?? r.code ?? ''),
    }))
    .filter((r) => r.cancelCodeId);
}

function isAlreadyCancelled(message: string): boolean {
  return /already cancelled|já cancelad|is cancelled|CANCELLED/i.test(message);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const resolved = await resolveOrderAction(orderId);
    if (resolved.ok === false) return resolved.response;

    try {
      const { data } = await getCancellationReasons(orderId);
      return NextResponse.json({ reasons: normalizeReasons(data) });
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (isAlreadyCancelled(message)) {
        await db.ifoodOrder.update({
          where: { orderId },
          data: { status: 'CANCELLED' },
        });
        return NextResponse.json({
          reasons: [],
          alreadyCancelled: true,
          status: 'CANCELLED',
        });
      }
      throw err;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    console.error('[GET orders/cancellation-reasons]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
