export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { ComplaintCategoria } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getReportsTenantUserIds } from '@/lib/reports-tenant-auth';

const CATEGORIAS_VALIDAS = new Set<string>(Object.values(ComplaintCategoria));

type PatchBody = {
  confirmadoPorHumano?: boolean;
  categoria?: string | null;
  lojaId?: string | null;
  lojaIdentificada?: boolean;
  entregadorId?: string | null;
};

/**
 * PATCH /api/reports/complaints/complaints/:complaintId
 *
 * Atualiza confirmação humana ("Incluir na ata") de uma reclamação.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ complaintId: string }> },
) {
  const userIds = await getReportsTenantUserIds();
  if (!userIds) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { complaintId } = await params;

  let body: PatchBody = {};
  try {
    const text = await req.text();
    if (text.trim()) body = JSON.parse(text) as PatchBody;
  } catch {
    return NextResponse.json({ error: 'Body JSON inválido.' }, { status: 400 });
  }

  const hasValidField =
    typeof body.confirmadoPorHumano === 'boolean' ||
    'categoria' in body ||
    'lojaId' in body ||
    typeof body.lojaIdentificada === 'boolean' ||
    'entregadorId' in body;

  if (!hasValidField) {
    return NextResponse.json(
      { error: 'Informe ao menos um campo válido para atualizar.' },
      { status: 400 },
    );
  }

  const existing = await prisma.complaint.findFirst({
    where: { id: complaintId, userId: { in: userIds } },
    select: { id: true, reviewRunId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Reclamação não encontrada.' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: Record<string, any> = {};
  if (typeof body.confirmadoPorHumano === 'boolean')
    updateData.confirmadoPorHumano = body.confirmadoPorHumano;
  if ('categoria' in body) {
    if (body.categoria != null && !CATEGORIAS_VALIDAS.has(body.categoria)) {
      return NextResponse.json({ error: 'Etiqueta inválida.' }, { status: 400 });
    }
    updateData.categoria = body.categoria ?? null;
  }
  if ('lojaId' in body) updateData.lojaId = body.lojaId ?? null;
  if (typeof body.lojaIdentificada === 'boolean')
    updateData.lojaIdentificada = body.lojaIdentificada;
  if ('entregadorId' in body) updateData.entregadorId = body.entregadorId ?? null;

  try {
    const updated = await prisma.complaint.update({
      where: { id: complaintId },
      data: updateData,
      select: {
        id: true,
        confirmadoPorHumano: true,
        reviewRunId: true,
        categoria: true,
        lojaId: true,
        lojaIdentificada: true,
        entregadorId: true,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[complaints] PATCH falhou', err);
    return NextResponse.json(
      { error: 'Não foi possível salvar a etiqueta.' },
      { status: 500 },
    );
  }
}
