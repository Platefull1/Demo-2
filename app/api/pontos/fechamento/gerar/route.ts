import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { periodoFechamentoPonto } from '@/lib/ponto-periodo';
import { Decimal } from '@prisma/client/runtime/library';
import { calcularFaltasEDsrPeriodo } from '@/lib/pontos/fechamento-faltas';
import { ymdToUtcDate, addDaysYmd } from '@/lib/pontos/escala-dia';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

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

interface SecullumCalcResult {
  ex60: string;
  ex100: string;
  en60: string;
  en100: string;
  atraso: string;
  faltas: string;
  faltaDsr: string;
}

const COLUNA_MAP: Record<keyof SecullumCalcResult, string[]> = {
  ex60: ['ex 60', 'ex60', 'he 60% diurna', 'he60% diurna', 'he 60'],
  ex100: ['ex 100', 'ex100', 'he 100% diurna', 'he100% diurna', 'he 100'],
  en60: ['en 60', 'en60', 'he 60% noturna', 'he60% noturna', 'en60% noturna'],
  en100: ['en 100', 'en100', 'he 100% noturna', 'he100% noturna', 'en100% noturna'],
  atraso: ['atras', 'atraso'],
  faltas: ['faltas', 'horas faltas', 'falta hora'],
  faltaDsr: ['dsr', 'falta dsr', 'horas falta dsr'],
};

function encontrarIndice(colunas: string[], termos: string[]): number {
  for (let i = 0; i < colunas.length; i++) {
    const col = colunas[i].toLowerCase().trim();
    for (const t of termos) {
      if (col.includes(t.toLowerCase())) return i;
    }
  }
  return -1;
}

function parsearResposta(data: { Colunas?: string[]; Totais?: string[] }): SecullumCalcResult {
  const colunas: string[] = data.Colunas ?? [];
  const totais: string[]  = data.Totais  ?? [];
  const get = (campo: keyof SecullumCalcResult): string => {
    const idx = encontrarIndice(colunas, COLUNA_MAP[campo]);
    if (idx === -1) return '';
    return (totais[idx] ?? '').toString().trim();
  };
  return {
    ex60: get('ex60'), ex100: get('ex100'),
    en60: get('en60'), en100: get('en100'),
    atraso: get('atraso'), faltas: get('faltas'), faltaDsr: get('faltaDsr'),
  };
}

// ─── Secullum client — sem retry, fast-fail em 429 ───────────────────────────
// Limite: 100 req/hora por banco (mensagem da API).
// Estratégias:
//   1. Cache por run  – evita repetir (pis, ini, fim) dentro da mesma geração.
//   2. Delay de 500ms – cortesia entre chamadas (22 func × 500ms ≈ 11s por geração).
//   3. Fast-fail 429  – lança erro imediatamente; o chamador preserva a linha anterior.
//   4. Quota tracking – captura X-RateLimit-Remaining de cada resposta.

const CALC_URL       = 'https://pontowebintegracaoexterna.secullum.com.br/IntegracaoExterna/Calcular';
const CALL_DELAY_MS  = 500; // delay mínimo entre chamadas reais

const calcCache  = new Map<string, SecullumCalcResult>();
let   lastCallTs = 0;
// Quota vista na última chamada bem-sucedida OU 429 (atualizada pelo caller)
let   quotaRestante: number | null = null;
let   quotaLimite:   number | null = null;
let   quotaResetEm:  string | null = null;

function capturarQuotaHeaders(headers: Headers) {
  const r = headers.get('X-RateLimit-Remaining') ?? headers.get('RateLimit-Remaining');
  const l = headers.get('X-RateLimit-Limit')     ?? headers.get('RateLimit-Limit');
  const t = headers.get('X-RateLimit-Reset')     ?? headers.get('RateLimit-Reset') ?? headers.get('Retry-After');
  if (r !== null) quotaRestante = Number(r);
  if (l !== null) quotaLimite   = Number(l);
  if (t !== null) quotaResetEm  = t;
}

async function calcularFuncionario(
  token: string,
  bancoid: string,
  pis: string,
  dataInicial: string,
  dataFinal: string,
): Promise<SecullumCalcResult> {
  const cacheKey = `${pis}|${dataInicial}|${dataFinal}`;
  const cached = calcCache.get(cacheKey);
  if (cached) return cached;

  const gap = CALL_DELAY_MS - (Date.now() - lastCallTs);
  if (gap > 0) await new Promise(r => setTimeout(r, gap));

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

  // Captura quota independentemente do status
  capturarQuotaHeaders(res.headers);

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 300)}`);
  }

  const data = await res.json();
  const result = parsearResposta(data);
  calcCache.set(cacheKey, result);
  return result;
}

function limparCacheCalc() {
  calcCache.clear();
  lastCallTs = 0;
  quotaRestante = null;
  quotaLimite   = null;
  quotaResetEm  = null;
}

const BATCH_SIZE     = 90;
const BATCH_DELAY_MS = 65_000;

function normalizeHhMm(raw: string | null | undefined): string {
  if (!raw) return '';
  const t = raw.trim();
  const m = /^(\d{1,3}):(\d{2})$/.exec(t);
  if (!m) return t;
  return `${String(Number(m[1])).padStart(2, '0')}:${m[2]}`;
}

export async function POST(req: NextRequest) {
  const { ctx, error } = await requireRhPermission(P.EMPLOYEES_VIEW);
  if (error) return error;

  let body: { mes?: number; ano?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload JSON inválido' }, { status: 400 });
  }

  const mes = Number(body.mes);
  const ano = Number(body.ano);
  if (!mes || mes < 1 || mes > 12 || !ano || ano < 2000) {
    return NextResponse.json(
      { error: 'mes (1-12) e ano são obrigatórios e devem ser válidos' },
      { status: 400 },
    );
  }

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
      userId: ctx.userId,
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
    where: { userId: ctx.userId, ativo: true, numeroFolha: { not: null }, pisSecullum: null },
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
                OR: [
                  { dataFimAfastamento: null },
                  { dataFimAfastamento: { gte: dataIni } },
                ],
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

  // Limpa cache do run anterior (instâncias Next.js longas reutilizam a closure)
  limparCacheCalc();

  let processados = 0;
  let comErro = 0;

  let token = '';
  let bancoid = '';
  try {
    const auth = await obterTokenSecullum();
    token = auth.token;
    bancoid = auth.bancoid;
  } catch (authErr: unknown) {
    const msg = authErr instanceof Error ? authErr.message : 'erro';
    return NextResponse.json(
      { error: `Falha na autenticação Secullum: ${msg}` },
      { status: 502 },
    );
  }

  // Pré-carregar linhas existentes para preservar valores quando Secullum falhar
  const linhasExistentes = await prisma.fechamentoLinha.findMany({
    where: { fechamentoId: fechamento.id },
    select: {
      funcionarioId: true,
      ex60: true, ex100: true, en60: true, en100: true,
      atraso: true, faltasSecullum: true, faltaDsrSecullum: true,
    },
  });
  const linhaAnteriorPorFunc = new Map(linhasExistentes.map(l => [l.funcionarioId, l]));

  for (let i = 0; i < funcionarios.length; i += BATCH_SIZE) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }

    const lote = funcionarios.slice(i, i + BATCH_SIZE);

    for (const func of lote) {
      let camposSec: Partial<SecullumCalcResult> = {};
      let origemErro: string | null = null;
      let secullumOk = false;

      try {
        camposSec = await calcularFuncionario(
          token, bancoid, func.pisSecullum!, dataInicial, dataFinal,
        );
        secullumOk = true;
        processados++;
      } catch (calcErr: unknown) {
        origemErro = calcErr instanceof Error ? calcErr.message : 'Erro desconhecido';
        comErro++;
        // Preservar valores Secullum anteriores — não sobrescrever com nulo
        const anterior = linhaAnteriorPorFunc.get(func.id);
        if (anterior) {
          camposSec = {
            ex60:  anterior.ex60  ?? undefined,
            ex100: anterior.ex100 ?? undefined,
            en60:  anterior.en60  ?? undefined,
            en100: anterior.en100 ?? undefined,
            atraso: anterior.atraso ?? undefined,
            // faltas/faltaDsr do Secullum também preservados para a coluna Sec:
            faltas:    anterior.faltasSecullum    ?? undefined,
            faltaDsr:  anterior.faltaDsrSecullum  ?? undefined,
          };
        }
      }

      const funcVigencias = vigPorFunc.get(func.id) ?? [];

      const platefull = calcularFaltasEDsrPeriodo({
        dataInicialYmd: dataInicial,
        dataFinalYmd: dataFinal,
        dataAdmissao: func.dataAdmissao,
        dataGozoFerias: func.dataGozoFerias,
        diasFeriasGozados: func.diasFeriasGozados,
        statusFerias: func.statusFerias,
        vigencias: funcVigencias,
        ocorrencias: ocPorFunc.get(func.id) ?? [],
        registros: regPorFunc.get(func.id) ?? [],
      });

      // SEM_REGISTRO: dias sem batida ficam com status SEM_REGISTRO e faltas = 00:00.
      // Não há chamada dia-a-dia; a coluna "Sec:" mostra o total do período como referência.

      const obsPlatefull = origemErro
        ? 'Erro de sincronização Secullum — valores anteriores preservados'
        : platefull.faltasDias > 0 || platefull.faltaDsrDias > 0
        ? `Platefull: ${platefull.faltasDias} falta(s), ${platefull.faltaDsrDias} DSR`
        : null;

      // Campos Secullum: usar valor atual se Secullum OK; caso contrário manter o que existia
      const anterior   = linhaAnteriorPorFunc.get(func.id);
      const secEx60    = secullumOk ? (camposSec.ex60   ?? null) : (anterior?.ex60   ?? null);
      const secEx100   = secullumOk ? (camposSec.ex100  ?? null) : (anterior?.ex100  ?? null);
      const secEn60    = secullumOk ? (camposSec.en60   ?? null) : (anterior?.en60   ?? null);
      const secEn100   = secullumOk ? (camposSec.en100  ?? null) : (anterior?.en100  ?? null);
      const secAtraso  = secullumOk ? (camposSec.atraso ?? null) : (anterior?.atraso ?? null);
      const secFaltas    = secullumOk ? (normalizeHhMm(camposSec.faltas)   || null) : (anterior?.faltasSecullum   ?? null);
      const secFaltaDsr  = secullumOk ? (normalizeHhMm(camposSec.faltaDsr) || null) : (anterior?.faltaDsrSecullum ?? null);

      await prisma.fechamentoLinha.upsert({
        where: {
          fechamentoId_funcionarioId: { fechamentoId: fechamento.id, funcionarioId: func.id },
        },
        create: {
          fechamentoId: fechamento.id,
          funcionarioId: func.id,
          ex60: secEx60, ex100: secEx100, en60: secEn60, en100: secEn100,
          atraso: secAtraso,
          faltas:    platefull.faltasHhMm,
          faltaDsr:  platefull.faltaDsrHhMm,
          faltasSecullum:   secFaltas,
          faltaDsrSecullum: secFaltaDsr,
          valeTransporte: func.valorVT ? new Decimal(func.valorVT) : null,
          status: 'pendente',
          origemErro,
          observacao: obsPlatefull,
        },
        update: {
          ex60: secEx60, ex100: secEx100, en60: secEn60, en100: secEn100,
          atraso: secAtraso,
          faltas:    platefull.faltasHhMm,
          faltaDsr:  platefull.faltaDsrHhMm,
          faltasSecullum:   secFaltas,
          faltaDsrSecullum: secFaltaDsr,
          valeTransporte: func.valorVT ? new Decimal(func.valorVT) : null,
          status: 'pendente',
          origemErro,
          observacao: obsPlatefull,
        },
      });
    }
  }

  const quotaSnapshot = { restante: quotaRestante, limite: quotaLimite, resetEm: quotaResetEm };
  limparCacheCalc(); // Libera memória ao fim do run

  return NextResponse.json({
    fechamentoId: fechamento.id,
    periodo: { dataInicial, dataFinal },
    processados,
    comErro,
    funcionariosSemPis: semPis.length,
    semPis,
    // Quota Secullum vista na última chamada (null se a API não retornar os headers)
    secullumQuota: quotaSnapshot,
  });
}
