import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { labelPayslipStatusRh, labelPayslipType } from '@/lib/shared/holerites/labels';
import { formatDateTimeSp } from '@/lib/holerites/ui-labels';
import {
  competenciaMesAnterior,
  typeSlugForExport,
} from '@/lib/holerites/rh-panel';
import type { PayslipType } from '@/lib/shared/holerites/types';
import { csvEscapeCell } from '@/lib/holerites/csv-escape';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_VIEW,
    SystemTool.HOLERITES,
  );
  if (error) return error;

  const rl = await checkRateLimit({
    key: `payslip:export:${ctx.stackUserId}`,
    limit: 10,
    windowSeconds: 60 * 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Limite de exportações por hora atingido.', retryAfterSeconds: rl.retryAfterSeconds },
      { status: 429 },
    );
  }

  const sp = req.nextUrl.searchParams;
  let competencia = sp.get('competencia')?.trim() || '';
  const type = sp.get('type')?.trim() || '';
  const lojaId = sp.get('lojaId')?.trim() || '';

  if (!competencia) {
    const latest = await prisma.payslipBatch.findFirst({
      where: { userId: ctx.userId, status: 'PUBLISHED' },
      orderBy: { competencia: 'desc' },
      select: { competencia: true },
    });
    competencia = latest?.competencia ?? competenciaMesAnterior();
  }

  console.info(
    '[holerites/export]',
    JSON.stringify({
      who: ctx.stackUserId,
      when: new Date().toISOString(),
      filters: { competencia, type: type || null, lojaId: lojaId || null },
    }),
  );

  const rows = await prisma.payslip.findMany({
    where: {
      userId: ctx.userId,
      competencia,
      ...(type ? { type: type as PayslipType } : {}),
      ...(lojaId ? { lojaId } : {}),
      status: { in: ['PUBLISHED', 'VIEWED', 'ACKNOWLEDGED', 'REVOKED'] },
    },
    orderBy: [{ funcionario: { nome: 'asc' } }, { type: 'asc' }],
    select: {
      type: true,
      competencia: true,
      status: true,
      publishedAt: true,
      firstViewedAt: true,
      acknowledgedAt: true,
      ackIp: true,
      fileSha256: true,
      replacesId: true,
      loja: { select: { nome: true } },
      funcionario: { select: { nome: true, cpf: true } },
    },
  });

  const header = [
    'Nome',
    'CPF',
    'Loja',
    'Tipo',
    'Competência',
    'Status',
    'Publicado em',
    'Visualizado em',
    'Confirmado em',
    'IP da confirmação',
    'Hash do arquivo (sha256)',
    'Retificação (Sim/Não)',
  ].join(';');

  const lines = rows.map((r) =>
    [
      csvEscapeCell(r.funcionario.nome),
      csvEscapeCell(r.funcionario.cpf ?? ''),
      csvEscapeCell(r.loja.nome),
      csvEscapeCell(labelPayslipType(r.type)),
      csvEscapeCell(r.competencia),
      csvEscapeCell(labelPayslipStatusRh(r.status)),
      csvEscapeCell(r.publishedAt ? formatDateTimeSp(r.publishedAt) : ''),
      csvEscapeCell(r.firstViewedAt ? formatDateTimeSp(r.firstViewedAt) : ''),
      csvEscapeCell(r.acknowledgedAt ? formatDateTimeSp(r.acknowledgedAt) : ''),
      csvEscapeCell(r.ackIp ?? ''),
      csvEscapeCell(r.fileSha256),
      csvEscapeCell(r.replacesId ? 'Sim' : 'Não'),
    ].join(';'),
  );

  const bom = '\uFEFF';
  const body = bom + [header, ...lines].join('\r\n') + '\r\n';
  const typePart = type
    ? typeSlugForExport(type as PayslipType)
    : 'todos';
  const filename = `holerites-${competencia}-${typePart}-confirmacoes.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
