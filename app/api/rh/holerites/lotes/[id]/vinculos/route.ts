import { NextRequest, NextResponse } from 'next/server';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { vinculosBodySchema } from '@/lib/holerites/api-schemas';
import {
  anexarPaginasAnterior,
  desvincularDraft,
  ignorarPaginas,
  trocarFuncionarioDraft,
  vincularPaginas,
} from '@/lib/holerites/vinculos';
import { prisma } from '@/lib/prisma';
import { SystemTool } from '@/types/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

/**
 * PATCH /api/rh/holerites/lotes/[id]/vinculos
 */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(P.PAYSLIPS_UPLOAD, SystemTool.HOLERITES);
  if (error) return error;

  const { id: batchId } = await params;

  const exists = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId: ctx.userId },
    select: { id: true },
  });
  if (!exists) {
    return NextResponse.json({ error: 'Lote não encontrado' }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const parsed = vinculosBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const body = parsed.data;
    if (body.action === 'vincular') {
      const payslip = await vincularPaginas({
        batchId,
        userId: ctx.userId,
        sourcePath: body.sourcePath,
        pageIndexes: body.pageIndexes,
        funcionarioId: body.funcionarioId,
      });
      return NextResponse.json({ ok: true, payslipId: payslip.id });
    }
    if (body.action === 'trocar') {
      const payslip = await trocarFuncionarioDraft({
        batchId,
        userId: ctx.userId,
        payslipId: body.payslipId,
        funcionarioId: body.funcionarioId,
      });
      return NextResponse.json({ ok: true, payslipId: payslip.id });
    }
    if (body.action === 'desvincular') {
      await desvincularDraft({
        batchId,
        userId: ctx.userId,
        payslipId: body.payslipId,
      });
      return NextResponse.json({ ok: true });
    }
    if (body.action === 'anexar_anterior') {
      const result = await anexarPaginasAnterior({
        batchId,
        userId: ctx.userId,
        sourcePath: body.sourcePath,
        pageIndexes: body.pageIndexes,
      });
      return NextResponse.json({ ok: true, ...result });
    }
    await ignorarPaginas({
      batchId,
      userId: ctx.userId,
      sourcePath: body.sourcePath,
      pageIndexes: body.pageIndexes,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = (err as { status?: number })?.status ?? 500;
    if (status === 404) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    }
    if (status === 409 || status === 400) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Erro' },
        { status },
      );
    }
    console.error('[holerites/vinculos]', err);
    return NextResponse.json({ error: 'Falha ao atualizar vínculos' }, { status: 500 });
  }
}
