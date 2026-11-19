import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import {
  createPayslipSignedReadUrl,
  downloadPayslipObject,
} from '@/lib/holerites/storage';
import { extrairPaginasPdf } from '@/lib/holerites/pdf-split';
import type { PayslipSourceFile } from '@/lib/holerites/types-ingest';
import { SystemTool } from '@/types/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/rh/holerites/lotes/[id]/preview?payslipId= | ?sourcePath=&pages=
 */
export async function GET(req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(P.PAYSLIPS_UPLOAD, SystemTool.HOLERITES);
  if (error) return error;

  const { id: batchId } = await params;
  const sp = req.nextUrl.searchParams;
  const payslipId = sp.get('payslipId');
  const sourcePath = sp.get('sourcePath');
  const pagesRaw = sp.get('pages');

  const batch = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId: ctx.userId },
    select: { id: true, sourceFiles: true },
  });
  if (!batch) {
    return NextResponse.json({ error: 'Lote não encontrado' }, { status: 404 });
  }

  if (payslipId) {
    const payslip = await prisma.payslip.findFirst({
      where: { id: payslipId, batchId, userId: ctx.userId },
      select: { id: true, storagePath: true },
    });
    if (!payslip) {
      return NextResponse.json({ error: 'Holerite não encontrado' }, { status: 404 });
    }

    const signedUrl = await createPayslipSignedReadUrl(payslip.storagePath, 300);

    await prisma.payslipAccessLog.create({
      data: {
        payslipId: payslip.id,
        actorType: 'rh',
        actorId: ctx.stackUserId,
        action: 'view',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: req.headers.get('user-agent'),
      },
    });

    return NextResponse.json({ signedUrl, expiresIn: 300 });
  }

  if (sourcePath && pagesRaw) {
    const files = (batch.sourceFiles ?? []) as PayslipSourceFile[];
    if (!files.some((f) => f.path === sourcePath)) {
      return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 });
    }
    if (!sourcePath.startsWith(`${ctx.userId}/_staging/${batchId}/`)) {
      return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 });
    }

    const pageIndexes = pagesRaw
      .split(',')
      .map((s) => Number.parseInt(s.trim(), 10))
      .filter((n) => Number.isInteger(n) && n >= 0);
    if (pageIndexes.length === 0) {
      return NextResponse.json({ error: 'Páginas inválidas' }, { status: 400 });
    }

    const buffer = await downloadPayslipObject(sourcePath);
    const pdfBytes = await extrairPaginasPdf(buffer, pageIndexes);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="preview.pdf"',
        'Cache-Control': 'private, no-store',
      },
    });
  }

  return NextResponse.json(
    { error: 'Informe payslipId ou sourcePath e pages' },
    { status: 400 },
  );
}
