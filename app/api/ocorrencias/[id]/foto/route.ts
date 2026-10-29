export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import { createOcorrenciaFotoSignedUrl } from '@/lib/ocorrencias-storage';
import { ocorrenciaByIdWhere } from '@/lib/ocorrencias-validation';

/**
 * GET /api/ocorrencias/:id/foto
 *
 * Retorna uma URL assinada de 1h para a foto da ocorrência.
 * Valida que a ocorrência pertence ao tenant do usuário autenticado.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  const { id } = await params;

  const ocorrencia = await prisma.ocorrencia.findFirst({
    where: ocorrenciaByIdWhere(ctx.userId, id),
    select: { fotoPath: true },
  });

  if (!ocorrencia) {
    return NextResponse.json({ error: 'Ocorrência não encontrada' }, { status: 404 });
  }

  if (!ocorrencia.fotoPath) {
    return NextResponse.json({ error: 'Ocorrência sem foto' }, { status: 404 });
  }

  const url = await createOcorrenciaFotoSignedUrl(ocorrencia.fotoPath);
  if (!url) {
    return NextResponse.json(
      { error: 'Não foi possível gerar URL da foto' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { url },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
