/**
 * Reabre todas as notas APROVADA de novembro/2026 → EM_REVISAO
 * (apaga lançamentos CMV, limpa aprovação, itens MAPEADO/IGNORADO → SUGERIDO).
 *
 * Uso:
 *   npx tsx --env-file=.env scripts/reabrir-notas-novembro-2026.ts
 *   npx tsx --env-file=.env scripts/reabrir-notas-novembro-2026.ts --apply
 */

import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const COMPETENCIA = '2026-11';

const prisma = new PrismaClient();

async function main() {
  const apply = process.argv.includes('--apply');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' REABRIR NOTAS — NOVEMBRO/2026 → EM_REVISAO');
  console.log(` Modo: ${apply ? 'APLICAR NO BANCO' : 'DRY-RUN (somente leitura)'}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const notas = await prisma.nfeNota.findMany({
    where: {
      userId: OWNER,
      competencia: COMPETENCIA,
      status: 'APROVADA',
    },
    select: {
      id: true,
      numero: true,
      storeSlug: true,
      competencia: true,
      status: true,
      dataEntrada: true,
      valorTotal: true,
      fornecedor: { select: { nomeFantasia: true, razaoSocial: true } },
    },
    orderBy: [{ storeSlug: 'asc' }, { dataEntrada: 'asc' }, { numero: 'asc' }],
  });

  console.log(`Encontradas ${notas.length} nota(s) APROVADA em ${COMPETENCIA}.\n`);

  const porLoja = new Map<string, number>();
  for (const n of notas) {
    porLoja.set(n.storeSlug, (porLoja.get(n.storeSlug) ?? 0) + 1);
    const forn = n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial;
    console.log(
      `  ${n.storeSlug.padEnd(12)} NF ${n.numero.padEnd(10)} ${n.dataEntrada.toISOString().slice(0, 10)}  R$ ${Number(n.valorTotal).toFixed(2)}  ${forn.slice(0, 40)}`,
    );
  }
  console.log('\nPor loja:');
  for (const [loja, q] of [...porLoja.entries()].sort()) {
    console.log(`  ${loja}: ${q}`);
  }

  const fechamentos = await prisma.cmvFechamento.findMany({
    where: { userId: OWNER, competencia: COMPETENCIA },
    select: { storeSlug: true, status: true },
  });
  console.log('\nFechamentos nov/2026:');
  for (const f of fechamentos) {
    console.log(`  ${f.storeSlug}: ${f.status}`);
  }
  const fechados = new Set(
    fechamentos.filter((f) => f.status === 'FECHADO').map((f) => f.storeSlug),
  );
  if (fechados.size > 0) {
    console.log(
      `\nATENÇÃO: lojas com mês FECHADO (não reabrem): ${[...fechados].join(', ')}`,
    );
  }

  if (!apply) {
    console.log('\nDry-run OK. Rode com --apply para reabrir.');
    return;
  }

  let ok = 0;
  let falha = 0;
  for (const n of notas) {
    if (fechados.has(n.storeSlug)) {
      falha++;
      console.log(`  FALHA NF ${n.numero} (${n.storeSlug}): competência fechada`);
      continue;
    }

    try {
      const [, , itens] = await prisma.$transaction([
        prisma.cmvLancamento.deleteMany({
          where: {
            userId: OWNER,
            nfeItem: { notaId: n.id },
          },
        }),
        prisma.nfeNota.update({
          where: { id: n.id },
          data: {
            status: 'EM_REVISAO',
            aprovadaEm: null,
            aprovadaPorId: null,
            aprovacaoAutomatica: false,
            aprovadaComAlerta: false,
            aprovacaoRegra: null,
            reabertaPorId: OWNER,
            reabertaEm: new Date(),
          },
        }),
        prisma.nfeItem.updateMany({
          where: { notaId: n.id, status: { in: ['MAPEADO', 'IGNORADO'] } },
          data: { status: 'SUGERIDO' },
        }),
      ]);
      ok++;
      console.log(
        `  OK  NF ${n.numero} (${n.storeSlug}) — itens → pendentes: ${itens.count}`,
      );
    } catch (e) {
      falha++;
      console.log(
        `  FALHA NF ${n.numero} (${n.storeSlug}): ${e instanceof Error ? e.message : e}`,
      );
    }
  }

  const aindaAprovadas = await prisma.nfeNota.count({
    where: { userId: OWNER, competencia: COMPETENCIA, status: 'APROVADA' },
  });
  const emRevisao = await prisma.nfeNota.count({
    where: { userId: OWNER, competencia: COMPETENCIA, status: 'EM_REVISAO' },
  });
  const ignoradas = await prisma.nfeNota.count({
    where: { userId: OWNER, competencia: COMPETENCIA, status: 'IGNORADA' },
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(` Reabertas: ${ok}  |  Falhas: ${falha}`);
  console.log(
    ` Agora em ${COMPETENCIA}: EM_REVISAO=${emRevisao}  APROVADA=${aindaAprovadas}  IGNORADA=${ignoradas}`,
  );
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
