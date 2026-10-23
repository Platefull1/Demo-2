/** Busca ampla pelas notas devolvidas em produção */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Busca por saiposNotaId sem filtro de userId
  const notas = await prisma.nfeNota.findMany({
    where: { saiposNotaId: { in: [9636376, 9636377, 740826, 740827, 740828] } },
    select: { id: true, userId: true, saiposNotaId: true, status: true, aprovacaoRegra: true, valorTotal: true, storeSlug: true },
  });
  console.log('Busca por saiposNotaId (sem filtro userId):');
  if (notas.length === 0) {
    console.log('  Nenhuma nota encontrada com esses saiposNotaIds');
  } else {
    for (const n of notas) console.log(`  ${JSON.stringify(n)}`);
  }

  // Verifica userId existente
  const user = await prisma.user.findUnique({
    where: { id: 'cmk5ykusf0001jz04iwmf8xa8' },
    select: { id: true, email: true, fullName: true },
  });
  console.log('\nUsuário cmk5ykusf0001jz04iwmf8xa8:', user ?? 'NÃO ENCONTRADO');

  // Conta total de notas do usuário
  const total = await prisma.nfeNota.count({ where: { userId: 'cmk5ykusf0001jz04iwmf8xa8' } });
  console.log(`Total de notas do usuário em produção: ${total}`);

  // Últimas 5 notas do usuário
  const ultimas = await prisma.nfeNota.findMany({
    where: { userId: 'cmk5ykusf0001jz04iwmf8xa8', storeSlug: 'ahu' },
    select: { saiposNotaId: true, status: true, aprovacaoRegra: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  console.log('\nÚltimas 10 notas Ahú:');
  for (const n of ultimas) console.log(`  saiposNotaId=${n.saiposNotaId}  status=${n.status}  regra=${n.aprovacaoRegra}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
