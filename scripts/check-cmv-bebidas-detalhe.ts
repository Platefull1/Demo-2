/**
 * Detalhe dos lançamentos COMPRA_NFE de BEBIDA em Ahú/outubro para
 * descobrir se os lançamentos das 5 notas devolvidas foram realmente removidos.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const OWNER_USER_ID = 'cmk5ykusf0001jz04iwmf8xa8';
const COMPETENCIA = '2026-10';
const LOJA = 'ahu';
// IDs das 5 notas devolvidas (campo `id` do NfeNota, obtido pelo script anterior)
const NUMEROS_DEVOLVIDOS = ['9636376', '9636377', '740826', '740827', '740828'];

function fmtMoney(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function main() {
  console.log('\n=== Lançamentos COMPRA_NFE de BEBIDA — Ahú outubro ===\n');

  // Busca IDs das notas devolvidas
  const notasDevolvidas = await prisma.nfeNota.findMany({
    where: { userId: OWNER_USER_ID, numero: { in: NUMEROS_DEVOLVIDOS } },
    select: { id: true, numero: true, status: true },
  });
  const idsDevolvidas = new Set(notasDevolvidas.map((n) => n.id));
  console.log(`Notas devolvidas encontradas: ${notasDevolvidas.map((n) => `${n.numero}(${n.status})`).join(', ')}\n`);

  // Configs BEBIDA
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER_USER_ID, secao: 'BEBIDA', ativo: true },
    include: { estoqueInsumo: { select: { nome: true } } },
  });
  const ids = configs.map((c) => c.estoqueInsumoId);
  const nomeById = new Map(configs.map((c) => [c.estoqueInsumoId, c.estoqueInsumo.nome]));

  // TODOS os lançamentos COMPRA_NFE de BEBIDA em outubro
  const lancamentos = await prisma.cmvLancamento.findMany({
    where: {
      userId: OWNER_USER_ID,
      storeSlug: LOJA,
      competencia: COMPETENCIA,
      estoqueInsumoId: { in: ids },
      tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
    },
    include: {
      nfeItem: { select: { notaId: true } },
    },
    orderBy: { data: 'asc' },
  });

  let totalGeral = 0;
  let totalDevolvidos = 0;
  let totalRestantes = 0;
  let countSemNfeItem = 0;

  for (const l of lancamentos) {
    const notaId = l.nfeItem?.notaId ?? null;
    const ehDevolvida = notaId != null && idsDevolvidas.has(notaId);
    totalGeral += Number(l.valorTotal);
    if (ehDevolvida) totalDevolvidos += Number(l.valorTotal);
    else totalRestantes += Number(l.valorTotal);
    if (!notaId) countSemNfeItem++;
  }

  console.log(`Total lançamentos COMPRA: ${lancamentos.length}`);
  console.log(`  Sem nfeItem linkado: ${countSemNfeItem}`);
  console.log(`  De notas DEVOLVIDAS: ${lancamentos.filter((l) => l.nfeItem?.notaId && idsDevolvidas.has(l.nfeItem.notaId)).length}  →  ${fmtMoney(totalDevolvidos)}`);
  console.log(`  De outras notas:     ${lancamentos.filter((l) => !l.nfeItem?.notaId || !idsDevolvidas.has(l.nfeItem.notaId)).length}  →  ${fmtMoney(totalRestantes)}`);
  console.log(`  TOTAL valor:         ${fmtMoney(totalGeral)}`);

  // Estimativa de CMV rápida (fórmula simples: comprasValor = CMV sem estoque ini)
  const saldoIni = await prisma.cmvSaldoEstoque.findMany({
    where: { userId: OWNER_USER_ID, storeSlug: LOJA, competencia: '2026-09', estoqueInsumoId: { in: ids } },
    select: { estoqueInsumoId: true, qtdFinal: true, custoMedio: true },
  });
  const iniValorTotal = saldoIni.reduce(
    (s, x) => s + Number(x.qtdFinal) * Number(x.custoMedio ?? 0), 0,
  );
  console.log(`\n  Valor estoque inicial set/26 (BEBIDA): ${fmtMoney(iniValorTotal)}`);
  console.log(`  CMV estimado (ini + compras, sem estoque final): ${fmtMoney(iniValorTotal + totalGeral)}`);

  console.log('\n  → Se lançamentos das 5 notas devolvidas ainda existem, CMV inclui o valor delas.');
  console.log('    Se = R$ 0, ignorar_nota removeu corretamente os lançamentos.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
