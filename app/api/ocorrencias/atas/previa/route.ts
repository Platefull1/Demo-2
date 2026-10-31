export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import { loadAtaSource } from '@/lib/ocorrencias-ata-source';
import {
  ESCOPO_REDE,
  ESCOPO_TODAS_LOJAS,
  buildLojaResumo,
  buildRedeResumo,
  displayLojaAta,
} from '@/lib/ocorrencias-ata-data';
import { atasMesQuerySchema } from '@/lib/ocorrencias-ata-validation';
import { monthYearLabelSP } from '@/lib/ocorrencias-period';

export async function GET(request: NextRequest) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  const parsed = atasMesQuerySchema.safeParse({
    ano: request.nextUrl.searchParams.get('ano'),
    mes: request.nextUrl.searchParams.get('mes'),
    escopo: request.nextUrl.searchParams.get('escopo') || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
  }

  const { ano, mes, escopo } = parsed.data;
  const { atual, anterior, empresa } = await loadAtaSource(ctx.userId, ano, mes);

  const rede = buildRedeResumo({
    lojas: atual.lojas,
    items: atual.items,
    atrasos: atual.atrasos,
    prevItems: anterior.temRegistros ? anterior.items : null,
    prevAtrasos: anterior.temRegistros ? anterior.atrasos : null,
    temDadosAnterior: anterior.temRegistros,
  });

  const lojas = atual.lojas.map((loja) => {
    const atraso = atual.atrasos.find((a) => a.lojaId === loja.id)?.quantidade ?? null;
    const prevAtraso = anterior.atrasos.find((a) => a.lojaId === loja.id)?.quantidade ?? null;
    const items = atual.items.filter((i) => i.lojaId === loja.id);
    const prevItems = anterior.items.filter((i) => i.lojaId === loja.id);
    return buildLojaResumo({
      loja,
      items,
      atraso,
      prevItems: anterior.temRegistros ? prevItems : null,
      prevAtraso: anterior.temRegistros ? prevAtraso : null,
      temDadosAnterior: anterior.temRegistros,
    });
  });

  let foco = null as ReturnType<typeof buildLojaResumo> | typeof rede | null;
  if (escopo && escopo !== ESCOPO_REDE && escopo !== ESCOPO_TODAS_LOJAS) {
    foco = lojas.find((l) => l.lojaId === escopo) ?? null;
    if (!foco) {
      return NextResponse.json({ error: 'Loja inválida' }, { status: 400 });
    }
  } else if (escopo === ESCOPO_REDE || !escopo) {
    foco = rede;
  }

  const destaquesComFoto = atual.items.filter(
    (i) => i.destaqueAta && i.fotoPaths.length > 0,
  ).length;

  return NextResponse.json({
    empresa,
    periodo: monthYearLabelSP(ano, mes),
    ano,
    mes,
    lojasSemAtraso: rede.lojasSemAtraso,
    destaquesCount: atual.items.filter((i) => i.destaqueAta).length,
    destaquesComFoto,
    avisoFotos:
      destaquesComFoto >= 10
        ? `Esta ata tem ${destaquesComFoto} fotos e pode demorar para gerar.`
        : null,
    lojasOpcoes: atual.lojas.map((l) => ({
      id: l.id,
      nome: displayLojaAta(l.nome),
    })),
    rede,
    lojas,
    foco,
  });
}
