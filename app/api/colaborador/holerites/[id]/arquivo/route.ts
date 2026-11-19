import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEmployeeSession } from '@/lib/employee-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/holerites/otp';
import { downloadPayslipObject } from '@/lib/holerites/storage';
import {
  PORTAL_VISIBLE_STATUSES,
  applySessionCookie,
  payslipDownloadFilename,
} from '@/lib/holerites/portal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const session = await getEmployeeSession(req);
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const rl = await checkRateLimit({
    key: `payslip:file:${session.funcionarioId}`,
    limit: 60,
    windowSeconds: 10 * 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente mais tarde.', retryAfterSeconds: rl.retryAfterSeconds },
      { status: 429 },
    );
  }

  const { id } = await ctx.params;
  const download = req.nextUrl.searchParams.get('download') === '1';

  const payslip = await prisma.payslip.findFirst({
    where: {
      id,
      funcionarioId: session.funcionarioId,
      status: { in: [...PORTAL_VISIBLE_STATUSES] },
    },
    select: {
      id: true,
      competencia: true,
      type: true,
      status: true,
      storagePath: true,
      fileSha256: true,
      firstViewedAt: true,
    },
  });

  if (!payslip) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  let bytes: Buffer;
  try {
    bytes = await downloadPayslipObject(payslip.storagePath);
  } catch (err) {
    console.error('[colaborador/arquivo] download falhou', payslip.id, err);
    return NextResponse.json({ error: 'arquivo_indisponivel' }, { status: 500 });
  }

  const sha = createHash('sha256').update(bytes).digest('hex');
  if (sha !== payslip.fileSha256) {
    console.warn(
      `[ALERTA INTEGRIDADE] payslip=${payslip.id} sha esperado=${payslip.fileSha256} obtido=${sha}`,
    );
    return NextResponse.json({ error: 'integridade' }, { status: 500 });
  }

  const now = new Date();
  const ip = clientIp(req);
  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;
  const action = download ? 'download' : 'view';

  await prisma.$transaction([
    prisma.payslipAccessLog.create({
      data: {
        payslipId: payslip.id,
        actorType: 'employee',
        actorId: session.funcionarioId,
        action,
        ip,
        userAgent,
      },
    }),
    // Condicional: só PUBLISHED → VIEWED (nunca regride ACKNOWLEDGED)
    prisma.payslip.updateMany({
      where: {
        id: payslip.id,
        funcionarioId: session.funcionarioId,
        status: 'PUBLISHED',
      },
      data: {
        status: 'VIEWED',
        firstViewedAt: now,
      },
    }),
  ]);

  // Se já VIEWED mas firstViewedAt null (edge), preenche sem mudar status
  if (!payslip.firstViewedAt && payslip.status === 'VIEWED') {
    await prisma.payslip.updateMany({
      where: {
        id: payslip.id,
        funcionarioId: session.funcionarioId,
        firstViewedAt: null,
        status: 'VIEWED',
      },
      data: { firstViewedAt: now },
    });
  }

  const filename = payslipDownloadFilename(payslip.competencia, payslip.type);
  const res = new NextResponse(new Uint8Array(bytes), {
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
  applySessionCookie(res, session);
  return res;
}
