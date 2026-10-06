export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireCmvRealAccess,
  resolveCmvRealStoreFilter,
} from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';

function mesBounds(ano: number, mes: number): { start: Date; end: Date } {
  const mm = String(mes).padStart(2, '0');
  const start = new Date(`${ano}-${mm}-01T00:00:00.000-03:00`);
  const nextMes = mes === 12 ? 1 : mes + 1;
  const nextAno = mes === 12 ? ano + 1 : ano;
  const nm = String(nextMes).padStart(2, '0');
  const end = new Date(`${nextAno}-${nm}-01T00:00:00.000-03:00`);
  return { start, end };
}

/** GET /api/cmv-real/notas?status=&storeSlug=&mes=&ano= */
export async function GET(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  const status = sp.get('status') || 'EM_REVISAO';
  const storeOverride = sp.get('storeSlug');
  const mesParam = Number(sp.get('mes'));
  const anoParam = Number(sp.get('ano'));

  const storeFilter = resolveCmvRealStoreFilter(
    tenant,
    storeOverride && !tenant.lojaNaoConfigurada ? storeOverride : null,
  );

  const emptyMeta = {
    ok: true,
    notas: [],
    counts: { EM_REVISAO: 0, APROVADA: 0, IGNORADA: 0 },
    allowedStoreSlugs: tenant.allowedStoreSlugs,
    lojaTravada: !tenant.isAdmin && tenant.allowedStoreSlugs != null,
    canRevisar: tenant.isAdmin,
    canMapeamentoEditar: tenant.isAdmin,
  };

  if (storeFilter !== null && storeFilter.length === 0) {
    return NextResponse.json(emptyMeta);
  }

  const baseWhere: Record<string, unknown> = {
    userId: tenant.tenantUserId,
  };
  if (storeFilter !== null) {
    baseWhere.storeSlug = { in: storeFilter };
  }
  if (
    Number.isInteger(mesParam) &&
    mesParam >= 1 &&
    mesParam <= 12 &&
    Number.isInteger(anoParam) &&
    anoParam >= 2000
  ) {
    const { start, end } = mesBounds(anoParam, mesParam);
    baseWhere.dataEntrada = { gte: start, lt: end };
  }

  const where: Record<string, unknown> = { ...baseWhere };
  if (status !== 'ALL') where.status = status;

  const [notas, grouped] = await Promise.all([
    prisma.nfeNota.findMany({
      where,
      include: {
        fornecedor: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
            ignorarCmv: true,
          },
        },
        itens: { select: { id: true, status: true } },
      },
      orderBy: { dataEntrada: 'desc' },
      take: 100,
    }),
    prisma.nfeNota.groupBy({
      by: ['status'],
      where: baseWhere,
      _count: { _all: true },
    }),
  ]);

  const counts = { EM_REVISAO: 0, APROVADA: 0, IGNORADA: 0 };
  for (const g of grouped) {
    if (g.status in counts) {
      counts[g.status as keyof typeof counts] = g._count._all;
    }
  }

  const { getRhContext } = await import('@/lib/rh-auth');
  const ctx = await getRhContext();
  const canRevisar =
    tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_REVISAR_APROVAR) ?? false);
  const canMapeamentoEditar =
    tenant.isAdmin || (ctx?.hasPermission(P.CMV_REAL_MAPEAMENTO_EDITAR) ?? false);

  return NextResponse.json({
    ok: true,
    allowedStoreSlugs: tenant.allowedStoreSlugs,
    lojaTravada: !tenant.isAdmin && tenant.allowedStoreSlugs != null,
    canRevisar,
    canMapeamentoEditar,
    counts,
    notas: notas.map((n) => {
      const itensProntos = n.itens.filter(
        (i) => i.status === 'MAPEADO' || i.status === 'IGNORADO',
      ).length;
      return {
        id: n.id,
        numero: n.numero,
        storeSlug: n.storeSlug,
        status: n.status,
        dataEntrada: n.dataEntrada,
        valorTotal: Number(n.valorTotal),
        competencia: n.competencia,
        fornecedor: n.fornecedor,
        itensTotal: n.itens.length,
        itensProntos,
        itensSugeridos: n.itens.filter((i) => i.status === 'SUGERIDO').length,
        itensSemMap: n.itens.filter((i) => i.status === 'SEM_MAPEAMENTO').length,
      };
    }),
  });
}
