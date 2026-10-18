/**
 * Backfill: cria RhEscalaVigencia inicial para cada funcionário sem vigência.
 * vigenciaInicio = dataAdmissao (ou createdAt se nulo).
 *
 * Pré-requisito: prisma db push (schema com RhEscalaVigencia).
 * Rodar: npx tsx scripts/backfill-escala-vigencia.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const funcionarios = await prisma.rhFuncionario.findMany({
    select: {
      id: true,
      escala: true,
      diasFolga: true,
      domingoFolga: true,
      horarioEntrada: true,
      horarioSaida: true,
      dataAdmissao: true,
      createdAt: true,
      escalasVigencia: { select: { id: true }, take: 1 },
    },
  });

  let criados = 0;
  let pulados = 0;

  for (const f of funcionarios) {
    if (f.escalasVigencia.length > 0) {
      pulados++;
      continue;
    }

    const inicio = f.dataAdmissao ?? f.createdAt;
    const vigenciaInicio = new Date(inicio);
    vigenciaInicio.setUTCHours(0, 0, 0, 0);

    await prisma.rhEscalaVigencia.create({
      data: {
        funcionarioId: f.id,
        vigenciaInicio,
        vigenciaFim: null,
        escala: f.escala,
        diasFolga: f.diasFolga ?? [],
        domingoFolga: f.domingoFolga,
        horarioEntrada: f.horarioEntrada,
        horarioSaida: f.horarioSaida,
      },
    });
    criados++;
  }

  console.log(`Backfill concluído: ${criados} criados, ${pulados} já tinham vigência.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
