export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import {
  ataOcorrenciaExtFromPath,
  ataOcorrenciaFilename,
  ataOcorrenciaSiblingPath,
  createAtaOcorrenciaSignedUrl,
  type AtaArquivoExt,
} from '@/lib/ocorrencias-ata-storage';
import { lojaSlugAta } from '@/lib/ocorrencias-ata-data';
import { ESCOPO_REDE } from '@/lib/ocorrencias-ata-data';

const TTL = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  const { id } = await params;
  const ata = await prisma.ocorrenciaAta.findFirst({
    where: { id, companyId: ctx.userId },
  });
  if (!ata) {
    return NextResponse.json({ error: 'Ata não encontrada' }, { status: 404 });
  }

  const storedExt = ataOcorrenciaExtFromPath(ata.filePath);
  const requested = request.nextUrl.searchParams.get('formato');
  const ext: AtaArquivoExt =
    requested === 'docx' || requested === 'pdf' ? requested : storedExt;
  const filePath =
    storedExt === ext ? ata.filePath : ataOcorrenciaSiblingPath(ata.filePath, ext);

  const url = await createAtaOcorrenciaSignedUrl(filePath, TTL);
  if (!url) {
    return NextResponse.json(
      { error: 'Não foi possível assinar a ata. Confira o bucket atas-ocorrencias.' },
      { status: 502 },
    );
  }

  let slug = 'rede';
  if (ata.escopo !== ESCOPO_REDE) {
    const loja = await prisma.rhLoja.findFirst({
      where: { id: ata.escopo, userId: ctx.userId },
      select: { nome: true },
    });
    slug = loja ? lojaSlugAta(loja.nome) : 'loja';
  }

  return NextResponse.json({
    url,
    expiresIn: TTL,
    filename: ataOcorrenciaFilename(slug, ata.ano, ata.mes, ext),
  });
}
