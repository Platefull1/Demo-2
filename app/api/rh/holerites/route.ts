import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { temContatoValido } from '@/lib/holerites/publish';
import {
  PAGE_SIZE,
  buildRhKpis,
  competenciaMesAnterior,
  statusesForFilter,
} from '@/lib/holerites/rh-panel';
import type { PayslipType } from '@/lib/shared/holerites/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parsePage(raw: string | null): number {
  const n = Number(raw ?? '1');
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(Math.floor(n), 500);
}

export async function GET(req: NextRequest) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_VIEW,
    SystemTool.HOLERITES,
  );
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  let competencia = sp.get('competencia')?.trim() || '';
  const type = sp.get('type')?.trim() || '';
  const lojaId = sp.get('lojaId')?.trim() || '';
  const statusFilter = sp.get('status')?.trim() || '';
  const funcionarioId = sp.get('funcionarioId')?.trim() || '';
  const page = parsePage(sp.get('page'));

  if (!funcionarioId && !competencia) {
    const latest = await prisma.payslipBatch.findFirst({
      where: { userId: ctx.userId, status: 'PUBLISHED' },
      orderBy: { competencia: 'desc' },
      select: { competencia: true },
    });
    competencia = latest?.competencia ?? competenciaMesAnterior();
  }

  const baseWhere = {
    userId: ctx.userId,
    ...(funcionarioId ? { funcionarioId } : { competencia }),
    ...(type ? { type: type as PayslipType } : {}),
    ...(lojaId ? { lojaId } : {}),
  };

  const listStatuses = statusesForFilter(statusFilter || null);

  const [kpiGroups, total, items, batches] = await Promise.all([
    prisma.payslip.groupBy({
      by: ['status'],
      where: {
        ...baseWhere,
        status: { in: ['PUBLISHED', 'VIEWED', 'ACKNOWLEDGED', 'REVOKED'] },
      },
      _count: { _all: true },
    }),
    prisma.payslip.count({
      where: { ...baseWhere, status: { in: listStatuses } },
    }),
    prisma.payslip.findMany({
      where: { ...baseWhere, status: { in: listStatuses } },
      orderBy: [
        { funcionario: { nome: 'asc' } },
        { publishedAt: 'desc' },
      ],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        competencia: true,
        type: true,
        status: true,
        replacesId: true,
        publishedAt: true,
        firstViewedAt: true,
        acknowledgedAt: true,
        loja: { select: { id: true, nome: true } },
        funcionario: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            whatsappLid: true,
          },
        },
      },
    }),
    prisma.payslipBatch.findMany({
      where: {
        userId: ctx.userId,
        competencia,
        ...(type ? { type: type as PayslipType } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        type: true,
        status: true,
        createdBy: true,
        createdAt: true,
        publishedAt: true,
        notifyStatus: true,
        updatedAt: true,
      },
    }),
  ]);

  const countMap: Record<string, number> = {};
  for (const g of kpiGroups) {
    countMap[g.status] = g._count._all;
  }
  const publicados =
    (countMap.PUBLISHED ?? 0) +
    (countMap.VIEWED ?? 0) +
    (countMap.ACKNOWLEDGED ?? 0);
  const abertos = (countMap.VIEWED ?? 0) + (countMap.ACKNOWLEDGED ?? 0);
  const confirmados = countMap.ACKNOWLEDGED ?? 0;
  const pendentes = (countMap.PUBLISHED ?? 0) + (countMap.VIEWED ?? 0);

  const kpis = buildRhKpis({
    publicados,
    abertos,
    confirmados,
    pendentes,
  });

  const now = Date.now();
  const tenMin = 10 * 60 * 1000;

  return NextResponse.json({
    competencia,
    page,
    pageSize: PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    kpis,
    items: items.map((p) => ({
      id: p.id,
      competencia: p.competencia,
      type: p.type,
      status: p.status,
      isRetificacao: Boolean(p.replacesId),
      publishedAt: p.publishedAt?.toISOString() ?? null,
      firstViewedAt: p.firstViewedAt?.toISOString() ?? null,
      acknowledgedAt: p.acknowledgedAt?.toISOString() ?? null,
      loja: p.loja,
      funcionario: {
        id: p.funcionario.id,
        nome: p.funcionario.nome,
        temWhatsapp: temContatoValido(p.funcionario),
      },
    })),
    batches: batches.map((b) => ({
      id: b.id,
      type: b.type,
      status: b.status,
      createdBy: b.createdBy,
      createdAt: b.createdAt.toISOString(),
      publishedAt: b.publishedAt?.toISOString() ?? null,
      notifyStatus: b.notifyStatus,
      travado:
        b.status === 'PROCESSING' &&
        now - b.updatedAt.getTime() > tenMin,
    })),
  });
}
