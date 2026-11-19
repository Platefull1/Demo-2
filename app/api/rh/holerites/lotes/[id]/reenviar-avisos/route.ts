import { NextRequest, NextResponse } from 'next/server';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { reenviarAvisosLote } from '@/lib/holerites/publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/rh/holerites/lotes/[id]/reenviar-avisos
 */
export async function POST(_req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_PUBLISH,
    SystemTool.HOLERITES,
  );
  if (error) return error;

  const { id: batchId } = await params;

  const exists = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId: ctx.userId },
    select: { id: true },
  });
  if (!exists) {
    return NextResponse.json({ error: 'Lote não encontrado' }, { status: 404 });
  }

  const rl = await checkRateLimit({
    key: `notify:batch:${batchId}`,
    limit: 1,
    windowSeconds: 5 * 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Aguarde 5 minutos para reenviar.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
    );
  }

  try {
    const result = await reenviarAvisosLote({
      batchId,
      userId: ctx.userId,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const status = (err as { status?: number })?.status ?? 500;
    if (status === 404 || status === 409 || status === 502) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Erro' },
        { status },
      );
    }
    console.error('[holerites/reenviar-avisos]', err);
    return NextResponse.json({ error: 'Falha ao reenviar' }, { status: 500 });
  }
}
