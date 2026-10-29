import { prisma } from '@/lib/prisma';
import { periodoFechamentoPonto } from '@/lib/ponto-periodo';
import { Decimal } from '@prisma/client/runtime/library';
import { calcularFaltasEDsrPeriodo } from '@/lib/pontos/fechamento-faltas';
import {
  calcularAdicionalNoturnoPeriodo,
  diasDivergentesNoturno,
  formatarDiferencaHhMm,
} from '@/lib/pontos/fechamento-adicional-noturno';
import { addDaysYmd, minutosParaHhMm, ymdToUtcDate } from '@/lib/pontos/escala-dia';
import {
  notTotPorDiaMap,
  parsearLinhasCalcular,
  parsearTotaisCalcular,
  type BatidasTratadasDia,
  type SecullumCalcularBody,
  type SecullumTotais,
} from '@/lib/pontos/secullum-calcular';

const CALC_URL = 'https://pontowebintegracaoexterna.secullum.com.br/IntegracaoExterna/Calcular';
const CALL_DELAY_MS = 500;
const BATCH_SIZE = 90;
const BATCH_DELAY_MS = 65_000;
const LOG_FUNC_NOME = 'ADRIANA';

type CalcCompleto = {
  totais: SecullumTotais;
  linhas: BatidasTratadasDia[];
};

const calcCache = new Map<string, CalcCompleto>();
let lastCallTs = 0;
let quotaRestante: number | null = null;
let quotaLimite: number | null = null;
let quotaResetEm: string | null = null;

function capturarQuotaHeaders(headers: Headers) {
  const r = headers.get('X-RateLimit-Remaining') ?? headers.get('RateLimit-Remaining');
  const l = headers.get('X-RateLimit-Limit') ?? headers.get('RateLimit-Limit');
  const t =
    headers.get('X-RateLimit-Reset') ?? headers.get('RateLimit-Reset') ?? headers.get('Retry-After');
  if (r !== null) quotaRestante = Number(r);
  if (l !== null) quotaLimite = Number(l);
  if (t !== null) quotaResetEm = t;
}

function limparCacheCalc() {
  calcCache.clear();
  lastCallTs = 0;
  quotaRestante = null;
  quotaLimite = null;
  quotaResetEm = null;
}

function normalizeHhMm(raw: string | null | undefined): string {
  if (!raw) return '';
  const t = raw.trim();
  const m = /^(\d{1,3}):(\d{2})$/.exec(t);
  if (!m) return t;
  return `${String(Number(m[1])).padStart(2, '0')}:${m[2]}`;
}

function ymdToDdMm(ymd: string): string {
  const [, m, d] = ymd.split('-');
  return `${d}/${m}`;
}

async function obterTokenSecullum(): Promise<{ token: string; bancoid: string }> {
  const user = process.env.SECULLUM_API_USER ?? process.env.SECULLUM_USER ?? '';
  const pass = process.env.SECULLUM_API_PASS ?? process.env.SECULLUM_PASS ?? '';
  const bancoid = process.env.SECULLUM_BANCO_ID ?? '';
  if (!user || !pass) throw new Error('SECULLUM_API_USER/SECULLUM_API_PASS não configuradas');

  const body = new URLSearchParams({
    grant_type: 'password',
    username: user,
    password: pass,
    client_id: '3',
  });
  const res = await fetch('https://autenticador.secullum.com.br/Token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Falha ao autenticar no Secullum (${res.status}): ${txt}`);
  }
  const data = await res.json();
  const token = data.access_token as string;
  if (!token) throw new Error('Token não encontrado na resposta do Secullum');
  return { token, bancoid };
}

async function calcularFuncionario(
  token: string,
  bancoid: string,
  pis: string,
  dataInicial: string,
  dataFinal: string,
  nomeParaLog?: string,
): Promise<CalcCompleto> {
  const cacheKey = `${pis}|${dataInicial}|${dataFinal}`;
  const cached = calcCache.get(cacheKey);
  if (cached) return cached;

  const gap = CALL_DELAY_MS - (Date.now() - lastCallTs);
  if (gap > 0) await new Promise((r) => setTimeout(r, gap));

  lastCallTs = Date.now();
  const res = await fetch(CALC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      secullumidbancoselecionado: bancoid,
    },
    body: JSON.stringify({ FuncionarioPis: pis, DataInicial: dataInicial, DataFinal: dataFinal }),
  });

  capturarQuotaHeaders(res.headers);

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 300)}`);
  }

  const data = (await res.json()) as SecullumCalcularBody;

  if (LOG_FUNC_NOME && nomeParaLog?.toUpperCase().includes(LOG_FUNC_NOME)) {
    console.log(
      `[Secullum/Calcular LOG] Funcionário: ${nomeParaLog} | PIS: ${pis}\n` +
        `  Período: ${dataInicial} → ${dataFinal}\n` +
        `  Colunas: ${JSON.stringify(data?.Colunas)}\n` +
        `  Totais:  ${JSON.stringify(data?.Totais)}`,
    );
  }

  const result: CalcCompleto = {
    totais: parsearTotaisCalcular(data),
    linhas: parsearLinhasCalcular(data),
  };
  calcCache.set(cacheKey, result);
  return result;
}

function registrosDeLinhas(linhas: BatidasTratadasDia[]) {
  return linhas.map((l) => ({
    data: ymdToUtcDate(l.ymd),
    entrada1: l.entrada1 ?? null,
    saida1: l.saida1 ?? null,
    entrada2: l.entrada2 ?? null,
    saida2: l.saida2 ?? null,
    entrada3: l.entrada3 ?? null,
    saida3: l.saida3 ?? null,
    entrada4: l.entrada4 ?? null,
    saida4: l.saida4 ?? null,
    entrada5: l.entrada5 ?? null,
    saida5: l.saida5 ?? null,
  }));
}

export type ComparacaoAdicionalNoturno = {
  nome: string;
  platefull: string;
  secullum: string | null;
  diferenca: string;
  diasDivergentes: Array<{
    ymd: string;
    platefull: string;
    secullum: string;
  }>;
};

export type ResultadoGeracaoFechamento = {
  fechamentoId: string;
  periodo: { dataInicial: string; dataFinal: string };
  processados: number;
  comErro: number;
  funcionariosSemPis: number;
  semPis: Array<{ id: string; nome: string }>;
  secullumQuota: { restante: number | null; limite: number | null; resetEm: string | null };
  comparacaoAdicionalNoturno: ComparacaoAdicionalNoturno[];
};

export async function executarGeracaoFechamento(opts: {
  userId: string;
  mes: number;
  ano: number;
}): Promise<ResultadoGeracaoFechamento> {
  const { userId, mes, ano } = opts;
  const { dataInicial, dataFinal } = periodoFechamentoPonto(mes, ano);
  const dataIni = ymdToUtcDate(dataInicial);
  const dataFimExcl = ymdToUtcDate(addDaysYmd(dataFinal, 1));

  const fechamento = await prisma.fechamentoMensal.upsert({
    where: { mes_ano: { mes, ano } },
    create: { mes, ano, status: 'rascunho' },
    update: { updatedAt: new Date() },
  });

  const funcionarios = await prisma.rhFuncionario.findMany({
    where: {
      userId,
      ativo: true,
      numeroFolha: { not: null },
      pisSecullum: { not: null },
    },
    select: {
      id: true,
      nome: true,
      pisSecullum: true,
      valorVT: true,
      dataAdmissao: true,
      dataGozoFerias: true,
      diasFeriasGozados: true,
      statusFerias: true,
    },
  });

  const semPis = await prisma.rhFuncionario.findMany({
    where: { userId, ativo: true, numeroFolha: { not: null }, pisSecullum: null },
    select: { id: true, nome: true },
  });

  const funcionarioIds = funcionarios.map((f) => f.id);

  const [vigencias, ocorrencias, registros] = await Promise.all([
    funcionarioIds.length === 0
      ? Promise.resolve([])
      : prisma.rhEscalaVigencia.findMany({
          where: {
            funcionarioId: { in: funcionarioIds },
            vigenciaInicio: { lt: dataFimExcl },
            OR: [{ vigenciaFim: null }, { vigenciaFim: { gte: dataIni } }],
          },
        }),
    funcionarioIds.length === 0
      ? Promise.resolve([])
      : prisma.rhOcorrencia.findMany({
          where: {
            funcionarioId: { in: funcionarioIds },
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
    funcionarioIds.length === 0
      ? Promise.resolve([])
      : prisma.pontoRegistro.findMany({
          where: {
            funcionarioId: { in: funcionarioIds },
            data: { gte: dataIni, lt: dataFimExcl },
          },
        }),
  ]);

  const vigPorFunc = new Map<string, typeof vigencias>();
  for (const v of vigencias) {
    const list = vigPorFunc.get(v.funcionarioId) ?? [];
    list.push(v);
    vigPorFunc.set(v.funcionarioId, list);
  }
  const ocPorFunc = new Map<string, typeof ocorrencias>();
  for (const o of ocorrencias) {
    const list = ocPorFunc.get(o.funcionarioId) ?? [];
    list.push(o);
    ocPorFunc.set(o.funcionarioId, list);
  }
  const regPorFunc = new Map<string, typeof registros>();
  for (const r of registros) {
    const list = regPorFunc.get(r.funcionarioId) ?? [];
    list.push(r);
    regPorFunc.set(r.funcionarioId, list);
  }

  limparCacheCalc();

  let processados = 0;
  let comErro = 0;
  const comparacaoAdicionalNoturno: ComparacaoAdicionalNoturno[] = [];

  const auth = await obterTokenSecullum();
  const { token, bancoid } = auth;

  const linhasExistentes = await prisma.fechamentoLinha.findMany({
    where: { fechamentoId: fechamento.id },
    select: {
      funcionarioId: true,
      ex60: true,
      ex100: true,
      en60: true,
      en100: true,
      atraso: true,
      faltasSecullum: true,
      faltaDsrSecullum: true,
      adicionalNoturnoSecullum: true,
    },
  });
  const linhaAnteriorPorFunc = new Map(linhasExistentes.map((l) => [l.funcionarioId, l]));

  for (let i = 0; i < funcionarios.length; i += BATCH_SIZE) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }

    const lote = funcionarios.slice(i, i + BATCH_SIZE);

    for (const func of lote) {
      let camposSec: Partial<SecullumTotais> = {};
      let linhasTratadas: BatidasTratadasDia[] = [];
      let origemErro: string | null = null;
      let secullumOk = false;

      try {
        const calc = await calcularFuncionario(
          token,
          bancoid,
          func.pisSecullum!,
          dataInicial,
          dataFinal,
          func.nome,
        );
        camposSec = calc.totais;
        linhasTratadas = calc.linhas;
        secullumOk = true;
        processados++;
      } catch (calcErr: unknown) {
        origemErro = calcErr instanceof Error ? calcErr.message : 'Erro desconhecido';
        comErro++;
      }

      const funcVigencias = vigPorFunc.get(func.id) ?? [];
      const registrosBrutos = regPorFunc.get(func.id) ?? [];
      const registrosAd = secullumOk ? registrosDeLinhas(linhasTratadas) : registrosBrutos;

      const baseOpts = {
        dataInicialYmd: dataInicial,
        dataFinalYmd: dataFinal,
        dataAdmissao: func.dataAdmissao,
        dataGozoFerias: func.dataGozoFerias,
        diasFeriasGozados: func.diasFeriasGozados,
        statusFerias: func.statusFerias,
        vigencias: funcVigencias,
        ocorrencias: ocPorFunc.get(func.id) ?? [],
      };

      const platefull = calcularFaltasEDsrPeriodo({ ...baseOpts, registros: registrosBrutos });
      const adNoturno = calcularAdicionalNoturnoPeriodo({
        ...baseOpts,
        registros: registrosAd,
        notTotPorDia: secullumOk ? notTotPorDiaMap(linhasTratadas) : undefined,
      });

      const obsPlatefull = origemErro
        ? 'Erro de sincronização Secullum — valores anteriores preservados'
        : platefull.faltasDias > 0 || platefull.faltaDsrDias > 0
          ? `Platefull: ${platefull.faltasDias} falta(s), ${platefull.faltaDsrDias} DSR`
          : null;

      const obsFallback = !secullumOk
        ? 'Ad. noturno calculado com batidas brutas (Secullum indisponível)'
        : null;
      const obsFora = adNoturno.diasForaVinculo.length
        ? `Batidas fora do vínculo: ${adNoturno.diasForaVinculo.map(ymdToDdMm).join(', ')} (verificar admissão no RH)`
        : null;
      const obsAdNoturno = adNoturno.diasPendencia.length
        ? `Ad. noturno: ${adNoturno.diasPendencia.length} dia(s) com batida ímpar não computados (${adNoturno.diasPendencia.map(ymdToDdMm).join(', ')})`
        : null;
      const observacao =
        [obsPlatefull, obsFallback, obsFora, obsAdNoturno].filter(Boolean).join(' · ') || null;

      const anterior = linhaAnteriorPorFunc.get(func.id);
      const secEx60 = secullumOk ? normalizeHhMm(camposSec.ex60) || null : (anterior?.ex60 ?? null);
      const secEx100 = secullumOk
        ? normalizeHhMm(camposSec.ex100) || null
        : (anterior?.ex100 ?? null);
      const secEn60 = secullumOk ? normalizeHhMm(camposSec.en60) || null : (anterior?.en60 ?? null);
      const secEn100 = secullumOk
        ? normalizeHhMm(camposSec.en100) || null
        : (anterior?.en100 ?? null);
      const secAtraso = secullumOk
        ? normalizeHhMm(camposSec.atraso) || null
        : (anterior?.atraso ?? null);
      const secFaltas = secullumOk
        ? normalizeHhMm(camposSec.faltas) || null
        : (anterior?.faltasSecullum ?? null);
      const secFaltaDsr = secullumOk
        ? normalizeHhMm(camposSec.faltaDsr) || null
        : (anterior?.faltaDsrSecullum ?? null);
      const secNotTot = secullumOk
        ? normalizeHhMm(camposSec.notTot) || null
        : (anterior?.adicionalNoturnoSecullum ?? null);

      await prisma.fechamentoLinha.upsert({
        where: {
          fechamentoId_funcionarioId: { fechamentoId: fechamento.id, funcionarioId: func.id },
        },
        create: {
          fechamentoId: fechamento.id,
          funcionarioId: func.id,
          ex60: secEx60,
          ex100: secEx100,
          en60: secEn60,
          en100: secEn100,
          atraso: secAtraso,
          faltas: platefull.faltasHhMm,
          faltaDsr: platefull.faltaDsrHhMm,
          adicionalNoturno: adNoturno.adicionalNoturnoHhMm,
          adicionalNoturnoSecullum: secNotTot,
          faltasSecullum: secFaltas,
          faltaDsrSecullum: secFaltaDsr,
          valeTransporte: func.valorVT ? new Decimal(func.valorVT) : null,
          status: 'pendente',
          origemErro,
          observacao,
        },
        update: {
          ex60: secEx60,
          ex100: secEx100,
          en60: secEn60,
          en100: secEn100,
          atraso: secAtraso,
          faltas: platefull.faltasHhMm,
          faltaDsr: platefull.faltaDsrHhMm,
          adicionalNoturno: adNoturno.adicionalNoturnoHhMm,
          adicionalNoturnoSecullum: secNotTot,
          faltasSecullum: secFaltas,
          faltaDsrSecullum: secFaltaDsr,
          valeTransporte: func.valorVT ? new Decimal(func.valorVT) : null,
          status: 'pendente',
          origemErro,
          observacao,
        },
      });

      comparacaoAdicionalNoturno.push({
        nome: func.nome,
        platefull: adNoturno.adicionalNoturnoHhMm,
        secullum: secNotTot,
        diferenca: formatarDiferencaHhMm(adNoturno.adicionalNoturnoHhMm, secNotTot),
        diasDivergentes: diasDivergentesNoturno(adNoturno.dias).map((d) => ({
          ymd: d.ymd,
          platefull: minutosParaHhMm(d.minutosPlatefull),
          secullum: minutosParaHhMm(d.notTotSecullumMinutos),
        })),
      });
    }
  }

  const linhasInativas = await prisma.fechamentoLinha.findMany({
    where: { fechamentoId: fechamento.id, funcionario: { ativo: false } },
    select: { id: true, funcionarioId: true },
  });
  if (linhasInativas.length > 0) {
    const idsInativos = linhasInativas.map((l) => l.funcionarioId);
    const comBatida = await prisma.pontoRegistro.findMany({
      where: {
        funcionarioId: { in: idsInativos },
        data: { gte: dataIni, lt: dataFimExcl },
      },
      select: { funcionarioId: true },
      distinct: ['funcionarioId'],
    });
    const comBatidaSet = new Set(comBatida.map((r) => r.funcionarioId));
    const removerIds = linhasInativas
      .filter((l) => !comBatidaSet.has(l.funcionarioId))
      .map((l) => l.id);
    if (removerIds.length > 0) {
      await prisma.fechamentoLinha.deleteMany({ where: { id: { in: removerIds } } });
    }
  }

  const quotaSnapshot = { restante: quotaRestante, limite: quotaLimite, resetEm: quotaResetEm };
  limparCacheCalc();

  return {
    fechamentoId: fechamento.id,
    periodo: { dataInicial, dataFinal },
    processados,
    comErro,
    funcionariosSemPis: semPis.length,
    semPis,
    secullumQuota: quotaSnapshot,
    comparacaoAdicionalNoturno,
  };
}
