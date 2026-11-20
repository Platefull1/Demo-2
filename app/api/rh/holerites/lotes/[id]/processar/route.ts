import { NextRequest, NextResponse } from 'next/server';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { processarLoteHolerites } from '@/lib/holerites/process-batch';
import { maskCpf } from '@/lib/holerites/mask';
import { SystemTool } from '@/types/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/rh/holerites/lotes/[id]/processar
 */
export async function POST(_req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(P.PAYSLIPS_UPLOAD, SystemTool.HOLERITES);
  if (error) return error;

  const { id: batchId } = await params;

  const rl = await checkRateLimit({
    key: `holerites:processar:${ctx.userId}`,
    limit: 30,
    windowSeconds: 3600,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em breve.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
    );
  }

  const exists = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId: ctx.userId },
    select: { id: true },
  });
  if (!exists) {
    return NextResponse.json({ error: 'Lote não encontrado' }, { status: 404 });
  }

  try {
    const result = await processarLoteHolerites({
      batchId,
      userId: ctx.userId,
    });
    return NextResponse.json({
      ok: true,
      draftsCreated: result.draftsCreated,
      unmatchedCount: result.unmatchedPages.length,
      elapsedMs: result.elapsedMs,
      allPagesSemTexto: result.allPagesSemTexto,
    });
  } catch (err) {
    const status = (err as { status?: number })?.status;
    if (status === 404) {
      return NextResponse.json({ error: 'Lote não encontrado' }, { status: 404 });
    }
    if (status === 409) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 409 },
      );
    }

    const masked = String(err instanceof Error ? err.message : err).replace(
      /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g,
      (m) => maskCpf(m),
    );
    console.error('[holerites/processar]', masked);

    if (status === 400) {
      await prisma.payslipBatch
        .update({
          where: { id: batchId },
          data: {
            status: 'PROCESSING',
            errorMessage: masked.slice(0, 500),
          },
        })
        .catch(() => undefined);
      return NextResponse.json({ error: masked }, { status: 400 });
    }

    await prisma.payslipBatch
      .update({
        where: { id: batchId },
        data: {
          status: 'PROCESSING',
          errorMessage: 'Falha no processamento. Tente reprocessar.',
        },
      })
      .catch(() => undefined);

    return NextResponse.json(
      { error: 'Falha no processamento. Tente novamente.' },
      { status: 500 },
    );
  }
}
