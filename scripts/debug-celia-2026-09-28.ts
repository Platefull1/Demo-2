/**
 * Diagnóstico somente leitura — Célia 2026-09-28 vs classificarDia.
 * Uso: npx tsx --env-file=.env scripts/debug-celia-2026-09-28.ts
 */
import { PrismaClient } from '@prisma/client';
import { classificarDia } from '../src/lib/pontos/classificarDia';
import { ymdToUtcDate, addDaysYmd } from '../src/lib/pontos/escala-dia';
import { vigenciasParaData } from '../src/lib/pontos/escala-vigencia';

const prisma = new PrismaClient();
const YMD = '2026-09-28';

async function main() {
  const func = await prisma.rhFuncionario.findFirst({
    where: { nome: { contains: 'CELIA REGINA', mode: 'insensitive' } },
  });
  if (!func) {
    console.log('Célia não encontrada');
    return;
  }

  console.log('=== FICHA ===');
  console.log(
    JSON.stringify(
      {
        id: func.id,
        nome: func.nome,
        dataAdmissao: func.dataAdmissao,
        dataGozoFerias: func.dataGozoFerias,
        diasFeriasGozados: func.diasFeriasGozados,
        statusFerias: func.statusFerias,
        dataInicioFerias: func.dataInicioFerias,
        ativo: func.ativo,
      },
      null,
      2,
    ),
  );

  if (func.dataGozoFerias && func.diasFeriasGozados) {
    const ini = func.dataGozoFerias.toISOString().slice(0, 10);
    const fimExcl = new Date(func.dataGozoFerias);
    fimExcl.setUTCDate(fimExcl.getUTCDate() + func.diasFeriasGozados);
    const ultimoIncl = new Date(func.dataGozoFerias);
    ultimoIncl.setUTCDate(ultimoIncl.getUTCDate() + func.diasFeriasGozados - 1);
    console.log('=== INTERVALO FÉRIAS (código emFerias: [ini, ini+dias) ) ===');
    console.log(
      JSON.stringify({
        ini,
        diasFeriasGozados: func.diasFeriasGozados,
        ultimoDiaInclusivo: ultimoIncl.toISOString().slice(0, 10),
        primeiroDiaFora: fimExcl.toISOString().slice(0, 10),
        ymdCaiDentro: YMD >= ini && YMD < fimExcl.toISOString().slice(0, 10),
      }),
    );
  }

  const data = ymdToUtcDate(YMD);
  const dataFim = ymdToUtcDate(addDaysYmd(YMD, 1));

  const [vigencias, ocorrencias, registros] = await Promise.all([
    prisma.rhEscalaVigencia.findMany({ where: { funcionarioId: func.id } }),
    prisma.rhOcorrencia.findMany({
      where: { funcionarioId: func.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pontoRegistro.findMany({
      where: { funcionarioId: func.id, data: { gte: data, lt: dataFim } },
    }),
  ]);

  console.log('\n=== TODAS OCORRÊNCIAS (ativo=qualquer) ===');
  console.log(
    JSON.stringify(
      ocorrencias.map((o) => ({
        id: o.id,
        tipo: o.tipo,
        ativo: o.ativo,
        data: o.data,
        dataInicioAfastamento: o.dataInicioAfastamento,
        dataFimAfastamento: o.dataFimAfastamento,
        descricao: o.descricao?.slice(0, 200),
      })),
      null,
      2,
    ),
  );

  console.log('\n=== PONTO 2026-09-28 ===');
  console.log(JSON.stringify(registros, null, 2));

  const vig = vigenciasParaData(vigencias, YMD);
  console.log('\n=== VIGÊNCIA NO DIA ===');
  console.log(
    vig
      ? JSON.stringify({
          id: vig.id,
          vigenciaInicio: vig.vigenciaInicio,
          vigenciaFim: vig.vigenciaFim,
          horarioEntrada: vig.horarioEntrada,
          horarioSaida: vig.horarioSaida,
          diasFolga: vig.diasFolga,
        })
      : 'SEM VIGÊNCIA',
  );

  const batidas = registros[0] ?? null;
  const result = classificarDia({
    data,
    dataAdmissao: func.dataAdmissao,
    batidas,
    escalaVigente: vig
      ? {
          diasFolga: vig.diasFolga,
          domingoFolga: vig.domingoFolga,
          horarioEntrada: vig.horarioEntrada,
          horarioSaida: vig.horarioSaida,
          escala: vig.escala,
        }
      : null,
    ocorrencias,
    dataGozoFerias: func.dataGozoFerias,
    diasFeriasGozados: func.diasFeriasGozados,
    statusFerias: func.statusFerias,
    agora: ymdToUtcDate(addDaysYmd('2026-10-27', 1)),
  });

  console.log('\n=== classificarDia(2026-09-28) ===');
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
