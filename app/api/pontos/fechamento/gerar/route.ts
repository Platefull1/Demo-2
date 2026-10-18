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

async function calcularFuncionario(
  token: string,
  bancoid: string,
  pis: string,
  dataInicial: string,
  dataFinal: string,
): Promise<SecullumCalcResult> {
  const res = await fetch(
    'https://pontowebintegracaoexterna.secullum.com.br/IntegracaoExterna/Calcular',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        secullumidbancoselecionado: bancoid,
      },
      body: JSON.stringify({
        FuncionarioPis: pis,
        DataInicial: dataInicial,
        DataFinal: dataFinal,
      }),
    },
  );

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = await res.json();
  const colunas: string[] = data.Colunas ?? [];
  const totais: string[] = data.Totais ?? [];

  const get = (campo: keyof SecullumCalcResult): string => {
    const idx = encontrarIndice(colunas, COLUNA_MAP[campo]);
    if (idx === -1) return '';
    return (totais[idx] ?? '').toString().trim();
  };

  return {
    ex60: get('ex60'),
    ex100: get('ex100'),
    en60: get('en60'),
    en100: get('en100'),
    atraso: get('atraso'),
    faltas: get('faltas'),
    faltaDsr: get('faltaDsr'),
  };
}

const BATCH_SIZE = 90;
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

  for (let i = 0; i < funcionarios.length; i += BATCH_SIZE) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }

    const lote = funcionarios.slice(i, i + BATCH_SIZE);

    for (const func of lote) {
      let camposSec: Partial<SecullumCalcResult> = {};
      let origemErro: string | null = null;

      try {
        camposSec = await calcularFuncionario(
          token,
          bancoid,
          func.pisSecullum!,
          dataInicial,
          dataFinal,
        );
        processados++;
      } catch (calcErr: unknown) {
        origemErro = calcErr instanceof Error ? calcErr.message : 'Erro desconhecido';
        comErro++;
      }

      const platefull = calcularFaltasEDsrPeriodo({
        dataInicialYmd: dataInicial,
        dataFinalYmd: dataFinal,
        dataAdmissao: func.dataAdmissao,
        dataGozoFerias: func.dataGozoFerias,
        diasFeriasGozados: func.diasFeriasGozados,
        statusFerias: func.statusFerias,
        vigencias: vigPorFunc.get(func.id) ?? [],
        ocorrencias: ocPorFunc.get(func.id) ?? [],
        registros: regPorFunc.get(func.id) ?? [],
      });

      const obsPlatefull =
        platefull.faltasDias > 0 || platefull.faltaDsrDias > 0
          ? `Platefull: ${platefull.faltasDias} falta(s), ${platefull.faltaDsrDias} DSR`
          : null;

      await prisma.fechamentoLinha.upsert({
        where: {
          fechamentoId_funcionarioId: { fechamentoId: fechamento.id, funcionarioId: func.id },
        },
        create: {
          fechamentoId: fechamento.id,
          funcionarioId: func.id,
          ex60: camposSec.ex60 ?? null,
          ex100: camposSec.ex100 ?? null,
          en60: camposSec.en60 ?? null,
          en100: camposSec.en100 ?? null,
          atraso: camposSec.atraso ?? null,
          // Platefull pré-preenche faltas / DSR
          faltas: platefull.faltasHhMm,
          faltaDsr: platefull.faltaDsrHhMm,
          faltasSecullum: normalizeHhMm(camposSec.faltas) || null,
          faltaDsrSecullum: normalizeHhMm(camposSec.faltaDsr) || null,
          valeTransporte: func.valorVT ? new Decimal(func.valorVT) : null,
          status: 'pendente',
          origemErro,
          observacao: obsPlatefull,
        },
        update: {
          ex60: camposSec.ex60 ?? null,
          ex100: camposSec.ex100 ?? null,
          en60: camposSec.en60 ?? null,
          en100: camposSec.en100 ?? null,
          atraso: camposSec.atraso ?? null,
          faltas: platefull.faltasHhMm,
          faltaDsr: platefull.faltaDsrHhMm,
          faltasSecullum: normalizeHhMm(camposSec.faltas) || null,
          faltaDsrSecullum: normalizeHhMm(camposSec.faltaDsr) || null,
          valeTransporte: func.valorVT ? new Decimal(func.valorVT) : null,
          status: 'pendente',
          origemErro,
          observacao: obsPlatefull,
        },
      });
    }
  }

  return NextResponse.json({
    fechamentoId: fechamento.id,
    periodo: { dataInicial, dataFinal },
    processados,
    comErro,
    funcionariosSemPis: semPis.length,
    semPis,
  });
}
