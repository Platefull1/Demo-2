import { prisma } from '@/lib/prisma';
import { isLojaEscritorio } from '@/lib/ocorrencias-lojas';
import { monthBoundsSP, previousMonth } from '@/lib/ocorrencias-period';
import {
  nomeEmpresaAta,
  type AtrasoInformado,
  type LojaAtaRef,
  type OcorrenciaAtaRow,
} from '@/lib/ocorrencias-ata-data';
import { ocorrenciaFotoPaths } from '@/lib/ocorrencias-foto';

export type AtaSourceMes = {
  lojas: LojaAtaRef[];
  items: OcorrenciaAtaRow[];
  atrasos: AtrasoInformado[];
  temRegistros: boolean;
};

async function loadMes(
  companyId: string,
  ano: number,
  mes: number,
): Promise<AtaSourceMes> {
  const { start, end } = monthBoundsSP(ano, mes);

  const [lojasRaw, ocorrencias, atrasosRaw] = await Promise.all([
    prisma.rhLoja.findMany({
      where: { userId: companyId, ativo: true },
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    }),
    prisma.ocorrencia.findMany({
      where: {
        userId: companyId,
        createdAt: { gte: start, lte: end },
      },
      select: {
        id: true,
        lojaId: true,
        categorias: true,
        motoboyId: true,
        destaqueAta: true,
        createdAt: true,
        numeroPedidoSaipos: true,
        numeroPedidoExterno: true,
        canalExterno: true,
        descricao: true,
        fotoPath: true,
        fotoPaths: true,
        loja: { select: { id: true, nome: true } },
        motoboy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.ocorrenciaAtrasoMensal.findMany({
      where: { companyId, ano, mes },
      select: { lojaId: true, quantidade: true },
    }),
  ]);

  const lojas = lojasRaw.filter((l) => !isLojaEscritorio(l.nome));
  const atrasoMap = new Map(atrasosRaw.map((a) => [a.lojaId, a.quantidade]));

  const items: OcorrenciaAtaRow[] = ocorrencias
    .filter((o) => lojas.some((l) => l.id === o.lojaId))
    .map((o) => ({
      id: o.id,
      lojaId: o.lojaId,
      lojaNome: o.loja.nome,
      categorias: o.categorias,
      motoboyId: o.motoboyId,
      motoboyNome: o.motoboy?.name ?? null,
      destaqueAta: o.destaqueAta,
      createdAt: o.createdAt,
      numeroPedidoSaipos: o.numeroPedidoSaipos,
      numeroPedidoExterno: o.numeroPedidoExterno,
      canalExterno: o.canalExterno,
      descricao: o.descricao,
      fotoPaths: ocorrenciaFotoPaths(o.fotoPath, o.fotoPaths),
    }));

  const atrasos: AtrasoInformado[] = lojas.map((l) => ({
    lojaId: l.id,
    quantidade: atrasoMap.has(l.id) ? (atrasoMap.get(l.id) ?? 0) : null,
  }));

  return {
    lojas,
    items,
    atrasos,
    temRegistros: items.length > 0 || atrasosRaw.length > 0,
  };
}

export async function loadAtaSource(companyId: string, ano: number, mes: number) {
  const prev = previousMonth(ano, mes);
  const [atual, anterior] = await Promise.all([
    loadMes(companyId, ano, mes),
    loadMes(companyId, prev.ano, prev.mes),
  ]);

  const empresaUser = await prisma.user.findUnique({
    where: { id: companyId },
    select: { name: true, fullName: true },
  });
  const empresa = nomeEmpresaAta(empresaUser);

  return { atual, anterior, empresa };
}
