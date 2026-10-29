/**
 * Regenera o fechamento mensal (mesma lógica da API /api/pontos/fechamento/gerar).
 * Uso: npx tsx --env-file=.env scripts/gerar-fechamento.ts 10 2026
 */
import { PrismaClient } from '@prisma/client';
import { executarGeracaoFechamento } from '../src/lib/pontos/executar-fechamento';

async function main() {
  const mes = Number(process.argv[2] ?? 10);
  const ano = Number(process.argv[3] ?? 2026);
  const prisma = new PrismaClient();
  const sample = await prisma.rhFuncionario.findFirst({
    where: { pisSecullum: { not: null } },
    select: { userId: true },
  });
  await prisma.$disconnect();
  if (!sample) throw new Error('Nenhum funcionário com PIS encontrado');

  console.log(`Gerando fechamento ${String(mes).padStart(2, '0')}/${ano} userId=${sample.userId}`);
  const result = await executarGeracaoFechamento({ userId: sample.userId, mes, ano });
  console.log(
    JSON.stringify(
      {
        fechamentoId: result.fechamentoId,
        periodo: result.periodo,
        processados: result.processados,
        comErro: result.comErro,
        funcionariosSemPis: result.funcionariosSemPis,
        secullumQuota: result.secullumQuota,
      },
      null,
      2,
    ),
  );
  console.log('\n=== Ad. Noturno Platefull × Not.Tot. Secullum ===');
  for (const c of result.comparacaoAdicionalNoturno) {
    const flag = c.diferenca !== '00:00' ? '  << DIVERGE' : '';
    console.log(`${c.nome}  PF=${c.platefull}  Sec=${c.secullum ?? '—'}  Δ=${c.diferenca}${flag}`);
    if (c.diasDivergentes.length > 0) {
      for (const d of c.diasDivergentes) {
        console.log(`    ${d.ymd}  PF=${d.platefull}  Sec=${d.secullum}`);
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
