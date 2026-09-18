export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const resolved = await resolveOrderAction(orderId);
    if (resolved.ok === false) return resolved.response;

    const { data } = await getCancellationReasons(orderId);
    return NextResponse.json({ reasons: normalizeReasons(data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    console.error('[GET orders/cancellation-reasons]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
