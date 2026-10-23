/**
 * Diagnóstico somente leitura — CMV Bebidas Ahú outubro/2026
 *
 * Objetivo: fechar a conta entre as 14 notas FEMSA/AMBEV (R$ 37.880,11)
 * e o card CMV Bebidas (R$ 48.269,16) → gap de R$ 10.389,05.
 *
 * Etapas:
 *  1. Para cada nota, compara valorTotal da nota vs soma dos lançamentos gerados
 *  2. Lista lançamentos BEBIDA de outubro que NÃO vêm dessas 14 notas
 *  3. Verifica lançamentos duplicados ou órfãos (nfeItemId sem nota aprovada)
 *  4. Verifica conversões de unidade suspeitas
 *  5. Reconstrói o consumo (fórmula do fechamento) e fecha em R$ 48.269,16
 *
 * Uso: npx tsx scripts/diag-cmv-bebidas-ahu-outubro.ts
 */

import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const OWNER     = 'cmk5ykusf0001jz04iwmf8xa8';
const STORE     = 'ahu';
const COMP      = '2026-10';
const COMP_ANT  = '2026-09';
const CARD_CMV  = 48_269.16;   // valor exibido no card CMV Bebidas
const TOTAL_NOTAS_FOCO = 37_880.11; // soma das 14 notas aprovadas

// IDs Saipos das 14 notas aprovadas identificadas no diagnóstico anterior
const SAIPOS_IDS_FOCO = new Set([
  8095976, 8149085, 8148963, 8177067, 8246539, 8246577,
  8249880, 8249911, 8252384, 8256744, 8282084, 8282050,
  8297528, 8297611,
]);

const prisma = new PrismaClient();

function fmt(v: number, decimais = 2): string {
  const s = Math.abs(v).toFixed(decimais);
  const parts = s.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const r = `R$ ${parts.join(',')}`;
  return v < 0 ? `-${r}` : r;
}

function n(v: unknown): number {
  if (v == null) return 0;
  return typeof v === 'number' ? v : Number(v);
}

function sep(titulo: string) {
  console.log('\n' + '═'.repeat(70));
  console.log(` ${titulo}`);
  console.log('═'.repeat(70));
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log(' DIAGNÓSTICO CMV BEBIDAS — AHÚ — OUTUBRO/2026');
  console.log(' Modo: SOMENTE LEITURA');
  console.log('════════════════════════════════════════════════════════════════════');

  // ─────────────────────────────────────────────────────────────────────────
  // 0. Insumos da seção BEBIDA configurados para o tenant
  // ─────────────────────────────────────────────────────────────────────────
  const configsBebida = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER, secao: 'BEBIDA', ativo: true },
    include: { estoqueInsumo: { select: { nome: true } } },
  });
  const bebidaIds = new Set(configsBebida.map((c) => c.estoqueInsumoId));
  console.log(`\n[0] Insumos configurados como BEBIDA: ${configsBebida.length}`);
  for (const c of configsBebida) {
    console.log(`     ${c.estoqueInsumoId.slice(-8)} ${c.estoqueInsumo.nome} [${c.unidade}]`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Notas foco + lançamentos gerados por cada uma
  // ─────────────────────────────────────────────────────────────────────────
  sep('1. Notas FEMSA/AMBEV vs lançamentos CMV gerados');

  const notasFoco = await prisma.nfeNota.findMany({
    where: {
      userId: OWNER,
      storeSlug: STORE,
      saiposNotaId: { in: [...SAIPOS_IDS_FOCO] },
    },
    include: {
      fornecedor: { select: { nomeFantasia: true, razaoSocial: true } },
      itens: {
        where: { status: 'MAPEADO' },
        select: {
          id: true, descricao: true, quantidade: true, valorLiquido: true,
          fatorConversao: true, quantidadeConvertida: true, unidadeConvertida: true,
          estoqueInsumoId: true, valorBruto: true,
        },
      },
    },
    orderBy: { dataEntrada: 'asc' },
  });

  // Lançamentos ligados às notas foco (via nfeItemId)
  const nfeItemIdsDasFoco = notasFoco.flatMap((nota) => nota.itens.map((i) => i.id));
  const lancsFoco = await prisma.cmvLancamento.findMany({
    where: {
      userId: OWNER,
      nfeItemId: { in: nfeItemIdsDasFoco },
    },
  });
  const lancsByNfeItem = new Map<string, (typeof lancsFoco)[number]>();
  for (const l of lancsFoco) {
    if (l.nfeItemId) lancsByNfeItem.set(l.nfeItemId, l);
  }

  let totalNotasFoco = 0;
  let totalLancsFocoBebida = 0;
  let totalLancsFocoOutrasSecoes = 0;
  let notasSemLancs = 0;

  console.log(
    `\n${'Número'.padEnd(10)} ${'Data'.padEnd(12)} ${'Valor Nota'.padStart(12)}  ${'Lancs Bebida'.padStart(13)} ${'Lancs Outros'.padStart(13)}  ${'Delta'.padStart(10)}  Status`,
  );
  console.log('─'.repeat(90));

  for (const nota of notasFoco) {
    const nomeForn = (nota.fornecedor.nomeFantasia || nota.fornecedor.razaoSocial).slice(0, 20);
    const valNota = n(nota.valorTotal);
    totalNotasFoco += valNota;

    const lancsNota = nota.itens
      .map((i) => lancsByNfeItem.get(i.id))
      .filter((l): l is NonNullable<typeof l> => l != null);

    const lancsBeb = lancsNota.filter((l) => bebidaIds.has(l.estoqueInsumoId));
    const lancsOther = lancsNota.filter((l) => !bebidaIds.has(l.estoqueInsumoId));

    const sumBeb = lancsBeb.reduce((a, l) => a + n(l.valorTotal), 0);
    const sumOther = lancsOther.reduce((a, l) => a + n(l.valorTotal), 0);
    totalLancsFocoBebida += sumBeb;
    totalLancsFocoOutrasSecoes += sumOther;

    if (lancsNota.length === 0) notasSemLancs++;

    const delta = sumBeb + sumOther - valNota;
    const deltaTag = Math.abs(delta) > 0.05 ? ` ← DELTA ${fmt(delta)}` : '';

    console.log(
      `${nota.numero.padEnd(10)} ${nota.dataEntrada.toISOString().slice(0, 10)}  ${fmt(valNota).padStart(12)}  ${fmt(sumBeb).padStart(13)} ${fmt(sumOther).padStart(13)}  ${fmt(sumBeb + sumOther).padStart(10)}${deltaTag}`,
    );

    // Detalhar itens com problemas de conversão
    for (const item of nota.itens) {
      const lanc = lancsByNfeItem.get(item.id);
      const vLiq = n(item.valorLiquido);
      const qtdConv = n(item.quantidadeConvertida);
      const qtdOrig = n(item.quantidade);
      const fator = n(item.fatorConversao);
      const valLanc = lanc ? n(lanc.valorTotal) : null;

      // Divergência: lancamento != valorLiquido do item
      const divLanc = valLanc != null && Math.abs(valLanc - vLiq) > 0.05;
      // Conversão suspeita: qtdConv não bate com qtdOrig * fator
      const qtdEsperada = qtdOrig * fator;
      const divConv = fator > 0 && Math.abs(qtdConv - qtdEsperada) > 0.01;

      if (divLanc || divConv || !lanc) {
        const isBeb = bebidaIds.has(item.estoqueInsumoId ?? '');
        console.log(
          `  ⚠️  Item: ${item.descricao.slice(0, 40)} | Bruto=${fmt(n(item.valorBruto))} Liq=${fmt(vLiq)} | qtdOrig=${qtdOrig} fator=${fator} qtdConv=${qtdConv} (esperado=${qtdEsperada.toFixed(4)}) | [${isBeb ? 'BEBIDA' : 'OUTRO'}]${!lanc ? ' SEM LANÇAMENTO' : ''}${divLanc ? ` lancamento=${fmt(valLanc!)}` : ''}`,
        );
      }
    }
  }

  console.log('─'.repeat(90));
  console.log(
    `${'TOTAL NOTAS'.padEnd(24)} ${fmt(totalNotasFoco).padStart(12)}  ${fmt(totalLancsFocoBebida).padStart(13)} ${fmt(totalLancsFocoOutrasSecoes).padStart(13)}  ${fmt(totalLancsFocoBebida + totalLancsFocoOutrasSecoes).padStart(10)}`,
  );
  if (notasSemLancs > 0) {
    console.log(`\n  ⚠️  ${notasSemLancs} nota(s) sem nenhum lançamento CMV vinculado`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Todos os lançamentos BEBIDA de outubro — origem de cada um
  // ─────────────────────────────────────────────────────────────────────────
  sep('2. Todos os lançamentos BEBIDA de outubro/2026 no Ahú');

  const todosLancsBebidaOut = await prisma.cmvLancamento.findMany({
    where: {
      userId: OWNER,
      storeSlug: STORE,
      competencia: COMP,
      estoqueInsumoId: { in: [...bebidaIds] },
    },
    include: {
      nfeItem: {
        select: {
          descricao: true,
          notaId: true,
          nota: {
            select: {
              numero: true, saiposNotaId: true, status: true,
              competencia: true, storeSlug: true,
              fornecedor: { select: { nomeFantasia: true, razaoSocial: true } },
            },
          },
        },
      },
    },
    orderBy: [{ tipo: 'asc' }, { data: 'asc' }],
  });

  const nomeInsumo = new Map(configsBebida.map((c) => [c.estoqueInsumoId, c.estoqueInsumo.nome]));

  // Agrupar por origem
  const grupoDasFoco: typeof todosLancsBebidaOut = [];
  const grupoOutrasNotas: typeof todosLancsBebidaOut = [];
  const grupoTransf: typeof todosLancsBebidaOut = [];
  const grupoManual: typeof todosLancsBebidaOut = [];
  const grupoOrfaos: typeof todosLancsBebidaOut = [];   // nfeItemId mas nota não aprovada

  for (const l of todosLancsBebidaOut) {
    if (l.tipo === 'COMPRA_NFE' || l.tipo === 'COMPRA_MANUAL') {
      if (l.nfeItemId) {
        const nota = l.nfeItem?.nota;
        if (nota && SAIPOS_IDS_FOCO.has(nota.saiposNotaId)) {
          grupoDasFoco.push(l);
        } else if (nota && nota.status !== 'APROVADA') {
          grupoOrfaos.push(l);   // nota não aprovada mas tem lançamento
        } else {
          grupoOutrasNotas.push(l);
        }
      } else {
        grupoManual.push(l);
      }
    } else if (l.tipo === 'TRANSFERENCIA_ENTRADA' || l.tipo === 'TRANSFERENCIA_SAIDA') {
      grupoTransf.push(l);
    } else {
      grupoManual.push(l);
    }
  }

  const printGrupo = (titulo: string, items: typeof todosLancsBebidaOut) => {
    if (items.length === 0) {
      console.log(`\n  ${titulo}: nenhum`);
      return 0;
    }
    const total = items.reduce((a, l) => a + n(l.valorTotal), 0);
    console.log(`\n  ${titulo}: ${items.length} lançamentos | Total: ${fmt(total)}`);
    for (const l of items) {
      const insNome = nomeInsumo.get(l.estoqueInsumoId)?.slice(0, 30) ?? l.estoqueInsumoId.slice(-8);
      const dataStr = l.data.toISOString().slice(0, 10);
      const nota = l.nfeItem?.nota;
      const origem = nota
        ? `NF ${nota.numero} [${nota.status}] loja=${nota.storeSlug} comp=${nota.competencia}`
        : l.lojaOrigem
        ? `Transf de ${l.lojaOrigem}`
        : `Manual`;
      console.log(
        `    ${dataStr} | ${l.tipo.padEnd(22)} | ${insNome.padEnd(30)} | qtd=${n(l.quantidade).toFixed(3)} ${l.unidade} | ${fmt(n(l.valorTotal))} | ${origem}`,
      );
    }
    return total;
  };

  const totalFoco    = printGrupo('Das 14 notas FEMSA/AMBEV',      grupoDasFoco);
  const totalOutras  = printGrupo('De OUTRAS notas aprovadas',      grupoOutrasNotas);
  const totalTransf  = printGrupo('Transferências entrada',         grupoTransf.filter((l) => l.tipo === 'TRANSFERENCIA_ENTRADA'));
  const totalTransfS = printGrupo('Transferências saída',           grupoTransf.filter((l) => l.tipo === 'TRANSFERENCIA_SAIDA'));
  const totalManual  = printGrupo('Manuais / desperdício',          grupoManual);
  const totalOrfaos  = printGrupo('⚠️  ÓRFÃOS (nota não aprovada)', grupoOrfaos);

  const totalLancs = todosLancsBebidaOut.reduce((a, l) => a + n(l.valorTotal), 0);
  console.log(`\n  ──────────────────────────────────────────────`);
  console.log(`  TOTAL geral lançamentos BEBIDA outubro: ${fmt(totalLancs)}`);

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Duplicados (mesmo nfeItemId em mais de um lançamento)
  // ─────────────────────────────────────────────────────────────────────────
  sep('3. Verificação de lançamentos duplicados / órfãos');

  const todosLancsBebida = await prisma.cmvLancamento.findMany({
    where: {
      userId: OWNER,
      storeSlug: STORE,
      estoqueInsumoId: { in: [...bebidaIds] },
    },
    select: { id: true, nfeItemId: true, valorTotal: true, competencia: true, data: true, tipo: true },
  });

  const byNfeItem = new Map<string, typeof todosLancsBebida>();
  for (const l of todosLancsBebida) {
    if (!l.nfeItemId) continue;
    const lst = byNfeItem.get(l.nfeItemId) ?? [];
    lst.push(l);
    byNfeItem.set(l.nfeItemId, lst);
  }

  const duplicados = [...byNfeItem.entries()].filter(([, ls]) => ls.length > 1);
  if (duplicados.length === 0) {
    console.log('\n  ✅ Nenhum nfeItemId com mais de um lançamento (sem duplicatas).');
  } else {
    console.log(`\n  🔴 ${duplicados.length} nfeItemId(s) com múltiplos lançamentos:`);
    for (const [itemId, ls] of duplicados) {
      const total = ls.reduce((a, l) => a + n(l.valorTotal), 0);
      console.log(`     nfeItemId: ${itemId}  |  ${ls.length} lançamentos  |  soma: ${fmt(total)}`);
      for (const l of ls) {
        console.log(`       id=${l.id} comp=${l.competencia} tipo=${l.tipo} val=${fmt(n(l.valorTotal))}`);
      }
    }
  }

  // Órfãos: lançamento COMPRA_NFE com nfeItemId cujo item tem nota em status ≠ APROVADA
  const lancsComItem = await prisma.cmvLancamento.findMany({
    where: {
      userId: OWNER,
      storeSlug: STORE,
      estoqueInsumoId: { in: [...bebidaIds] },
      nfeItemId: { not: null },
      tipo: { in: ['COMPRA_NFE'] },
    },
    select: {
      id: true, valorTotal: true, competencia: true,
      nfeItemId: true,
      nfeItem: {
        select: {
          descricao: true,
          nota: { select: { numero: true, status: true, storeSlug: true, competencia: true } },
        },
      },
    },
  });

  const orfaos = lancsComItem.filter(
    (l) => l.nfeItem?.nota && l.nfeItem.nota.status !== 'APROVADA',
  );
  if (orfaos.length === 0) {
    console.log('  ✅ Nenhum lançamento COMPRA_NFE vinculado a nota não aprovada.');
  } else {
    console.log(`\n  🔴 ${orfaos.length} lançamento(s) BEBIDA com nota em status ≠ APROVADA:`);
    for (const l of orfaos) {
      const nota = l.nfeItem!.nota!;
      console.log(
        `     val=${fmt(n(l.valorTotal))} comp=${l.competencia} | NF ${nota.numero} status=${nota.status} loja=${nota.storeSlug} comp_nota=${nota.competencia}`,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Conversões suspeitas em TODOS os itens mapeados de bebida dessas notas
  // ─────────────────────────────────────────────────────────────────────────
  sep('4. Conversões de unidade suspeitas (itens BEBIDA das notas foco)');

  const itensMapeadosBebida = await prisma.nfeItem.findMany({
    where: {
      nota: {
        userId: OWNER,
        storeSlug: STORE,
        saiposNotaId: { in: [...SAIPOS_IDS_FOCO] },
      },
      estoqueInsumoId: { in: [...bebidaIds] },
      status: 'MAPEADO',
    },
    include: {
      nota: { select: { numero: true, dataEntrada: true, saiposNotaId: true } },
    },
  });

  let convSusp = 0;
  const header = `${'NF'.padEnd(10)} ${'Descricao'.padEnd(35)} ${'QtdOrig'.padStart(8)} ${'Und'.padEnd(6)} ${'Fator'.padStart(8)} ${'QtdConv'.padStart(10)} ${'Esperado'.padStart(10)} ${'Delta%'.padStart(8)} ${'VlrBruto'.padStart(10)} ${'VlrLiq'.padStart(10)}`;
  console.log('\n' + header);
  console.log('─'.repeat(header.length));

  for (const item of itensMapeadosBebida) {
    const qtdOrig = n(item.quantidade);
    const fator   = n(item.fatorConversao);
    const qtdConv = n(item.quantidadeConvertida);
    const qtdEsp  = qtdOrig * fator;
    const delta   = fator > 0 ? ((qtdConv - qtdEsp) / qtdEsp) * 100 : 0;
    const vBruto  = n(item.valorBruto);
    const vLiq    = n(item.valorLiquido);
    const suspeito = Math.abs(delta) > 1 || Math.abs(vLiq - vBruto) / (vBruto || 1) > 0.5;

    if (suspeito) {
      convSusp++;
      console.log(
        `${item.nota.numero.padEnd(10)} ${item.descricao.slice(0, 35).padEnd(35)} ${qtdOrig.toFixed(3).padStart(8)} ${(item.unidadeComercial || '').padEnd(6)} ${fator.toFixed(4).padStart(8)} ${qtdConv.toFixed(4).padStart(10)} ${qtdEsp.toFixed(4).padStart(10)} ${delta.toFixed(1).padStart(7)}% ${fmt(vBruto).padStart(10)} ${fmt(vLiq).padStart(10)} ← SUSPEITO`,
      );
    }
  }
  if (convSusp === 0) {
    console.log('  ✅ Nenhuma conversão suspeita nos itens BEBIDA das 14 notas.');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Reconstrução do consumo CMV (fórmula do fechamento) — fechar em 48.269,16
  // ─────────────────────────────────────────────────────────────────────────
  sep('5. Reconstrução do consumo BEBIDA (fórmula fechamento)');

  // Saldos iniciais (setembro/2026) e finais (outubro/2026)
  const [saldosIni, saldosFim] = await Promise.all([
    prisma.cmvSaldoEstoque.findMany({
      where: { userId: OWNER, storeSlug: STORE, competencia: COMP_ANT,
               estoqueInsumoId: { in: [...bebidaIds] } },
    }),
    prisma.cmvSaldoEstoque.findMany({
      where: { userId: OWNER, storeSlug: STORE, competencia: COMP,
               estoqueInsumoId: { in: [...bebidaIds] } },
    }),
  ]);

  const iniMap = new Map(saldosIni.map((s) => [s.estoqueInsumoId, s]));
  const fimMap = new Map(saldosFim.map((s) => [s.estoqueInsumoId, s]));

  // Lançamentos de outubro por insumo
  const lancsByInsumo = new Map<string, (typeof todosLancsBebidaOut)[number][]>();
  for (const l of todosLancsBebidaOut) {
    const lst = lancsByInsumo.get(l.estoqueInsumoId) ?? [];
    lst.push(l);
    lancsByInsumo.set(l.estoqueInsumoId, lst);
  }

  console.log(
    `\n${'Insumo'.padEnd(32)} ${'EsqIni'.padStart(8)} ${'CstIni'.padStart(9)} ${'Compras'.padStart(10)} ${'TrfE'.padStart(8)} ${'TrfS'.padStart(8)} ${'EsqFim'.padStart(8)} ${'CstFim'.padStart(9)} ${'CnsQtd'.padStart(9)} ${'CstMed'.padStart(9)} ${'CnsVal'.padStart(11)}`,
  );
  console.log('─'.repeat(140));

  let totalConsumoBebidas = 0;

  for (const cfg of configsBebida) {
    const id      = cfg.estoqueInsumoId;
    const nome    = cfg.estoqueInsumo.nome.slice(0, 31);
    const ini     = iniMap.get(id);
    const fim     = fimMap.get(id);
    const lancs   = lancsByInsumo.get(id) ?? [];

    const esqIni  = n(ini?.qtdFinal);
    const cstIni  = ini?.custoMedio != null ? n(ini.custoMedio) : 0;
    const esqFim  = n(fim?.qtdFinal);
    const cstFim  = fim?.custoMedio != null ? n(fim.custoMedio) : null;

    let comprasQtd = 0, comprasVal = 0;
    let trfEntQtd  = 0, trfEntVal  = 0;
    let trfSaiQtd  = 0, trfSaiVal  = 0;

    for (const l of lancs) {
      if (l.tipo === 'COMPRA_NFE' || l.tipo === 'COMPRA_MANUAL') {
        comprasQtd += n(l.quantidade); comprasVal += n(l.valorTotal);
      } else if (l.tipo === 'TRANSFERENCIA_ENTRADA') {
        trfEntQtd += n(l.quantidade); trfEntVal += n(l.valorTotal);
      } else if (l.tipo === 'TRANSFERENCIA_SAIDA') {
        trfSaiQtd += n(l.quantidade); trfSaiVal += n(l.valorTotal);
      }
    }

    const entradasQtd = esqIni + comprasQtd + trfEntQtd;
    const entradasVal = esqIni * cstIni + comprasVal + trfEntVal;
    const custoMedio  = entradasQtd > 0
      ? entradasVal / entradasQtd
      : (cstFim ?? cstIni ?? 0);

    const consumoQtd  = esqIni + comprasQtd + trfEntQtd - trfSaiQtd - esqFim;
    const consumoVal  = Math.round(consumoQtd * custoMedio * 100) / 100;
    totalConsumoBebidas += consumoVal;

    const temMovimento = esqIni > 0 || comprasQtd > 0 || trfEntQtd > 0 || esqFim > 0;
    if (temMovimento) {
      console.log(
        `${nome.padEnd(32)} ${esqIni.toFixed(3).padStart(8)} ${cstIni.toFixed(2).padStart(9)} ${comprasVal.toFixed(2).padStart(10)} ${trfEntVal.toFixed(2).padStart(8)} ${trfSaiVal.toFixed(2).padStart(8)} ${esqFim.toFixed(3).padStart(8)} ${(cstFim ?? 0).toFixed(2).padStart(9)} ${consumoQtd.toFixed(3).padStart(9)} ${custoMedio.toFixed(4).padStart(9)} ${fmt(consumoVal).padStart(11)}${consumoQtd < 0 ? ' ← NEGATIVO' : ''}${esqFim === 0 && esqIni > 0 ? ' ← SEM SALDO FIM' : ''}`,
      );
    }
  }

  console.log('─'.repeat(140));
  console.log(`${'TOTAL CONSUMO BEBIDAS (reconstruído)'.padEnd(130)} ${fmt(totalConsumoBebidas).padStart(11)}`);

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Fechamento da conta
  // ─────────────────────────────────────────────────────────────────────────
  sep('6. Fechamento da conta');

  const esqIniTotal = saldosIni.reduce((a, s) => a + n(s.qtdFinal) * n(s.custoMedio), 0);
  const esqFimTotal = saldosFim.reduce((a, s) => a + n(s.qtdFinal) * n(s.custoMedio), 0);
  const comprasTotal = todosLancsBebidaOut
    .filter((l) => l.tipo === 'COMPRA_NFE' || l.tipo === 'COMPRA_MANUAL')
    .reduce((a, l) => a + n(l.valorTotal), 0);
  const trfEntTotal = todosLancsBebidaOut
    .filter((l) => l.tipo === 'TRANSFERENCIA_ENTRADA')
    .reduce((a, l) => a + n(l.valorTotal), 0);
  const trfSaiTotal = todosLancsBebidaOut
    .filter((l) => l.tipo === 'TRANSFERENCIA_SAIDA')
    .reduce((a, l) => a + n(l.valorTotal), 0);

  console.log(`\n  Estoque inicial set/26 (valor):    ${fmt(esqIniTotal)}`);
  console.log(`  + Compras outubro:                 ${fmt(comprasTotal)}`);
  console.log(`  + Transferências recebidas:        ${fmt(trfEntTotal)}`);
  console.log(`  - Transferências enviadas:         ${fmt(trfSaiTotal)}`);
  console.log(`  - Estoque final out/26 (valor):    ${fmt(esqFimTotal)}`);
  console.log(`  ─────────────────────────────────────────────`);
  console.log(`  = Consumo reconstruído:            ${fmt(totalConsumoBebidas)}`);
  console.log(`  Card CMV Bebidas (sistema):        ${fmt(CARD_CMV)}`);

  const diffCard = totalConsumoBebidas - CARD_CMV;
  console.log(`  Diferença reconstruído vs card:    ${fmt(diffCard)} ${Math.abs(diffCard) < 1 ? '✅ FECHA' : '← GAP'}`);

  console.log(`\n  ─────────────────────────────────────────────`);
  console.log(`  Notas FEMSA/AMBEV (14 notas):      ${fmt(TOTAL_NOTAS_FOCO)}`);
  console.log(`  Lançamentos BEBIDA dessas notas:   ${fmt(totalFoco)}`);
  console.log(`  Lançamentos BEBIDA outras origens: ${fmt(totalOutras + trfEntTotal - trfSaiTotal + totalManual + totalOrfaos)}`);
  console.log(`  Estoque inicial contribuindo:      ${fmt(esqIniTotal)}`);
  console.log(`  Estoque final abatendo:            ${fmt(esqFimTotal)}`);
  console.log(`  ─────────────────────────────────────────────`);
  console.log(`  Gap notas vs card:                 ${fmt(CARD_CMV - TOTAL_NOTAS_FOCO)} (${fmt(CARD_CMV)} - ${fmt(TOTAL_NOTAS_FOCO)})`);
  console.log(`  Explicado por estoque ini:         ${fmt(esqIniTotal)}`);
  console.log(`  Abatido por estoque fim:          -${fmt(esqFimTotal)}`);
  console.log(`  Outras origens (transf/manual):   +${fmt(totalOutras + trfEntTotal - trfSaiTotal + totalManual + totalOrfaos)}`);

  console.log('\n✅ Diagnóstico concluído. Nenhuma alteração feita no banco.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
