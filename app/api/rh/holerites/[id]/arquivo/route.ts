import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { clientIp } from '@/lib/holerites/otp';
import { downloadPayslipObject } from '@/lib/holerites/storage';
import { payslipDownloadFilename } from '@/lib/holerites/portal';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_VIEW,
    SystemTool.HOLERITES,
  );
  if (error) return error;

  const rl = await checkRateLimit({
    key: `rh:file:${ctx.userId}`,
    limit: 120,
    windowSeconds: 10 * 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Limite de downloads atingido. Tente novamente em breve.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
    );
  }

  const { id } = await params;
  const download = req.nextUrl.searchParams.get('download') === '1';

  const payslip = await prisma.payslip.findFirst({
    where: { id, userId: ctx.userId },
    select: {
      id: true,
      competencia: true,
      type: true,
      storagePath: true,
      fileSha256: true,
      status: true,
    },
  });
  if (!payslip || payslip.status === 'DRAFT') {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  let bytes: Buffer;
  try {
    bytes = await downloadPayslipObject(payslip.storagePath);
  } catch (err) {
    console.error('[rh/holerites/arquivo] download', payslip.id, err);
    return NextResponse.json({ error: 'arquivo_indisponivel' }, { status: 500 });
  }

  const sha = createHash('sha256').update(bytes).digest('hex');
  if (sha !== payslip.fileSha256) {
    console.warn(
      `[ALERTA INTEGRIDADE][rh] payslip=${payslip.id} esperado=${payslip.fileSha256} obtido=${sha}`,
    );
    return NextResponse.json({ error: 'integridade' }, { status: 500 });
  }

  await prisma.payslipAccessLog.create({
    data: {
      payslipId: payslip.id,
      actorType: 'rh',
      actorId: ctx.stackUserId,
      action: download ? 'download' : 'view',
      ip: clientIp(req),
      userAgent: req.headers.get('user-agent')?.slice(0, 500) ?? null,
    },
  });

  const filename = payslipDownloadFilename(payslip.competencia, payslip.type);
  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': download
        ? `attachment; filename="${filename}"`
        : `inline; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Length': String(bytes.length),
    },
  });
}
