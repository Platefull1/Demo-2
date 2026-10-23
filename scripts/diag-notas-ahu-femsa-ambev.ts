/**
 * Diagnóstico somente leitura — notas SPAL/FEMSA e Ambev na loja Ahú.
 *
 * Uso: npx tsx scripts/diag-notas-ahu-femsa-ambev.ts
 *
 * Mostra:
 *  1. Todas as notas dos fornecedores (últimas competências)
 *  2. Duplicatas por chaveAcesso
 *  3. Total no sistema vs total sem duplicatas vs R$ 28.416 (valor conferido na loja)
 *  4. Candidatas a "devolvida" (notas aprovadas que não batem com o levantamento)
 */

import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8'; // platefull.app (tenant dono)
const STORE = 'ahu';
const VALOR_CONFERIDO = 28416; // R$ informado pelo usuário

// Palavras-chave para identificar SPAL (FEMSA) e Ambev nos nomes
const FEMSA_KEYS = ['spal', 'femsa', 'coca', 'refrige'];
const AMBEV_KEYS = ['ambev', 'brahma', 'antarctica', 'skol', 'bohemia', 'stella'];

// Competências a incluir (últimas 3 para ter contexto)
const COMPETENCIAS = ['2026-08', '2026-09', '2026-10'];

const prisma = new PrismaClient();

function matchesFornecedor(nome: string, keys: string[]): boolean {
  const n = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return keys.some((k) => n.includes(k));
}

function fmt(v: number): string {
  return `R$ ${v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function pad(s: string | number, len: number): string {
  return String(s).padEnd(len);
}

async function main() {
  console.log('========================================================');
  console.log(' DIAGNÓSTICO NOTAS FEMSA/SPAL + AMBEV — AHÚ');
  console.log(`  Tenant: ${OWNER}  |  Loja: ${STORE}`);
  console.log(`  Competências: ${COMPETENCIAS.join(', ')}`);
  console.log('  Modo: SOMENTE LEITURA — nenhuma alteração no banco');
  console.log('========================================================\n');

  // 1. Buscar TODOS os fornecedores da loja para identificar FEMSA e Ambev
  const todasNotas = await prisma.nfeNota.findMany({
    where: {
      userId: OWNER,
      storeSlug: STORE,
      competencia: { in: COMPETENCIAS },
    },
    include: {
      fornecedor: { select: { id: true, razaoSocial: true, nomeFantasia: true, cnpj: true } },
    },
    orderBy: [{ competencia: 'asc' }, { dataEntrada: 'asc' }],
  });

  // Identificar fornecedores FEMSA e Ambev
  const fornecedoresFemsa = new Set<string>();
  const fornecedoresAmbev = new Set<string>();
  const nomeFornecedor = new Map<string, string>();

  for (const n of todasNotas) {
    const nomeDisp = n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial;
    nomeFornecedor.set(n.fornecedor.id, nomeDisp);
    if (matchesFornecedor(nomeDisp, FEMSA_KEYS) || matchesFornecedor(n.fornecedor.razaoSocial, FEMSA_KEYS)) {
      fornecedoresFemsa.add(n.fornecedor.id);
    }
    if (matchesFornecedor(nomeDisp, AMBEV_KEYS) || matchesFornecedor(n.fornecedor.razaoSocial, AMBEV_KEYS)) {
      fornecedoresAmbev.add(n.fornecedor.id);
    }
  }

  console.log('=== Fornecedores identificados ===');
  if (fornecedoresFemsa.size > 0) {
    for (const id of fornecedoresFemsa) {
      console.log(`  FEMSA/SPAL: ${nomeFornecedor.get(id)} (id: ${id})`);
    }
  } else {
    console.log('  ⚠️  Nenhum fornecedor FEMSA/SPAL encontrado nas competências selecionadas');
  }
  if (fornecedoresAmbev.size > 0) {
    for (const id of fornecedoresAmbev) {
      console.log(`  AMBEV:      ${nomeFornecedor.get(id)} (id: ${id})`);
    }
  } else {
    console.log('  ⚠️  Nenhum fornecedor Ambev encontrado nas competências selecionadas');
  }
  console.log('');

  const fornecedoresFoco = new Set([...fornecedoresFemsa, ...fornecedoresAmbev]);

  if (fornecedoresFoco.size === 0) {
    // Listar todos os fornecedores encontrados para ajudar a identificar
    const todosForns = [...new Map(todasNotas.map((n) => [n.fornecedor.id, n.fornecedor])).values()];
    console.log('Fornecedores encontrados nas competências (para identificar manualmente):');
    for (const f of todosForns) {
      const count = todasNotas.filter((n) => n.fornecedorId === f.id).length;
      const val = todasNotas
        .filter((n) => n.fornecedorId === f.id)
        .reduce((a, n) => a + Number(n.valorTotal), 0);
      console.log(`  [${f.id.slice(-6)}] ${(f.nomeFantasia || f.razaoSocial).slice(0, 50).padEnd(50)} CNPJ: ${f.cnpj}  notas: ${count}  total: ${fmt(val)}`);
    }
    console.log('\n💡 Adicione os IDs dos fornecedores corretos ao script se necessário.');
    await prisma.$disconnect();
    return;
  }

  // 2. Filtrar apenas notas dos fornecedores de foco
  const notasFoco = todasNotas.filter((n) => fornecedoresFoco.has(n.fornecedorId));

  console.log(`=== Notas FEMSA/SPAL + Ambev no Ahú (${COMPETENCIAS.join(', ')}) ===`);
  console.log(
    `${'Comp'.padEnd(8)}${'Número'.padEnd(12)}${'Data Entrada'.padEnd(14)}${'Fornecedor'.padEnd(30)}${'Status'.padEnd(18)}${'Valor Total'.padStart(14)}   Chave Acesso`,
  );
  console.log('─'.repeat(140));

  let totalSistema = 0;

  for (const n of notasFoco) {
    const nomeDisp = (n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial).slice(0, 29);
    const dataStr = n.dataEntrada.toISOString().slice(0, 10);
    const val = Number(n.valorTotal);
    totalSistema += val;

    const isFemsa = fornecedoresFemsa.has(n.fornecedorId);
    const grupo = isFemsa ? '[FEMSA]' : '[AMBEV]';

    console.log(
      `${pad(n.competencia, 8)}${pad(n.numero, 12)}${pad(dataStr, 14)}${pad(nomeDisp, 30)}${pad(n.status, 18)}${fmt(val).padStart(14)}   ${n.chaveAcesso.slice(0, 44) || '(vazia)'}  saiposId=${n.saiposNotaId}  ${grupo}`,
    );
  }

  console.log('─'.repeat(140));
  console.log(`Total no sistema (${notasFoco.length} notas): ${fmt(totalSistema).padStart(14)}`);
  console.log('');

  // 3. Detectar duplicatas por chaveAcesso
  console.log('=== Análise de Duplicatas por Chave de Acesso NF-e ===');

  const byChave = new Map<string, typeof notasFoco>();
  for (const n of notasFoco) {
    const chave = n.chaveAcesso || `SEM_CHAVE_${n.saiposNotaId}`;
    const group = byChave.get(chave) ?? [];
    group.push(n);
    byChave.set(chave, group);
  }

  const duplicatas = [...byChave.entries()].filter(([, notas]) => notas.length > 1);
  let valorDuplicado = 0;

  if (duplicatas.length === 0) {
    console.log('  ✅ Nenhuma chave de acesso duplicada encontrada.');
  } else {
    console.log(`  🔴 ${duplicatas.length} chave(s) de acesso com múltiplas notas:\n`);
    for (const [chave, notas] of duplicatas) {
      console.log(`  Chave: ${chave}`);
      for (const n of notas) {
        const val = Number(n.valorTotal);
        const isExtra = notas.indexOf(n) > 0;
        if (isExtra) valorDuplicado += val;
        console.log(
          `    ${isExtra ? '⚠️  DUPLICATA' : '   original '} | saiposId=${n.saiposNotaId} | Nº ${n.numero} | ${n.dataEntrada.toISOString().slice(0, 10)} | ${n.status.padEnd(18)} | ${fmt(val)}`,
        );
      }
    }
    console.log(`\n  Valor total duplicado (entradas extras): ${fmt(valorDuplicado)}`);
  }
  console.log('');

  // 4. Notas aprovadas e lançamentos gerados por elas
  const notasAprovadas = notasFoco.filter((n) => n.status === 'APROVADA');
  console.log(`=== Notas APROVADAS: ${notasAprovadas.length} notas ===`);

  const lancamentos = await prisma.cmvLancamento.findMany({
    where: {
      userId: OWNER,
      storeSlug: STORE,
      tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
      competencia: { in: COMPETENCIAS },
      nfeItem: {
        nota: { fornecedorId: { in: [...fornecedoresFoco] } },
      },
    },
    select: {
      id: true,
      competencia: true,
      data: true,
      valorTotal: true,
      quantidade: true,
      estoqueInsumoId: true,
      nfeItemId: true,
      nfeItem: {
        select: {
          descricao: true,
          notaId: true,
          nota: { select: { numero: true, saiposNotaId: true, status: true, chaveAcesso: true } },
        },
      },
    },
    orderBy: [{ competencia: 'asc' }, { data: 'asc' }],
  });

  const totalLancamentos = lancamentos.reduce((a, l) => a + Number(l.valorTotal), 0);
  console.log(`  Lançamentos CMV gerados por essas notas: ${lancamentos.length}`);
  console.log(`  Valor total nos lançamentos CMV: ${fmt(totalLancamentos)}`);
  console.log('');

  // 5. Resumo de conciliação
  console.log('=== Conciliação com valor conferido na loja ===');
  const totalSemDup = totalSistema - valorDuplicado;
  const diferencaComDup = totalSistema - VALOR_CONFERIDO;
  const diferencaSemDup = totalSemDup - VALOR_CONFERIDO;

  console.log(`  Valor conferido manualmente na loja:  ${fmt(VALOR_CONFERIDO)}`);
  console.log(`  Total no sistema (com duplicatas):    ${fmt(totalSistema)}`);
  console.log(`  Total sem duplicatas (estimado):      ${fmt(totalSemDup)}`);
  console.log(`  Diferença (com duplicatas):           ${fmt(diferencaComDup)} ${diferencaComDup > 0 ? '← sistema maior' : '← sistema menor'}`);
  console.log(`  Diferença (sem duplicatas):           ${fmt(diferencaSemDup)} ${diferencaSemDup > 0 ? '← sistema maior' : '← sistema menor'}`);
  console.log('');

  // 6. Notas que NÃO batem com o levantamento — candidatas a "devolvida"
  console.log('=== Por competência: notas aprovadas (geram lançamentos) ===');
  for (const comp of COMPETENCIAS) {
    const compNotas = notasFoco.filter((n) => n.competencia === comp);
    const compAprov = compNotas.filter((n) => n.status === 'APROVADA');
    const compTotal = compNotas.reduce((a, n) => a + Number(n.valorTotal), 0);
    const compAprovTotal = compAprov.reduce((a, n) => a + Number(n.valorTotal), 0);
    console.log(`  ${comp}: ${compNotas.length} notas total | ${compAprov.length} aprovadas | total=${fmt(compTotal)} | aprovadas=${fmt(compAprovTotal)}`);
    for (const n of compNotas) {
      const dupTag = duplicatas.some(([, ns]) => ns.some((x) => x.id === n.id) && ns.indexOf(n) > 0)
        ? ' ⚠️ DUPLICATA'
        : '';
      console.log(
        `    Nº ${pad(n.numero, 10)} ${n.dataEntrada.toISOString().slice(0, 10)}  ${pad(n.status, 18)} ${fmt(Number(n.valorTotal))}${dupTag}  saiposId=${n.saiposNotaId}`,
      );
    }
  }
  console.log('');

  // 7. Todos os fornecedores da loja (para referência)
  console.log('=== Todos os fornecedores no Ahú (competências analisadas) ===');
  const todosForns = [...new Map(todasNotas.map((n) => [n.fornecedor.id, n.fornecedor])).values()];
  for (const f of todosForns) {
    const count = todasNotas.filter((n) => n.fornecedorId === f.id).length;
    const val = todasNotas
      .filter((n) => n.fornecedorId === f.id)
      .reduce((a, n) => a + Number(n.valorTotal), 0);
    const isFemsa = fornecedoresFemsa.has(f.id);
    const isAmbev = fornecedoresAmbev.has(f.id);
    const tag = isFemsa ? ' ← FEMSA' : isAmbev ? ' ← AMBEV' : '';
    console.log(
      `  ${(f.nomeFantasia || f.razaoSocial).slice(0, 45).padEnd(45)}  CNPJ: ${f.cnpj}  notas: ${String(count).padStart(3)}  total: ${fmt(val)}${tag}`,
    );
  }

  console.log('\n✅ Diagnóstico concluído. Nenhuma alteração feita no banco.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
