export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  const { id } = await params;

  const ocorrencia = await prisma.ocorrencia.findFirst({
    where: { id, userId: ctx.userId },
    select: {
      id: true,
      numeroPedidoSaipos: true,
      numeroPedidoExterno: true,
      canalExterno: true,
      categorias: true,
      descricao: true,
      criadoPorUserId: true,
      createdAt: true,
      loja: { select: { id: true, nome: true } },
      motoboy: { select: { id: true, name: true } },
    },
  });

  if (!ocorrencia) {
    return NextResponse.json({ error: 'Ocorrência não encontrada' }, { status: 404 });
  }

  const criador = await prisma.stackUser.findUnique({
    where: { id: ocorrencia.criadoPorUserId },
    select: { displayName: true, primaryEmail: true },
  });

  return NextResponse.json({
    ocorrencia: {
      ...ocorrencia,
      criadoPorNome: criador?.displayName?.trim() || criador?.primaryEmail || '—',
    },
  });
}
