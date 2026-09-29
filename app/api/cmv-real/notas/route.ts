export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireCmvRealAccess,
  resolveCmvRealStoreFilter,
} from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';

/** GET /api/cmv-real/notas?status=&storeSlug= */
export async function GET(req: NextRequest) {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;

  const sp = req.nextUrl.searchParams;
  const status = sp.get('status') || 'EM_REVISAO';
  const storeOverride = sp.get('storeSlug');

  // Gerente: lojas travadas
  const storeFilter = resolveCmvRealStoreFilter(
    tenant,
    storeOverride && !tenant.lojaNaoConfigurada ? storeOverride : null,
  );

  const where: Record<string, unknown> = {
    userId: tenant.tenantUserId,
  };
  if (status !== 'ALL') where.status = status;
  if (storeFilter !== null) {
    if (storeFilter.length === 0) {
      return NextResponse.json({
        ok: true,
        notas: [],
        allowedStoreSlugs: tenant.allowedStoreSlugs,
        lojaTravada: !tenant.isAdmin && tenant.allowedStoreSlugs != null,
        canRevisar: tenant.isAdmin,
        canMapeamentoEditar: tenant.isAdmin,
      });
    }
    where.storeSlug = { in: storeFilter };
  }

  const notas = await prisma.nfeNota.findMany({
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
  });

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
    notas: notas.map((n) => ({
      id: n.id,
      numero: n.numero,
      storeSlug: n.storeSlug,
      status: n.status,
      dataEntrada: n.dataEntrada,
      valorTotal: Number(n.valorTotal),
      competencia: n.competencia,
      fornecedor: n.fornecedor,
      itensTotal: n.itens.length,
      itensSugeridos: n.itens.filter((i) => i.status === 'SUGERIDO').length,
      itensSemMap: n.itens.filter((i) => i.status === 'SEM_MAPEAMENTO').length,
    })),
  });
}
