import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const itens = await prisma.nfeItem.findMany({
    where: { nota: { numero: '9628373', userId: 'cmk5ykusf0001jz04iwmf8xa8' } },
    include: { nota: { select: { status: true, storeSlug: true } } },
  });
  const ids = itens.map((i) => i.estoqueInsumoId).filter((x): x is string => !!x);
  const [insumos, cfgs, lancs, docs] = await Promise.all([
    prisma.estoqueInsumo.findMany({
      where: { id: { in: ids } },
      select: { id: true, nome: true },
    }),
    prisma.cmvRealInsumoConfig.findMany({
      where: { estoqueInsumoId: { in: ids } },
      select: { estoqueInsumoId: true, secao: true },
    }),
    prisma.cmvLancamento.findMany({
      where: { nfeItem: { nota: { numero: '9628373' } } },
      select: { valorTotal: true, estoqueInsumoId: true, tipo: true },
    }),
    prisma.cmvTransferencia.findMany({
      where: { userId: 'cmk5ykusf0001jz04iwmf8xa8', excluidoEm: null },
      select: { id: true, numeroDocumento: true, status: true, competencia: true },
      take: 10,
    }),
  ]);
  const nome = new Map(insumos.map((i) => [i.id, i.nome]));
  const secao = new Map(cfgs.map((c) => [c.estoqueInsumoId, c.secao]));
  console.log('nota', itens[0]?.nota);
  console.log(
    itens.map((it) => ({
      desc: it.descricao,
      uCom: it.unidadeComercial,
      status: it.status,
      produto: it.estoqueInsumoId ? nome.get(it.estoqueInsumoId) : null,
      secao: it.estoqueInsumoId ? secao.get(it.estoqueInsumoId) : null,
      fator: it.fatorConversao != null ? Number(it.fatorConversao) : null,
      valor: it.valorLiquido != null ? Number(it.valorLiquido) : Number(it.valorBruto),
    })),
  );
  console.log(
    'lancamentos',
    lancs.length,
    lancs.reduce((s, l) => s + Number(l.valorTotal), 0),
  );
  console.log('transferencias', docs);
}

main().finally(() => prisma.$disconnect());
