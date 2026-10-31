export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import {
  createOcorrenciaFotoSignedUrl,
  createOcorrenciaFotoSignedUrls,
} from '@/lib/ocorrencias-storage';
import { ocorrenciaFotoPaths } from '@/lib/ocorrencias-foto';
import { ocorrenciaByIdWhere } from '@/lib/ocorrencias-validation';

/**
 * GET /api/ocorrencias/:id/foto
 *
 * Retorna URLs assinadas de 1h para as fotos da ocorrência.
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
    select: { fotoPath: true, fotoPaths: true },
  });

  if (!ocorrencia) {
    return NextResponse.json({ error: 'Ocorrência não encontrada' }, { status: 404 });
  }

  const paths = ocorrenciaFotoPaths(ocorrencia.fotoPath, ocorrencia.fotoPaths);
  if (paths.length === 0) {
    return NextResponse.json({ error: 'Ocorrência sem foto' }, { status: 404 });
  }

  const urlMap = await createOcorrenciaFotoSignedUrls(paths);
  const urls = paths.map((p) => urlMap[p]).filter((u): u is string => Boolean(u));
  const url = urls[0] || (await createOcorrenciaFotoSignedUrl(paths[0]));
  if (!url) {
    return NextResponse.json(
      { error: 'Não foi possível gerar URL da foto' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { url, urls: urls.length > 0 ? urls : [url], paths },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
