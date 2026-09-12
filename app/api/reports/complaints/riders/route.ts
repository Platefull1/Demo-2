export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getReportsTenantUserIds } from '@/lib/reports-tenant-auth';

/**
 * GET /api/reports/complaints/riders?lojaId=<id>
 *
 * Lista DeliveryRiders ativos de uma loja específica.
 * Usado pelo dropdown de entregador na revisão de reclamações.
 */
export async function GET(req: NextRequest) {
  const userIds = await getReportsTenantUserIds();
  if (!userIds) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const lojaId = req.nextUrl.searchParams.get('lojaId');
  if (!lojaId) {
    return NextResponse.json({ error: 'lojaId é obrigatório.' }, { status: 400 });
  }

  // Verifica que a loja pertence ao tenant
  const loja = await prisma.rhLoja.findFirst({
    where: { id: lojaId, userId: { in: userIds } },
    select: { id: true },
  });

  if (!loja) {
    return NextResponse.json({ error: 'Loja não encontrada.' }, { status: 404 });
  }

  const riders = await prisma.deliveryRider.findMany({
    where: { lojaId, status: { not: 'inactive' } },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(riders);
}
