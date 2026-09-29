/**
 * Pipeline puro de processamento de NF-e (testável sem Prisma).
 *
 * Passos: fornecedor ignorado → rateio FCP-ST → conferência total →
 * mapeamento → sugestão de fator → conversão → sanidade de custo → decisão.
 */

import { ratearImpostoNota } from './fcp-st';
import { sugerirFatorDaDescricao } from './fator-sugerido';
import {
  chaveMapeamentoDesc,
  chaveMapeamentoEan,
  normalizarDescricao,
  normalizarUnidade,
} from './normalize';
import { sugerirTopDoCatalogo, SUGESTAO_MIN_SCORE, type CatalogoItem } from './similarity';

export type CmvRealUnidade = 'KG' | 'UN';
export type CmvRealSecao = 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';

export interface PipelineConfig {
  autoAprovar: boolean;
  toleranciaTotalReais: number;
  toleranciaTotalPercent: number;
  limiteVariacaoCustoPercent: number;
  maxTentativas: number;
}

export interface PipelineMapeamento {
  id: string;
  chave: string;
  estoqueInsumoId: string | null;
  fatorConversao: number;
  ignorar: boolean;
  unidadeConvertida?: CmvRealUnidade;
  secao?: CmvRealSecao | null;
}

export interface PipelineInsumoConfig {
  estoqueInsumoId: string;
  unidade: CmvRealUnidade;
  secao: CmvRealSecao;
  /** kgPorUnidade do EstoqueProdutoConfig (produtoId = insumoId slug), se houver */
  kgPorUnidade?: number | null;
}

export interface PipelineItemInput {
  saiposItemId: number;
  numeroItem?: number;
  descricao: string;
  ean?: string | null;
  ncm?: string | null;
  cfop?: string | null;
  unidadeComercial: string;
  quantidade: number;
  valorBruto: number;
  /** net_item_value da Saipos (antes do rateio) */
  netItemValue: number | null;
}

export interface PipelineNotaInput {
  valorTotal: number;
  /** Impostos de nível de nota (ex.: total_fcp_st) */
  impostosNota?: Record<string, number | null | undefined>;
  fornecedorIgnorarCmv: boolean;
  /** id_store_stock_transfer — transferência entre lojas */
  saiposTransferenciaId?: number | null;
  itens: PipelineItemInput[];
  /** Mapeamentos do fornecedor (chave → map) */
  mapeamentos: PipelineMapeamento[];
  /** Catálogo ativo (EstoqueInsumo + CmvRealInsumoConfig) */
  catalogo: CatalogoItem[];
  /** Config por estoqueInsumoId */
  insumosConfig: Record<string, PipelineInsumoConfig>;
  /** Custo médio recente por estoqueInsumoId (últimos 90d) */
  custoMedioPorInsumo?: Record<string, number>;
  /** Tentativas já acumuladas antes desta execução */
  tentativasAtuais?: number;
  config: PipelineConfig;
}

export type PipelineItemStatus = 'MAPEADO' | 'SUGERIDO' | 'SEM_MAPEAMENTO' | 'IGNORADO';

export interface PipelineItemResult {
  saiposItemId: number;
  descricaoNormalizada: string;
  unidadeComercial: string;
  valorLiquido: number;
  fcpStRateado: number;
  status: PipelineItemStatus;
  estoqueInsumoId: string | null;
  mapeamentoId: string | null;
  fatorConversao: number | null;
  quantidadeConvertida: number | null;
  unidadeConvertida: CmvRealUnidade | null;
  custoUnitario: number | null;
  fatorSugerido: number | null;
  fatorSugeridoOrigem: string | null;
  sugestaoInsumoId: string | null;
  sugestaoScore: number | null;
  /** Top 3 candidatos [{id, nome, score}] */
  sugestoes: Array<{ id: string; nome: string; score: number }>;
  alertas: string[];
}

export type PipelineNotaStatus =
  | 'IGNORADA'
  | 'EM_REVISAO'
  | 'APROVADA'
  | 'ERRO_PROCESSAMENTO'
  | 'FALHA';

export interface PipelineProblema {
  tipo: string;
  mensagem: string;
  saiposItemId?: number;
}

export interface PipelineResult {
  status: PipelineNotaStatus;
  alertas: string[];
  itens: PipelineItemResult[];
  somaItensLiquido: number;
  tentativas: number;
  ultimoErro: string | null;
  problemasNovos: PipelineProblema[];
  /** true se deve gerar CmvLancamento COMPRA_NFE */
  gerarLancamentos: boolean;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function defaultPipelineConfig(partial?: Partial<PipelineConfig>): PipelineConfig {
  return {
    autoAprovar: false,
    toleranciaTotalReais: 1,
    toleranciaTotalPercent: 0.5,
    limiteVariacaoCustoPercent: 30,
    maxTentativas: 3,
    ...partial,
  };
}

/**
 * Processa uma nota. Puro — sem I/O.
 * Em exceção: o caller deve marcar ERRO_PROCESSAMENTO; esta função também
 * captura e devolve ERRO/FALHA se `wrapErrors` (default true).
 */
export function processarNota(input: PipelineNotaInput): PipelineResult {
  const tentativas = (input.tentativasAtuais ?? 0) + 1;
  const cfg = input.config;

  try {
    return processarNotaInner(input, tentativas);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const falha = tentativas >= cfg.maxTentativas;
    return {
      status: falha ? 'FALHA' : 'ERRO_PROCESSAMENTO',
      alertas: [],
      itens: [],
      somaItensLiquido: 0,
      tentativas,
      ultimoErro: msg,
      problemasNovos: falha
        ? [{ tipo: 'FALHA', mensagem: `Nota em FALHA após ${tentativas} tentativas: ${msg}` }]
        : [],
      gerarLancamentos: false,
    };
  }
}

function processarNotaInner(input: PipelineNotaInput, tentativas: number): PipelineResult {
  const cfg = input.config;
  const problemas: PipelineProblema[] = [];
  const alertasNota: string[] = [];

  // 1) Fornecedor ignorado
  if (input.fornecedorIgnorarCmv) {
    return {
      status: 'IGNORADA',
      alertas: ['FORNECEDOR_IGNORADO'],
      itens: input.itens.map((it) => itemIgnoradoBase(it)),
      somaItensLiquido: 0,
      tentativas,
      ultimoErro: null,
      problemasNovos: [],
      gerarLancamentos: false,
    };
  }

  // 2) Rateio FCP-ST
  const rateio = ratearImpostoNota(
    input.valorTotal,
    input.itens.map((it) => ({
      id: it.saiposItemId,
      netItemValue: it.netItemValue ?? 0,
    })),
    input.impostosNota ?? {},
  );

  const liquidoPorId = new Map(
    rateio.itens.map((r) => [Number(r.id), { valorLiquido: r.valorLiquido, rateado: r.rateado }]),
  );

  // 3) Conferência de total (já com rateio)
  const somaLiquido = round2(
    rateio.itens.reduce((s, r) => s + r.valorLiquido, 0),
  );
  const tolerancia = Math.max(
    cfg.toleranciaTotalReais,
    (input.valorTotal * cfg.toleranciaTotalPercent) / 100,
  );
  if (Math.abs(somaLiquido - input.valorTotal) > tolerancia) {
    alertasNota.push('TOTAL_DIVERGENTE');
    problemas.push({
      tipo: 'TOTAL_DIVERGENTE',
      mensagem: `Soma itens ${somaLiquido} ≠ total ${input.valorTotal} (tol ${tolerancia})`,
    });
  }

  // Transferência entre lojas → revisão obrigatória
  if (input.saiposTransferenciaId != null && input.saiposTransferenciaId > 0) {
    alertasNota.push('TRANSFERENCIA_ENTRE_LOJAS');
    problemas.push({
      tipo: 'TRANSFERENCIA_ENTRE_LOJAS',
      mensagem: `Nota é transferência Saipos id=${input.saiposTransferenciaId}`,
    });
  }

  const mapByChave = new Map(input.mapeamentos.map((m) => [m.chave, m]));

  // 4–7) Itens
  const itensOut: PipelineItemResult[] = input.itens.map((it) => {
    const descNorm = normalizarDescricao(it.descricao);
    const und = normalizarUnidade(it.unidadeComercial);
    const liq = liquidoPorId.get(it.saiposItemId) ?? {
      valorLiquido: round2(it.netItemValue ?? 0),
      rateado: 0,
    };

    const alertas: string[] = [];
    let status: PipelineItemStatus = 'SEM_MAPEAMENTO';
    let estoqueInsumoId: string | null = null;
    let mapeamentoId: string | null = null;
    let fatorConversao: number | null = null;
    let quantidadeConvertida: number | null = null;
    let unidadeConvertida: CmvRealUnidade | null = null;
    let custoUnitario: number | null = null;
    let sugestaoInsumoId: string | null = null;
    let sugestaoScore: number | null = null;
    let sugestoes: Array<{ id: string; nome: string; score: number }> = [];

    // Mapeamento
    let map: PipelineMapeamento | undefined;
    if (it.ean) {
      map = mapByChave.get(chaveMapeamentoEan(it.ean));
    }
    if (!map) {
      map = mapByChave.get(chaveMapeamentoDesc(descNorm, und));
    }

    if (map?.ignorar) {
      status = 'IGNORADO';
    } else if (map && map.estoqueInsumoId) {
      status = 'MAPEADO';
      estoqueInsumoId = map.estoqueInsumoId;
      mapeamentoId = map.id;
      fatorConversao = map.fatorConversao;
      const cfgInsumo = input.insumosConfig[map.estoqueInsumoId];
      unidadeConvertida = cfgInsumo?.unidade ?? map.unidadeConvertida ?? 'KG';
      quantidadeConvertida = round4(it.quantidade * map.fatorConversao);
      if (quantidadeConvertida > 0) {
        custoUnitario = round4(liq.valorLiquido / quantidadeConvertida);
      }

      // Sanidade de custo
      const ref = input.custoMedioPorInsumo?.[map.estoqueInsumoId];
      if (
        ref != null &&
        ref > 0 &&
        custoUnitario != null &&
        cfg.limiteVariacaoCustoPercent > 0
      ) {
        const desvio = (Math.abs(custoUnitario - ref) / ref) * 100;
        if (desvio > cfg.limiteVariacaoCustoPercent) {
          alertas.push('CUSTO_FORA_DO_PADRAO');
          problemas.push({
            tipo: 'CUSTO_FORA_DO_PADRAO',
            saiposItemId: it.saiposItemId,
            mensagem: `custo ${custoUnitario} vs ref ${ref} (desvio ${desvio.toFixed(1)}%)`,
          });
        }
      }
    } else {
      const top = sugerirTopDoCatalogo(it.descricao, input.catalogo, SUGESTAO_MIN_SCORE, {
        ncm: it.ncm,
        top: 3,
      });
      sugestoes = top.map((s) => ({ id: s.id, nome: s.nome, score: s.score }));
      if (top[0]) {
        status = 'SUGERIDO';
        sugestaoInsumoId = top[0].id;
        sugestaoScore = top[0].score;
      } else {
        status = 'SEM_MAPEAMENTO';
      }
      problemas.push({
        tipo: status,
        saiposItemId: it.saiposItemId,
        mensagem: `${status}: ${it.descricao.slice(0, 80)}`,
      });
    }

    // Sugestão de fator (não aplica)
    let fatorSugerido: number | null = null;
    let fatorSugeridoOrigem: string | null = null;
    const secaoHint =
      (estoqueInsumoId && input.insumosConfig[estoqueInsumoId]?.secao) ||
      (sugestaoInsumoId && input.insumosConfig[sugestaoInsumoId]?.secao) ||
      null;
    const sugFator = sugerirFatorDaDescricao(it.descricao, {
      secao: secaoHint,
      unidadeComercial: und,
      quantidadeNota: it.quantidade,
      valorLiquido: liq.valorLiquido,
      kgPorUnidade: (() => {
        const id = estoqueInsumoId ?? sugestaoInsumoId;
        return id ? input.insumosConfig[id]?.kgPorUnidade ?? null : null;
      })(),
    });
    if (sugFator) {
      fatorSugerido = sugFator.fator;
      fatorSugeridoOrigem = sugFator.origem;
      if (sugFator.alertas?.length) {
        for (const a of sugFator.alertas) {
          if (!alertas.includes(a)) alertas.push(a);
        }
        if (sugFator.ambiguo) {
          problemas.push({
            tipo: 'FATOR_AMBIGUO',
            saiposItemId: it.saiposItemId,
            mensagem: sugFator.detalhe,
          });
        }
      }
    } else if (sugestaoInsumoId || estoqueInsumoId) {
      const id = estoqueInsumoId ?? sugestaoInsumoId!;
      const kg = input.insumosConfig[id]?.kgPorUnidade;
      if (kg != null && kg > 0) {
        fatorSugerido = kg;
        fatorSugeridoOrigem = 'ESTOQUE_KG_POR_UNIDADE';
      }
    }

    return {
      saiposItemId: it.saiposItemId,
      descricaoNormalizada: descNorm,
      unidadeComercial: und,
      valorLiquido: liq.valorLiquido,
      fcpStRateado: liq.rateado,
      status,
      estoqueInsumoId,
      mapeamentoId,
      fatorConversao,
      quantidadeConvertida,
      unidadeConvertida,
      custoUnitario,
      fatorSugerido,
      fatorSugeridoOrigem,
      sugestaoInsumoId,
      sugestaoScore,
      sugestoes,
      alertas,
    };
  });

  // 8) Decisão
  const todosResolvidos = itensOut.every(
    (i) => i.status === 'MAPEADO' || i.status === 'IGNORADO',
  );
  const temAlertas =
    alertasNota.length > 0 || itensOut.some((i) => i.alertas.length > 0);

  const podeAuto =
    cfg.autoAprovar &&
    todosResolvidos &&
    !temAlertas &&
    !alertasNota.includes('TRANSFERENCIA_ENTRE_LOJAS');

  if (podeAuto) {
    return {
      status: 'APROVADA',
      alertas: alertasNota,
      itens: itensOut,
      somaItensLiquido: somaLiquido,
      tentativas,
      ultimoErro: null,
      problemasNovos: [],
      gerarLancamentos: true,
    };
  }

  return {
    status: 'EM_REVISAO',
    alertas: alertasNota,
    itens: itensOut,
    somaItensLiquido: somaLiquido,
    tentativas,
    ultimoErro: null,
    problemasNovos: problemas,
    gerarLancamentos: false,
  };
}

function itemIgnoradoBase(it: PipelineItemInput): PipelineItemResult {
  return {
    saiposItemId: it.saiposItemId,
    descricaoNormalizada: normalizarDescricao(it.descricao),
    unidadeComercial: normalizarUnidade(it.unidadeComercial),
    valorLiquido: round2(it.netItemValue ?? 0),
    fcpStRateado: 0,
    status: 'IGNORADO',
    estoqueInsumoId: null,
    mapeamentoId: null,
    fatorConversao: null,
    quantidadeConvertida: null,
    unidadeConvertida: null,
    custoUnitario: null,
    fatorSugerido: null,
    fatorSugeridoOrigem: null,
    sugestaoInsumoId: null,
    sugestaoScore: null,
    sugestoes: [],
    alertas: [],
  };
}

/** Resultado de exceção do pipeline (exposto para testes de retry→FALHA). */
export function resultadoExcecao(
  tentativasAtuais: number,
  maxTentativas: number,
  mensagem: string,
): PipelineResult {
  const tentativas = tentativasAtuais + 1;
  const falha = tentativas >= maxTentativas;
  return {
    status: falha ? 'FALHA' : 'ERRO_PROCESSAMENTO',
    alertas: [],
    itens: [],
    somaItensLiquido: 0,
    tentativas,
    ultimoErro: mensagem,
    problemasNovos: falha
      ? [{ tipo: 'FALHA', mensagem: `Nota em FALHA após ${tentativas} tentativas: ${mensagem}` }]
      : [],
    gerarLancamentos: false,
  };
}
