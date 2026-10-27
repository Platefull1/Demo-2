export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import { isLojaEscritorio } from '@/lib/ocorrencias-lojas';

/**
 * GET /api/ocorrencias/opcoes?lojaId=...
 *
 * Lojas ativas da empresa e motoboys ativos.
 * REGISTRAR ou VER.
 */
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireOcorrenciasContext('ANY');
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const lojaId = searchParams.get('lojaId');

  const lojas = await prisma.rhLoja.findMany({
    where: { userId: ctx.userId, ativo: true },
    select: { id: true, nome: true },
    orderBy: { nome: 'asc' },
  });

  const lojasFiltradas = lojas.filter((l) => !isLojaEscritorio(l.nome));

  const riderWhere: {
    userId: string;
    status: string;
    lojaId?: string;
  } = {
    userId: ctx.userId,
    status: 'active',
  };

  if (lojaId) {
    const lojaValida = lojasFiltradas.some((l) => l.id === lojaId);
    if (!lojaValida) {
      return NextResponse.json({ lojas: lojasFiltradas, motoboys: [] });
    }
    riderWhere.lojaId = lojaId;
  }

  const riders = await prisma.deliveryRider.findMany({
    where: riderWhere,
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({
    lojas: lojasFiltradas,
    motoboys: riders.map((r) => ({ id: r.id, nome: r.name })),
  });
}
