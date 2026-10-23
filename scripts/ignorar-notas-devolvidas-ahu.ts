/**
 * Ignora 5 notas SPAL/FEMSA do Ahú devolvidas à fábrica (out/2026).
 *
 * Notas: 9636376, 9636377, 740826, 740827, 740828  (dias 16–17/10)
 * Motivo: DEVOLVIDA
 *
 * Uso:
 *   npx tsx scripts/ignorar-notas-devolvidas-ahu.ts          ← dry-run (mostra diff)
 *   npx tsx scripts/ignorar-notas-devolvidas-ahu.ts --apply  ← aplica no banco
 */

import { PrismaClient } from '@prisma/client';

const OWNER  = 'cmk5ykusf0001jz04iwmf8xa8';
const STORE  = 'ahu';
const MOTIVO = 'DEVOLVIDA';

const NUMEROS_ALVO = ['9636376', '9636377', '740826', '740827', '740828'];

const prisma = new PrismaClient();

function fmt(v: number): string {
  return `R$ ${v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

async function main() {
  const apply = process.argv.includes('--apply');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(` IGNORAR NOTAS DEVOLVIDAS — AHÚ`);
  console.log(` Motivo: ${MOTIVO}`);
  console.log(` Modo: ${apply ? '🔴 APLICAR NO BANCO' : '🟡 DRY-RUN (somente leitura)'}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Buscar as notas
  const notas = await prisma.nfeNota.findMany({
    where: {
      userId: OWNER,
      storeSlug: STORE,
      numero: { in: NUMEROS_ALVO },
    },
    include: {
      fornecedor: { select: { nomeFantasia: true, razaoSocial: true } },
      itens: { select: { id: true, status: true, descricao: true, valorLiquido: true } },
    },
    orderBy: { dataEntrada: 'asc' },
  });

  // Verificar se encontrou todos
  const encontrados = new Set(notas.map((n) => n.numero));
  const ausentes = NUMEROS_ALVO.filter((num) => !encontrados.has(num));
  if (ausentes.length > 0) {
    console.error(`❌ Notas não encontradas no banco: ${ausentes.join(', ')}`);
    process.exit(1);
  }

  // 2. Para cada nota, buscar lançamentos CMV gerados
  const nfeItemIds = notas.flatMap((n) => n.itens.map((i) => i.id));
  const lancamentos = await prisma.cmvLancamento.findMany({
    where: { userId: OWNER, nfeItemId: { in: nfeItemIds } },
    select: {
      id: true,
      estoqueInsumoId: true,
      valorTotal: true,
      quantidade: true,
      unidade: true,
      tipo: true,
      nfeItemId: true,
    },
  });
  const lancsByItemId = new Map<string, typeof lancamentos>();
  for (const l of lancamentos) {
    if (!l.nfeItemId) continue;
    const lst = lancsByItemId.get(l.nfeItemId) ?? [];
    lst.push(l);
    lancsByItemId.set(l.nfeItemId, lst);
  }

  // 3. Exibir diff
  let totalValorNotas = 0;
  let totalLancamentos = 0;
  let totalLancamentosValor = 0;

  console.log('┌─────────────────────────────────────────────────────────────────────────┐');
  console.log('│ DIFF — O QUE SERÁ ALTERADO NO BANCO                                     │');
  console.log('└─────────────────────────────────────────────────────────────────────────┘\n');

  for (const nota of notas) {
    const nomeForn = (nota.fornecedor.nomeFantasia || nota.fornecedor.razaoSocial).slice(0, 30);
    const valNota = Number(nota.valorTotal);
    totalValorNotas += valNota;

    const lancsDaNota = nota.itens.flatMap((i) => lancsByItemId.get(i.id) ?? []);
    const lancValor = lancsDaNota.reduce((a, l) => a + Number(l.valorTotal), 0);
    totalLancamentos += lancsDaNota.length;
    totalLancamentosValor += lancValor;

    console.log(`  NF ${nota.numero.padEnd(10)} ${nota.dataEntrada.toISOString().slice(0, 10)}  ${nomeForn}`);
    console.log(`    Status atual:  ${nota.status}`);
    console.log(`    Valor nota:    ${fmt(valNota)}`);
    console.log(`    Lançamentos CMV a remover: ${lancsDaNota.length}  (${fmt(lancValor)})`);

    // Mudança no NfeNota
    console.log(`    ┌─ NfeNota [${nota.id}]`);
    console.log(`    │    status:         ${nota.status}  →  IGNORADA`);
    console.log(`    │    aprovacaoRegra: ${nota.aprovacaoRegra ?? 'null'}  →  ${MOTIVO}`);
    console.log(`    │    aprovadaEm:     ${nota.aprovadaEm?.toISOString() ?? 'null'}  →  null`);
    console.log(`    │    aprovadaPorId:  ${nota.aprovadaPorId ?? 'null'}  →  null`);
    console.log(`    └─ ${nota.itens.length} NfeItem(s) → status IGNORADO`);

    if (lancsDaNota.length > 0) {
      console.log(`    ┌─ CmvLancamento (DELETE ${lancsDaNota.length})`);
      for (const l of lancsDaNota) {
        console.log(`    │    id=${l.id.slice(-8)}  tipo=${l.tipo}  val=${fmt(Number(l.valorTotal))}  qtd=${Number(l.quantidade).toFixed(3)} ${l.unidade}`);
      }
      console.log('    └─');
    }
    console.log('');
  }

  console.log('─────────────────────────────────────────────────────────────────');
  console.log(`  Total valor das notas:         ${fmt(totalValorNotas)}`);
  console.log(`  Lançamentos CMV a excluir:     ${totalLancamentos}  (${fmt(totalLancamentosValor)})`);
  console.log(`  CMV Bebidas antes (aprox.):    R$ 48.269,16`);
  console.log(`  CMV Bebidas depois (aprox.):   ${fmt(48_269.16 - totalLancamentosValor)}`);
  console.log('─────────────────────────────────────────────────────────────────\n');

  if (!apply) {
    console.log('🟡 Dry-run concluído. Nenhuma alteração feita.');
    console.log('   Para aplicar: npx tsx scripts/ignorar-notas-devolvidas-ahu.ts --apply');
    return;
  }

  // 4. Verificar que nenhuma nota está em competência fechada
  for (const nota of notas) {
    const fechamento = await prisma.cmvFechamento.findUnique({
      where: {
        userId_storeSlug_competencia: {
          userId: OWNER,
          storeSlug: STORE,
          competencia: nota.competencia,
        },
      },
      select: { status: true },
    });
    if (fechamento?.status === 'FECHADO') {
      console.error(`❌ ABORT: competência ${nota.competencia} está FECHADA. Reabra antes de continuar.`);
      process.exit(1);
    }
  }

  // 5. Aplicar
  console.log('🔴 Aplicando...\n');
  let lancamentosRemovidos = 0;

  for (const nota of notas) {
    const itemIds = nota.itens.map((i) => i.id);

    await prisma.$transaction(async (tx) => {
      // Apaga lançamentos CMV (só APROVADA tem, mas deleteMany é seguro em ambos)
      const del = await tx.cmvLancamento.deleteMany({
        where: { userId: OWNER, nfeItemId: { in: itemIds } },
      });
      lancamentosRemovidos += del.count;

      // Atualiza nota
      await tx.nfeNota.update({
        where: { id: nota.id },
        data: {
          status: 'IGNORADA',
          aprovacaoRegra: MOTIVO,
          aprovadaEm: null,
          aprovadaPorId: null,
          aprovacaoAutomatica: false,
          aprovadaComAlerta: false,
        },
      });

      // Itens → IGNORADO
      await tx.nfeItem.updateMany({
        where: { notaId: nota.id },
        data: { status: 'IGNORADO' },
      });
    });

    console.log(`  ✅ NF ${nota.numero} → IGNORADA  (lançamentos removidos: ${nota.itens.flatMap((i) => lancsByItemId.get(i.id) ?? []).length})`);
  }

  console.log(`\n  Total lançamentos CMV removidos: ${lancamentosRemovidos}`);
  console.log(`  CMV Bebidas estimado após correção: ${fmt(48_269.16 - totalLancamentosValor)}`);

  // 6. Verificação pós-aplicação
  console.log('\n─── Verificação pós-aplicação ─────────────────────────────────────');
  const verificacao = await prisma.nfeNota.findMany({
    where: { userId: OWNER, storeSlug: STORE, numero: { in: NUMEROS_ALVO } },
    select: { numero: true, status: true, aprovacaoRegra: true },
  });
  for (const v of verificacao) {
    const ok = v.status === 'IGNORADA' && v.aprovacaoRegra === MOTIVO;
    console.log(`  ${ok ? '✅' : '❌'} NF ${v.numero}  status=${v.status}  motivo=${v.aprovacaoRegra ?? 'null'}`);
  }

  const lancamentosRestantes = await prisma.cmvLancamento.count({
    where: { userId: OWNER, nfeItemId: { in: nfeItemIds } },
  });
  console.log(`  Lançamentos CMV restantes ligados às 5 notas: ${lancamentosRestantes} (esperado: 0)`);

  console.log('\n✅ Concluído.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
