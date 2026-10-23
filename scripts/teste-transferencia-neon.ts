/**
 * Teste ponta a ponta de transferência manual entre lojas em branch Neon.
 *
 * Fluxo:
 *   1. Busca estoqueInsumoId de COCA 2L no catálogo Ahú
 *   2. Calcula CMV Bebidas antes para Ahú e Pilarzinho
 *   3. Registra Ahú → Pilarzinho, 1 UN COCA 2L
 *   4. Recalcula CMV Bebidas para ambas as lojas e verifica simetria
 *   5. Edita a transferência (muda qtd para 2)
 *   6. Verifica CMV novamente
 *   7. Exclui a transferência
 *   8. Verifica recuperação ao valor original
 *
 * Uso:
 *   npx tsx scripts/teste-transferencia-neon.ts
 *
 * Exige DATABASE_URL apontando para branch Neon de teste.
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const OWNER_USER_ID = 'cmk5ykusf0001jz04iwmf8xa8';
const LOJA_ORIGEM  = 'ahu';
const LOJA_DESTINO = 'pilarzinho';
const PRODUTO_NOME_BUSCA = 'COCA 2 LITROS';
const COMPETENCIA = '2026-10';

// ── helpers ──────────────────────────────────────────────────────────────────

function n(v: unknown): number {
  return Number(v ?? 0);
}

function fmtMoney(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function cmvBebidas(storeSlug: string): Promise<number> {
  // 1. Busca configs BEBIDA
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER_USER_ID, secao: 'BEBIDA', ativo: true },
  });
  const ids = configs.map((c) => c.estoqueInsumoId);
  if (ids.length === 0) return 0;

  // 2. Lançamentos, saldos inicial e final
  const [lancamentos, saldoFim, saldoIni] = await Promise.all([
    prisma.cmvLancamento.findMany({
      where: { userId: OWNER_USER_ID, storeSlug, competencia: COMPETENCIA, estoqueInsumoId: { in: ids } },
    }),
    prisma.cmvSaldoEstoque.findMany({
      where: { userId: OWNER_USER_ID, storeSlug, competencia: COMPETENCIA, estoqueInsumoId: { in: ids } },
    }),
    prisma.cmvSaldoEstoque.findMany({
      where: { userId: OWNER_USER_ID, storeSlug, competencia: '2026-09', estoqueInsumoId: { in: ids } },
    }),
  ]);

  const iniMap = new Map(saldoIni.map((s) => [s.estoqueInsumoId, s]));
  const fimMap = new Map(saldoFim.map((s) => [s.estoqueInsumoId, s]));

  let cmv = 0;
  for (const cfg of configs) {
    const id = cfg.estoqueInsumoId;
    const ini = iniMap.get(id);
    const fim = fimMap.get(id);
    const itemLancs = lancamentos.filter((l) => l.estoqueInsumoId === id);

    let comprasQtd = 0, comprasValor = 0;
    let transfEnviadaQtd = 0, transfEnviadaValor = 0;
    let transfRecebidaQtd = 0, transfRecebidaValor = 0;
    let desperdicioQtd = 0;

    for (const l of itemLancs) {
      const q = n(l.quantidade), v = n(l.valorTotal);
      if (l.tipo === 'COMPRA_NFE' || l.tipo === 'COMPRA_MANUAL') {
        comprasQtd += q; comprasValor += v;
      } else if (l.tipo === 'TRANSFERENCIA_SAIDA') {
        transfEnviadaQtd += q; transfEnviadaValor += v;
      } else if (l.tipo === 'TRANSFERENCIA_ENTRADA') {
        transfRecebidaQtd += q; transfRecebidaValor += v;
      } else if (l.tipo === 'DESPERDICIO') {
        desperdicioQtd += q;
      }
    }

    const estoqueInicial = n(ini?.qtdFinal);
    const estoqueFinal   = n(fim?.qtdFinal);
    const custoIni       = ini?.custoMedio ? n(ini.custoMedio) : 0;
    const custoFim       = fim?.custoMedio ? n(fim.custoMedio) : null;

    const consumoQtd = estoqueInicial + comprasQtd + transfRecebidaQtd - transfEnviadaQtd - desperdicioQtd - estoqueFinal;
    const entradasQtd   = estoqueInicial + comprasQtd + transfRecebidaQtd;
    const entradasValor = estoqueInicial * custoIni + comprasValor + transfRecebidaValor;
    const custoMedio    = entradasQtd > 0 ? entradasValor / entradasQtd : (custoFim ?? custoIni ?? 0);
    cmv += Math.round(consumoQtd * custoMedio * 100) / 100;
  }

  return cmv;
}

async function main() {
  console.log('\n========== TESTE TRANSFERÊNCIA NEON ==========\n');

  // 1. Busca produto
  const produto = await prisma.cmvRealInsumoConfig.findFirst({
    where: {
      userId: OWNER_USER_ID,
      secao: 'BEBIDA',
      ativo: true,
      estoqueInsumo: { nome: { contains: PRODUTO_NOME_BUSCA, mode: 'insensitive' } },
    },
    include: { estoqueInsumo: { select: { nome: true } } },
    orderBy: { estoqueInsumo: { nome: 'asc' } },
  });

  if (!produto) {
    throw new Error(`Produto "${PRODUTO_NOME_BUSCA}" não encontrado no catálogo Bebidas do Ahú`);
  }

  const estoqueInsumoId = produto.estoqueInsumoId;
  const nomeProduto     = produto.estoqueInsumo.nome;
  console.log(`Produto encontrado: ${nomeProduto} (${estoqueInsumoId})`);

  // 2. Busca custo atual via último lançamento
  const ultimoLanc = await prisma.cmvLancamento.findFirst({
    where: {
      userId: OWNER_USER_ID,
      storeSlug: LOJA_ORIGEM,
      estoqueInsumoId,
      tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
    },
    orderBy: { data: 'desc' },
  });
  const custoUnitario = ultimoLanc?.valorTotal && ultimoLanc?.quantidade
    ? n(ultimoLanc.valorTotal) / n(ultimoLanc.quantidade)
    : null;
  console.log(`Custo unitário estimado: ${custoUnitario != null ? fmtMoney(custoUnitario) : 'não encontrado (usará fallback API)'}`);

  // 3. CMV antes
  const cmvAhuAntes       = await cmvBebidas(LOJA_ORIGEM);
  const cmvPilarzinhoAntes = await cmvBebidas(LOJA_DESTINO);
  console.log('\n--- CMV Bebidas ANTES ---');
  console.log(`  Ahú:        ${fmtMoney(cmvAhuAntes)}`);
  console.log(`  Pilarzinho: ${fmtMoney(cmvPilarzinhoAntes)}`);

  // 4. Registra transferência via lib
  const { registrarTransferenciaCompleta } = await import('../src/lib/nfe/transferencia-documento');
  const doc1 = await registrarTransferenciaCompleta({
    userId:      OWNER_USER_ID,
    actorUserId: OWNER_USER_ID,
    lojaOrigem:  LOJA_ORIGEM,
    lojaDestino: LOJA_DESTINO,
    data:        new Date('2026-10-15'),
    observacao:  'Teste automatizado Neon — pode excluir',
    itens:       [{ estoqueInsumoId, quantidade: 1, custoUnitario }],
  });
  console.log(`\nTransferência registrada: ${doc1.numeroDocumento} (id=${doc1.id})`);

  // 5. CMV depois do registro
  const cmvAhuDepois1       = await cmvBebidas(LOJA_ORIGEM);
  const cmvPilarzinhoDepois1 = await cmvBebidas(LOJA_DESTINO);
  const varAhu1       = cmvAhuDepois1 - cmvAhuAntes;
  const varPilarzinho1 = cmvPilarzinhoDepois1 - cmvPilarzinhoAntes;

  console.log('\n--- CMV Bebidas DEPOIS do registro (qtd=1) ---');
  console.log(`  Ahú:        ${fmtMoney(cmvAhuDepois1)}  (Δ ${fmtMoney(varAhu1)})`);
  console.log(`  Pilarzinho: ${fmtMoney(cmvPilarzinhoDepois1)}  (Δ ${fmtMoney(varPilarzinho1)})`);

  const simetrico1 = Math.abs(varAhu1 + varPilarzinho1) < 0.02;
  console.log(`  ✓ Simétrico (Δ Ahú ≈ −Δ Pilarzinho): ${simetrico1 ? 'SIM ✅' : 'NÃO ❌'}`);
  if (!simetrico1) {
    console.error(`    Diferença encontrada: ${fmtMoney(varAhu1 + varPilarzinho1)}`);
  }

  // 6. Edita: muda qty para 2
  const { atualizarTransferencia } = await import('../src/lib/nfe/transferencia-documento');
  const doc2 = await atualizarTransferencia({
    userId:      OWNER_USER_ID,
    actorUserId: OWNER_USER_ID,
    id:          doc1.id,
    itens:       [{ estoqueInsumoId, quantidade: 2, custoUnitario }],
  });
  console.log(`\nTransferência editada: ${doc2.id} (qtd 1→2)`);

  const cmvAhuDepois2       = await cmvBebidas(LOJA_ORIGEM);
  const cmvPilarzinhoDepois2 = await cmvBebidas(LOJA_DESTINO);
  const varAhu2       = cmvAhuDepois2 - cmvAhuAntes;
  const varPilarzinho2 = cmvPilarzinhoDepois2 - cmvPilarzinhoAntes;

  console.log('\n--- CMV Bebidas DEPOIS da edição (qtd=2) ---');
  console.log(`  Ahú:        ${fmtMoney(cmvAhuDepois2)}  (Δ ${fmtMoney(varAhu2)})`);
  console.log(`  Pilarzinho: ${fmtMoney(cmvPilarzinhoDepois2)}  (Δ ${fmtMoney(varPilarzinho2)})`);

  const simetrico2 = Math.abs(varAhu2 + varPilarzinho2) < 0.02;
  console.log(`  ✓ Simétrico: ${simetrico2 ? 'SIM ✅' : 'NÃO ❌'}`);

  // 7. Exclui
  const { excluirTransferencia } = await import('../src/lib/nfe/transferencia-documento');
  await excluirTransferencia({ userId: OWNER_USER_ID, actorUserId: OWNER_USER_ID, id: doc1.id });
  console.log('\nTransferência excluída (soft delete)');

  // 8. CMV final — deve voltar ao original
  const cmvAhuFinal       = await cmvBebidas(LOJA_ORIGEM);
  const cmvPilarzinhoFinal = await cmvBebidas(LOJA_DESTINO);

  console.log('\n--- CMV Bebidas APÓS exclusão ---');
  console.log(`  Ahú:        ${fmtMoney(cmvAhuFinal)}  (esperado: ${fmtMoney(cmvAhuAntes)})`);
  console.log(`  Pilarzinho: ${fmtMoney(cmvPilarzinhoFinal)}  (esperado: ${fmtMoney(cmvPilarzinhoAntes)})`);

  const recuperadoAhu        = Math.abs(cmvAhuFinal - cmvAhuAntes) < 0.02;
  const recuperadoPilarzinho = Math.abs(cmvPilarzinhoFinal - cmvPilarzinhoAntes) < 0.02;
  console.log(`  ✓ Ahú recuperou:        ${recuperadoAhu ? 'SIM ✅' : 'NÃO ❌'}`);
  console.log(`  ✓ Pilarzinho recuperou: ${recuperadoPilarzinho ? 'SIM ✅' : 'NÃO ❌'}`);

  console.log('\n========== FIM DO TESTE ==========\n');

  // Verifica se há registro excluído no banco (exclusão lógica)
  const excluida = await (prisma as PrismaClient & {
    cmvTransferencia: { findFirst: Function }
  }).cmvTransferencia.findFirst({
    where: { id: doc1.id },
    select: { id: true, excluidoEm: true },
  });
  console.log(`Exclusão lógica: registro no banco = ${excluida ? 'SIM ✅' : 'NÃO ❌'}, excluidoEm = ${excluida?.excluidoEm ?? 'null'}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
