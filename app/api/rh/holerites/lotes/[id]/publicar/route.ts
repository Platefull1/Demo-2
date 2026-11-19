import { NextRequest, NextResponse, after } from 'next/server';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { prisma } from '@/lib/prisma';
import {
  afterPublicarLote,
  publicarLoteHolerites,
} from '@/lib/holerites/publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/rh/holerites/lotes/[id]/publicar
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

  try {
    const result = await publicarLoteHolerites({
      batchId,
      userId: ctx.userId,
      actorId: ctx.stackUserId,
    });

    after(async () => {
      try {
        await afterPublicarLote({ batchId, userId: ctx.userId });
      } catch (err) {
        console.error('[holerites/publicar] after', err);
      }
    });

    return NextResponse.json({
      published: result.published,
      revoked: result.revoked,
      notified: result.notified,
      semContato: result.semContato,
    });
  } catch (err) {
    const status = (err as { status?: number })?.status ?? 500;
    if (status === 404 || status === 409) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Erro' },
        { status },
      );
    }
    console.error('[holerites/publicar]', err);
    return NextResponse.json({ error: 'Falha ao publicar' }, { status: 500 });
  }
}
