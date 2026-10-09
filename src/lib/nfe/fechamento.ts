/**
 * Cálculo do fechamento CMV Real por produto / semana.
 *
 * consumo = inicial + compras + transfRecebida - transfEnviada - desperdicio - final
 * (transf enviada abate do consumo da loja que envia, como na planilha)
 */

import { prisma } from '@/lib/prisma';
import { semanaFromDataEntrada } from './dates';
import { competenciaAnterior, storeLabel } from './lojas';
import { conciliarTransferencias, type AlertaTransferencia } from './transferencias';
import { calcularCustoRefeicoes } from '@/lib/cmv-real/refeicoes';

export type AjusteFechamento = {
  id: string;
  secao: 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA' | 'GERAL';
  descricao: string;
  valor: number;
  criadoPorId: string | null;
  criadoEm: string;
};

export type RefeicaoFuncionario = {
  id: string;
  descricao: string;
  valorVenda: number;
};

export type LinhaFechamento = {
  estoqueInsumoId: string;
  nome: string;
  secao: string;
  unidade: string;
  ordem: number;
  estoqueInicial: number;
  custoMedioInicial: number | null;
  comprasQtd: number;
  comprasValor: number;
  /** por semana 1–5 */
  comprasPorSemana: Record<1 | 2 | 3 | 4 | 5, { qtd: number; valor: number }>;
  transfEnviadaQtd: number;
  transfEnviadaValor: number;
  transfRecebidaQtd: number;
  transfRecebidaValor: number;
  desperdicioQtd: number;
  desperdicioValor: number;
  estoqueFinal: number;
  custoMedioFinal: number | null;
  consumoQtd: number;
  consumoValor: number;
};

function n(d: unknown): number {
  if (d == null) return 0;
  if (typeof d === 'number') return d;
  return Number(d);
}

function emptySemanas(): Record<1 | 2 | 3 | 4 | 5, { qtd: number; valor: number }> {
  return {
    1: { qtd: 0, valor: 0 },
    2: { qtd: 0, valor: 0 },
    3: { qtd: 0, valor: 0 },
    4: { qtd: 0, valor: 0 },
    5: { qtd: 0, valor: 0 },
  };
}

export async function garantirFechamentoAberto(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
}) {
  return prisma.cmvFechamento.upsert({
    where: {
      userId_storeSlug_competencia: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
      },
    },
    create: {
      userId: params.tenantUserId,
      storeSlug: params.storeSlug,
      competencia: params.competencia,
      status: 'ABERTO',
      ajustes: [],
      refeicoesFuncionarios: [],
      vendaMes: null,
      vendaMesOrigem: null,
    },
    update: {},
  });
}

export async function montarFechamento(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
}): Promise<{
  fechamento: Awaited<ReturnType<typeof garantirFechamentoAberto>>;
  linhas: LinhaFechamento[];
  alertasTransferencia: AlertaTransferencia[];
  pendencias: string[];
  totais: {
    consumoValor: number;
    consumoMp: number;
    comprasValor: number;
    transfEnviadaValor: number;
    transfRecebidaValor: number;
    ajustesValor: number;
    vendaMes: number | null;
    pctCmvMpBruto: number | null;
    custoRefeicoes: number;
    consumoMpLiquido: number | null;
    refeicoesPorCategoria: Array<{
      categoria: string;
      quantidade: number;
      valorItens: number;
      custo: number;
    }>;
  };
  refeicoes: Array<{
    id: string;
    data: string;
    categoria: string;
    consumidor: string | null;
    formaPagamento: string | null;
    valorItens: number;
    origem: string;
    ignorada: boolean;
  }>;
}> {
  const fechamento = await garantirFechamentoAberto(params);
  const ant = competenciaAnterior(params.competencia);

  const [configs, saldosIni, saldosFim, lancs] = await Promise.all([
    prisma.cmvRealInsumoConfig.findMany({
      where: { userId: params.tenantUserId, ativo: true },
      include: {
        estoqueInsumo: { select: { id: true, nome: true, insumoId: true } },
      },
      orderBy: [{ secao: 'asc' }, { ordem: 'asc' }],
    }),
    prisma.cmvSaldoEstoque.findMany({
      where: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: ant,
      },
    }),
    prisma.cmvSaldoEstoque.findMany({
      where: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
      },
    }),
    prisma.cmvLancamento.findMany({
      where: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
      },
    }),
  ]);

  const iniMap = new Map(saldosIni.map((s) => [s.estoqueInsumoId, s]));
  const fimMap = new Map(saldosFim.map((s) => [s.estoqueInsumoId, s]));

  const linhas: LinhaFechamento[] = configs.map((cfg) => {
    const id = cfg.estoqueInsumoId;
    const ini = iniMap.get(id);
    const fim = fimMap.get(id);
    const itemLancs = lancs.filter((l) => l.estoqueInsumoId === id);

    const comprasPorSemana = emptySemanas();
    let comprasQtd = 0;
    let comprasValor = 0;
    let transfEnviadaQtd = 0;
    let transfEnviadaValor = 0;
    let transfRecebidaQtd = 0;
    let transfRecebidaValor = 0;
    let desperdicioQtd = 0;
    let desperdicioValor = 0;

    for (const l of itemLancs) {
      const q = n(l.quantidade);
      const v = n(l.valorTotal);
      if (l.tipo === 'COMPRA_NFE' || l.tipo === 'COMPRA_MANUAL') {
        comprasQtd += q;
        comprasValor += v;
        const sem = semanaFromDataEntrada(l.data);
        comprasPorSemana[sem].qtd += q;
        comprasPorSemana[sem].valor += v;
      } else if (l.tipo === 'TRANSFERENCIA_SAIDA') {
        transfEnviadaQtd += q;
        transfEnviadaValor += v;
      } else if (l.tipo === 'TRANSFERENCIA_ENTRADA') {
        transfRecebidaQtd += q;
        transfRecebidaValor += v;
      } else if (l.tipo === 'DESPERDICIO') {
        desperdicioQtd += q;
        desperdicioValor += v;
      }
    }

    const estoqueInicial = n(ini?.qtdFinal);
    const estoqueFinal = n(fim?.qtdFinal);
    const custoMedioInicial = ini?.custoMedio != null ? n(ini.custoMedio) : null;
    const custoMedioFinal = fim?.custoMedio != null ? n(fim.custoMedio) : null;

    // consumo: inicial + compras + recebida − enviada − desperdício − final
    const consumoQtd =
      estoqueInicial +
      comprasQtd +
      transfRecebidaQtd -
      transfEnviadaQtd -
      desperdicioQtd -
      estoqueFinal;

    // valor: usa custo médio ponderado aproximado
    const entradasQtd = estoqueInicial + comprasQtd + transfRecebidaQtd;
    const entradasValor =
      estoqueInicial * (custoMedioInicial ?? 0) +
      comprasValor +
      transfRecebidaValor;
    const custoMedio =
      entradasQtd > 0 ? entradasValor / entradasQtd : custoMedioFinal ?? custoMedioInicial ?? 0;
    const consumoValor = Math.round(consumoQtd * custoMedio * 100) / 100;

    return {
      estoqueInsumoId: id,
      nome: cfg.estoqueInsumo.nome,
      secao: cfg.secao,
      unidade: cfg.unidade,
      ordem: cfg.ordem,
      estoqueInicial,
      custoMedioInicial,
      comprasQtd,
      comprasValor,
      comprasPorSemana,
      transfEnviadaQtd,
      transfEnviadaValor,
      transfRecebidaQtd,
      transfRecebidaValor,
      desperdicioQtd,
      desperdicioValor,
      estoqueFinal,
      custoMedioFinal,
      consumoQtd,
      consumoValor,
    };
  });

  const alertasTransferencia = await conciliarTransferencias(params);

  const pendencias: string[] = [];
  const notasRev = await prisma.nfeNota.count({
    where: {
      userId: params.tenantUserId,
      storeSlug: params.storeSlug,
      competencia: params.competencia,
      status: 'EM_REVISAO',
    },
  });
  if (notasRev > 0) {
    pendencias.push(`${notasRev} nota(s) em revisão`);
  }
  for (const a of alertasTransferencia) {
    pendencias.push(a.mensagem);
  }
  if (!fimMap.size) {
    pendencias.push('Estoque final ainda não informado (contagem ou importação)');
  }

  const ajustes = parseAjustes(fechamento.ajustes);
  const ajustesValor = ajustes.reduce((a, x) => a + x.valor, 0);

  // Aviso: API de Dados ~24h de atraso; sync definitivo a partir do dia 2 do mês seguinte
  const [yStr, mStr] = params.competencia.split('-');
  const y = Number(yStr);
  const m = Number(mStr); // 1–12; Date.UTC month é 0-based → m = mês seguinte
  // competencia 2026-10 → Date.UTC(2026, 10, 2) = 02/11/2026
  const syncDefinitivoApartir = new Date(Date.UTC(y, m, 2));
  const hoje = new Date();
  if (fechamento.status !== 'FECHADO') {
    pendencias.push('Dados da Saipos até ontem (API de Dados ~24h de atraso)');
  }
  if (hoje < syncDefinitivoApartir) {
    const label = syncDefinitivoApartir.toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
    });
    pendencias.push(
      `Sync definitivo das refeições: rode a partir de ${label} (dia 2 do mês seguinte)`
    );
  }

  const refeicaoRows = await prisma.cmvRefeicao.findMany({
    where: {
      userId: params.tenantUserId,
      storeSlug: params.storeSlug,
      competencia: params.competencia,
    },
    orderBy: [{ data: 'asc' }, { createdAt: 'asc' }],
  });

  const consumoValor = linhas.reduce((a, l) => a + l.consumoValor, 0);
  const consumoMp = linhas
    .filter((l) => l.secao === 'MATERIA_PRIMA')
    .reduce((a, l) => a + l.consumoValor, 0);
  const vendaMes = fechamento.vendaMes != null ? n(fechamento.vendaMes) : null;

  const calcRef =
    vendaMes != null && vendaMes > 0
      ? calcularCustoRefeicoes({
          consumoMp,
          vendaMes,
          refeicoes: refeicaoRows.map((r) => ({
            categoria: r.categoria,
            valorItens: n(r.valorItens),
            ignorada: r.ignorada,
          })),
        })
      : {
          pctCmvMpBruto: 0,
          porCategoria: [] as Array<{
            categoria: string;
            quantidade: number;
            valorItens: number;
            custo: number;
          }>,
          custoTotal: 0,
          consumoMpLiquido: consumoMp,
        };

  return {
    fechamento,
    linhas,
    alertasTransferencia,
    pendencias,
    refeicoes: refeicaoRows.map((r) => ({
      id: r.id,
      data: r.data.toISOString().slice(0, 10),
      categoria: r.categoria,
      consumidor: r.consumidor,
      formaPagamento: r.formaPagamento,
      valorItens: n(r.valorItens),
      origem: r.origem,
      ignorada: r.ignorada,
    })),
    totais: {
      consumoValor,
      consumoMp,
      comprasValor: linhas.reduce((a, l) => a + l.comprasValor, 0),
      transfEnviadaValor: linhas.reduce((a, l) => a + l.transfEnviadaValor, 0),
      transfRecebidaValor: linhas.reduce((a, l) => a + l.transfRecebidaValor, 0),
      ajustesValor,
      vendaMes,
      pctCmvMpBruto:
        vendaMes != null && vendaMes > 0 ? calcRef.pctCmvMpBruto : null,
      custoRefeicoes: calcRef.custoTotal,
      consumoMpLiquido:
        vendaMes != null && vendaMes > 0 ? calcRef.consumoMpLiquido : null,
      refeicoesPorCategoria: calcRef.porCategoria,
    },
  };
}

export function parseAjustes(raw: unknown): AjusteFechamento[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((a, i) => {
    const o = a as Record<string, unknown>;
    return {
      id: String(o.id ?? `adj-${i}`),
      secao: (o.secao as AjusteFechamento['secao']) || 'GERAL',
      descricao: String(o.descricao ?? ''),
      valor: Number(o.valor ?? 0),
      criadoPorId: o.criadoPorId != null ? String(o.criadoPorId) : null,
      criadoEm: String(o.criadoEm ?? new Date().toISOString()),
    };
  });
}

export function parseRefeicoes(raw: unknown): RefeicaoFuncionario[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((a, i) => {
    const o = a as Record<string, unknown>;
    return {
      id: String(o.id ?? `ref-${i}`),
      descricao: String(o.descricao ?? ''),
      valorVenda: Number(o.valorVenda ?? 0),
    };
  });
}

export { storeLabel };
