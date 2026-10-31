export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import { ocorrenciaByIdWhere } from '@/lib/ocorrencias-validation';
import { destaqueBodySchema } from '@/lib/ocorrencias-ata-validation';
import { fotosDoDestaque, ocorrenciaFotoPaths } from '@/lib/ocorrencias-foto';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = destaqueBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const existing = await prisma.ocorrencia.findFirst({
    where: ocorrenciaByIdWhere(ctx.userId, id),
    select: { id: true, fotoPath: true, fotoPaths: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Ocorrência não encontrada' }, { status: 404 });
  }

  const todas = ocorrenciaFotoPaths(existing.fotoPath, existing.fotoPaths);
  let destaqueFotoPaths: string[] = [];

  if (parsed.data.destaqueAta) {
    if (todas.length > 1) {
      const pedidas = parsed.data.destaqueFotoPaths ?? [];
      if (pedidas.length === 0) {
        return NextResponse.json(
          { error: 'Escolha ao menos uma foto para o destaque.' },
          { status: 400 },
        );
      }
      const escolhidas = fotosDoDestaque(todas, pedidas);
      if (escolhidas.length === 0) {
        return NextResponse.json(
          { error: 'As fotos escolhidas não pertencem a esta ocorrência.' },
          { status: 400 },
        );
      }
      destaqueFotoPaths = escolhidas;
    } else {
      destaqueFotoPaths = todas;
    }
  }

  const updated = await prisma.ocorrencia.update({
    where: { id: existing.id },
    data: {
      destaqueAta: parsed.data.destaqueAta,
      destaqueFotoPaths,
      destaqueAtaPorId: ctx.stackUserId,
      destaqueAtaEm: new Date(),
    },
    select: {
      id: true,
      destaqueAta: true,
      destaqueFotoPaths: true,
      destaqueAtaEm: true,
    },
  });

  return NextResponse.json({ ok: true, ocorrencia: updated });
}
