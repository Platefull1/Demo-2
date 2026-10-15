import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();
const TID = 'cmk5ykusf0001jz04iwmf8xa8';
const n = (v) => (v == null ? 0 : Number(v));

async function main() {
  const configs = await p.cmvRealInsumoConfig.findMany({
    where: { userId: TID, ativo: true },
    select: { estoqueInsumoId: true, secao: true },
  });
  const inCfg = new Set(configs.map((c) => c.estoqueInsumoId));

  const saldos = await p.cmvSaldoEstoque.findMany({
    where: { userId: TID, competencia: '2026-09' },
    select: {
      estoqueInsumoId: true,
      storeSlug: true,
      qtdFinal: true,
    },
  });

  const lancs = await p.cmvLancamento.findMany({
    where: {
      userId: TID,
      competencia: { in: ['2026-09', '2026-10'] },
      tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
    },
    select: {
      estoqueInsumoId: true,
      storeSlug: true,
      valorTotal: true,
      quantidade: true,
    },
  });

  const orphanIds = new Set();
  for (const s of saldos) {
    if (!inCfg.has(s.estoqueInsumoId)) orphanIds.add(s.estoqueInsumoId);
  }
  for (const l of lancs) {
    if (!inCfg.has(l.estoqueInsumoId)) orphanIds.add(l.estoqueInsumoId);
  }

  const insumos = await p.estoqueInsumo.findMany({
    where: { id: { in: [...orphanIds] } },
    select: { id: true, nome: true, unidade: true, categoriaId: true },
  });
  const byId = Object.fromEntries(insumos.map((i) => [i.id, i]));

  // Guess section from name / categoria for display
  function guessSecao(ins) {
    const nome = (ins?.nome || '').toUpperCase();
    const cat = (ins?.categoriaId || '').toLowerCase();
    if (
      /EMBALAGEM|MESINHA|SEPARADOR|CAIXA|SACOLA|POTE|COPO|TAMPA/i.test(nome) ||
      cat.includes('embalag')
    ) {
      return 'EMBALAGEM';
    }
    if (
      /COCA|PEPSI|GUARAN|SUCO|AGUA|REFRIG|CERVEJ|HEINEKEN|SPATEN|BEBIDA/i.test(
        nome
      ) ||
      cat.includes('bebid')
    ) {
      return 'BEBIDA';
    }
    return 'MATERIA_PRIMA';
  }

  const rows = [];
  for (const id of orphanIds) {
    const ins = byId[id];
    const saldosI = saldos.filter((s) => s.estoqueInsumoId === id);
    const lancsI = lancs.filter((l) => l.estoqueInsumoId === id);
    const lojas = [...new Set(saldosI.map((s) => s.storeSlug))];
    const qtdSaldo = {};
    for (const s of saldosI) qtdSaldo[s.storeSlug] = n(s.qtdFinal);
    const compras = lancsI.reduce((a, l) => a + n(l.valorTotal), 0);
    rows.push({
      id,
      nome: ins?.nome || id,
      unidade: ins?.unidade || '?',
      secaoGuess: guessSecao(ins),
      lojas,
      qtdSaldo,
      compras,
    });
  }

  rows.sort((a, b) => {
    if (a.secaoGuess !== b.secaoGuess)
      return a.secaoGuess.localeCompare(b.secaoGuess);
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });

  const bySecao = {};
  for (const r of rows) {
    bySecao[r.secaoGuess] = bySecao[r.secaoGuess] || [];
    bySecao[r.secaoGuess].push(r);
  }

  console.log('=== ÓRFÃOS CMV (saldo 2026-09 ou compras 2026-09/10 sem config ativo) ===');
  console.log('total', rows.length);
  for (const [secao, list] of Object.entries(bySecao)) {
    console.log(`\n## ${secao} (${list.length})`);
    for (const r of list) {
      const qtdStr = r.lojas
        .map((l) => `${l}=${r.qtdSaldo[l] ?? '—'}`)
        .join(', ');
      console.log(
        `- ${r.nome} | lojas: ${r.lojas.join(',') || '—'} | saldo: ${qtdStr || '—'} | compras R$ ${r.compras.toFixed(2)} | id=${r.id}`
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
