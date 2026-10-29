/**
 * Diagnóstico somente leitura — adicional noturno outubro/2026.
 * Uso: npx tsx --env-file=.env scripts/debug-adicional-noturno.ts
 */
import { PrismaClient } from '@prisma/client';
import { calcularAdicionalNoturnoDia } from '../src/lib/pontos/adicional-noturno';
import { calcularAdicionalNoturnoPeriodo } from '../src/lib/pontos/fechamento-adicional-noturno';
import { addDaysYmd, escalaEhFolgaNoDia, ymdToUtcDate } from '../src/lib/pontos/escala-dia';
import { vigenciasParaData } from '../src/lib/pontos/escala-vigencia';

const prisma = new PrismaClient();

const MES = 10;
const ANO = 2026;
const DATA_INI = '2026-09-28';
const DATA_FIM = '2026-10-27';
const NOME_ALVO = process.argv[2] ?? 'ADRIANA';

function slots(r: {
  entrada1: string | null;
  saida1: string | null;
  entrada2: string | null;
  saida2: string | null;
  entrada3: string | null;
  saida3: string | null;
} | null): string {
  if (!r) return '—';
  const s = [r.entrada1, r.saida1, r.entrada2, r.saida2, r.entrada3, r.saida3]
    .map((v) => v ?? '-')
    .join(' / ');
  return s;
}

function json(v: unknown) {
  return JSON.stringify(v, (_k, val) => (typeof val === 'bigint' ? String(val) : val));
}

async function item1() {
  console.log('\n========== 1. BANCO fechamento_linhas 10/2026 ==========');
  const fech = await prisma.fechamentoMensal.findUnique({
    where: { mes_ano: { mes: MES, ano: ANO } },
    select: { id: true, mes: true, ano: true, status: true, updatedAt: true },
  });
  console.log('fechamento:', json(fech));
  if (!fech) return null;

  const linhas = await prisma.fechamentoLinha.findMany({
    where: { fechamentoId: fech.id },
    include: { funcionario: { select: { id: true, nome: true } } },
    orderBy: { funcionario: { nome: 'asc' } },
  });
  console.log('total linhas:', linhas.length);

  const dist = { null: 0, zero: 0, preenchido: 0, outro: 0 };
  for (const l of linhas) {
    const v = l.adicionalNoturno;
    if (v == null) dist.null++;
    else if (v === '00:00' || v === '0:00' || v === '0') dist.zero++;
    else if (v.trim() === '') dist.outro++;
    else dist.preenchido++;
  }
  console.log('distribuição adicionalNoturno:', json(dist));

  console.log('\n5 primeiras (nome, adicionalNoturno, observacao, en60):');
  for (const l of linhas.slice(0, 5)) {
    console.log(
      json({
        nome: l.funcionario.nome,
        adicionalNoturno: l.adicionalNoturno,
        adicionalNoturnoType: l.adicionalNoturno === null ? 'null' : typeof l.adicionalNoturno,
        observacao: l.observacao,
        en60: l.en60,
      }),
    );
  }

  const adriana = linhas.find((l) =>
    l.funcionario.nome.toUpperCase().includes(NOME_ALVO),
  );
  console.log('\nAdriana (linha gravada):', adriana
    ? json({
        funcionarioId: adriana.funcionarioId,
        nome: adriana.funcionario.nome,
        adicionalNoturno: adriana.adicionalNoturno,
        observacao: adriana.observacao,
        en60: adriana.en60,
        faltas: adriana.faltas,
        origemErro: adriana.origemErro,
        updatedAt: adriana.updatedAt,
      })
    : 'NÃO ENCONTRADA');

  return { fech, linhas, adriana };
}

async function item3(funcionarioId: string, nome: string, gravado: string | null) {
  console.log('\n========== 3. CÁLCULO DIA A DIA', nome, DATA_INI, '→', DATA_FIM, '==========');

  const func = await prisma.rhFuncionario.findUnique({
    where: { id: funcionarioId },
    select: {
      id: true,
      nome: true,
      dataAdmissao: true,
      dataGozoFerias: true,
      diasFeriasGozados: true,
      statusFerias: true,
      horarioEntrada: true,
      horarioSaida: true,
      escala: true,
      diasFolga: true,
      domingoFolga: true,
    },
  });
  console.log('ficha:', json(func));

  const dataIni = new Date(`${DATA_INI}T00:00:00.000Z`);
  const dataFimExcl = new Date(`${DATA_FIM}T00:00:00.000Z`);
  dataFimExcl.setUTCDate(dataFimExcl.getUTCDate() + 1);

  const [vigencias, ocorrencias, registros] = await Promise.all([
    prisma.rhEscalaVigencia.findMany({
      where: {
        funcionarioId,
        vigenciaInicio: { lt: dataFimExcl },
        OR: [{ vigenciaFim: null }, { vigenciaFim: { gte: dataIni } }],
      },
      orderBy: { vigenciaInicio: 'asc' },
    }),
    prisma.rhOcorrencia.findMany({
      where: {
        funcionarioId,
        ativo: true,
        OR: [
          { data: { gte: dataIni, lt: dataFimExcl } },
          {
            dataInicioAfastamento: { lt: dataFimExcl },
            OR: [{ dataFimAfastamento: null }, { dataFimAfastamento: { gte: dataIni } }],
          },
        ],
      },
    }),
    prisma.pontoRegistro.findMany({
      where: { funcionarioId, data: { gte: dataIni, lt: dataFimExcl } },
      orderBy: { data: 'asc' },
    }),
  ]);

  console.log('vigências no período:', vigencias.length);
  for (const v of vigencias) {
    console.log(
      json({
        id: v.id,
        vigenciaInicio: v.vigenciaInicio.toISOString().slice(0, 10),
        vigenciaFim: v.vigenciaFim ? v.vigenciaFim.toISOString().slice(0, 10) : null,
        horarioEntrada: v.horarioEntrada,
        horarioSaida: v.horarioSaida,
        escala: v.escala,
        diasFolga: v.diasFolga,
        domingoFolga: v.domingoFolga,
      }),
    );
  }
  console.log('ocorrencias:', ocorrencias.length, 'registros ponto:', registros.length);

  const registrosPorDia = new Map<string, (typeof registros)[number]>();
  for (const r of registros) {
    registrosPorDia.set(r.data.toISOString().slice(0, 10), r);
  }

  let totalRelogio = 0;
  let totalConsiderados = 0;
  const statusCount: Record<string, number> = {};

  console.log('\nymd | slots | vigencia | ehFolga | status | relogio | considerados');
  let cur = DATA_INI;
  while (cur <= DATA_FIM) {
    const data = ymdToUtcDate(cur);
    const vig = vigenciasParaData(vigencias, cur);
    const reg = registrosPorDia.get(cur) ?? null;
    const ehFolga = vig ? escalaEhFolgaNoDia(vig, data) : false;
    const dia = calcularAdicionalNoturnoDia({
      batidas: reg ?? {},
      horarioEntrada: vig?.horarioEntrada ?? '08:00',
      horarioSaida: vig?.horarioSaida ?? '17:00',
      ehFolga,
    });
    statusCount[dia.status] = (statusCount[dia.status] ?? 0) + 1;
    if (dia.status === 'OK' || dia.status === 'FOLGA_TRABALHADA') {
      totalRelogio += dia.minutosRelogio;
      totalConsiderados += dia.minutosConsiderados;
    }
    const vigLabel = vig
      ? `${vig.id.slice(0, 8)}… ${vig.horarioEntrada}–${vig.horarioSaida} (${vig.escala})`
      : 'SEM VIGÊNCIA';
    console.log(
      `${cur} | ${slots(reg)} | ${vigLabel} | folga=${ehFolga} | ${dia.status} | ${dia.minutosRelogio} | ${dia.minutosConsiderados}`,
    );
    cur = addDaysYmd(cur, 1);
  }

  const periodo = calcularAdicionalNoturnoPeriodo({
    dataInicialYmd: DATA_INI,
    dataFinalYmd: DATA_FIM,
    dataAdmissao: func?.dataAdmissao,
    dataGozoFerias: func?.dataGozoFerias,
    diasFeriasGozados: func?.diasFeriasGozados,
    statusFerias: func?.statusFerias,
    vigencias,
    ocorrencias,
    registros,
  });

  console.log('\nstatusCount:', json(statusCount));
  console.log('total relogio (OK + FOLGA_TRABALHADA):', totalRelogio);
  console.log('total considerados (OK + FOLGA_TRABALHADA):', totalConsiderados);
  console.log('calcularAdicionalNoturnoPeriodo:', json(periodo));
  console.log('gravado na linha (ainda a regra antiga, sem regerar):', json(gravado));

  const pend = registrosPorDia.get('2026-10-07');
  if (pend && vigencias.length > 0) {
    const vig = vigenciasParaData(vigencias, '2026-10-07') ?? vigencias[0];
    const hipotese = (saida2: string) =>
      calcularAdicionalNoturnoDia({
        batidas: {
          entrada1: pend.entrada1,
          saida1: pend.saida1,
          entrada2: pend.entrada2,
          saida2,
          entrada3: pend.entrada3,
          saida3: pend.saida3,
        },
        horarioEntrada: vig.horarioEntrada,
        horarioSaida: vig.horarioSaida,
        ehFolga: false,
      });
    const h0000 = hipotese('00:00');
    const h0015 = hipotese('00:15');
    console.log('\n--- 07/10 PENDENCIA (slots reais:', slots(pend), ') ---');
    console.log('atual (ímpar): 0 relógio / 0 considerados — não entra no total');
    console.log(
      `se saida2=00:00: ${h0000.minutosRelogio} relógio / ${h0000.minutosConsiderados} considerados (${h0000.status})`,
    );
    console.log(
      `se saida2=00:15 (padrão 08/10): ${h0015.minutosRelogio} relógio / ${h0015.minutosConsiderados} considerados (${h0015.status})`,
    );
  }
}

async function item4(funcionarioIds: string[]) {
  console.log('\n========== 4. VIGÊNCIAS vs FICHA (29 funcionários) ==========');
  const dataIni = new Date(`${DATA_INI}T00:00:00.000Z`);
  const dataFimExcl = new Date(`${DATA_FIM}T00:00:00.000Z`);
  dataFimExcl.setUTCDate(dataFimExcl.getUTCDate() + 1);

  const [funcs, vigencias] = await Promise.all([
    prisma.rhFuncionario.findMany({
      where: { id: { in: funcionarioIds } },
      select: {
        id: true,
        nome: true,
        horarioEntrada: true,
        horarioSaida: true,
        escala: true,
      },
    }),
    prisma.rhEscalaVigencia.findMany({
      where: {
        funcionarioId: { in: funcionarioIds },
        vigenciaInicio: { lt: dataFimExcl },
        OR: [{ vigenciaFim: null }, { vigenciaFim: { gte: dataIni } }],
      },
    }),
  ]);

  const vigPorFunc = new Map<string, typeof vigencias>();
  for (const v of vigencias) {
    const list = vigPorFunc.get(v.funcionarioId) ?? [];
    list.push(v);
    vigPorFunc.set(v.funcionarioId, list);
  }

  let comVigencia = 0;
  let semVigencia = 0;
  let default0817 = 0;
  let bateComFicha = 0;
  let divergeFicha = 0;
  const divergencias: unknown[] = [];
  const defaults: unknown[] = [];

  for (const f of funcs) {
    const list = vigPorFunc.get(f.id) ?? [];
    if (list.length === 0) {
      semVigencia++;
      continue;
    }
    comVigencia++;
    // vigência vigente no fim do período (ou a que cobre mais)
    const cobrindo = vigenciasParaData(list, DATA_FIM) ?? list[list.length - 1];
    const isDefault = cobrindo.horarioEntrada === '08:00' && cobrindo.horarioSaida === '17:00';
    if (isDefault) {
      default0817++;
      defaults.push({
        nome: f.nome,
        vig: `${cobrindo.horarioEntrada}–${cobrindo.horarioSaida}`,
        ficha: `${f.horarioEntrada}–${f.horarioSaida}`,
      });
    }
    const bate =
      cobrindo.horarioEntrada === f.horarioEntrada && cobrindo.horarioSaida === f.horarioSaida;
    if (bate) bateComFicha++;
    else {
      divergeFicha++;
      divergencias.push({
        nome: f.nome,
        vig: `${cobrindo.horarioEntrada}–${cobrindo.horarioSaida} (${cobrindo.escala})`,
        ficha: `${f.horarioEntrada}–${f.horarioSaida} (${f.escala})`,
      });
    }
  }

  console.log(
    json({
      funcionarios: funcs.length,
      comVigenciaCobrindoPeriodo: comVigencia,
      semVigencia: semVigencia,
      vigenciaDefault_08_17: default0817,
      vigenciaBateComFicha: bateComFicha,
      vigenciaDivergeDaFicha: divergeFicha,
    }),
  );
  console.log('\nquem está 08:00–17:00 na vigência:');
  console.log(json(defaults));
  console.log('\ndivergências vigência × ficha:');
  console.log(json(divergencias));
}

async function main() {
  const r = await item1();
  if (!r) return;
  const ids = r.linhas.map((l) => l.funcionarioId);
  if (r.adriana) {
    await item3(r.adriana.funcionarioId, r.adriana.funcionario.nome, r.adriana.adicionalNoturno);
  } else {
    console.log(`\n[3] ${NOME_ALVO} não está nas linhas do fechamento — pulando dia a dia`);
  }
  if (!process.argv[2]) await item4(ids);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
