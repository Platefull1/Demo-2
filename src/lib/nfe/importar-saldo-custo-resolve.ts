/**
 * Resolução pura de custo do saldo (sem Prisma).
 */

import { storeLabel } from './lojas';
import {
  isCustoPlanilhaValido,
  type AgAnteriorHit,
  type CustoOrigemSaldo,
} from './importar-saldo-parse';

export type CompraHit = {
  custo: number;
  storeSlug: string;
  numero: string;
  dataEntrada: Date;
};

export type CompraOrdenavel = {
  dataEntrada: Date;
  createdAt: Date;
  numero: string;
};

export function numeroNota(numero: string): number {
  const n = Number(String(numero).replace(/\D/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Mais recente primeiro. Empate na data de entrada: criação/importação,
 * depois o maior número de nota.
 * Retorno negativo quando `a` deve vir antes de `b`.
 */
export function compararUltimaCompra(a: CompraOrdenavel, b: CompraOrdenavel): number {
  const entrada = b.dataEntrada.getTime() - a.dataEntrada.getTime();
  if (entrada !== 0) return entrada;
  const criada = b.createdAt.getTime() - a.createdAt.getTime();
  if (criada !== 0) return criada;
  const num = numeroNota(b.numero) - numeroNota(a.numero);
  if (num !== 0) return num;
  return String(b.numero).localeCompare(String(a.numero), 'pt-BR');
}

export type CustoResolvido = {
  custoMedio: number | null;
  custoOrigem: CustoOrigemSaldo | null;
  custoOrigemDetalhe: string | null;
  custoAntigo?: boolean;
};

function fmtDataBr(d: Date): string {
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function detalheCompra(hit: CompraHit): string {
  return `NF ${hit.numero} ${storeLabel(hit.storeSlug)} ${fmtDataBr(hit.dataEntrada)}`;
}

/**
 * Ordem:
 * 1) recalcular linha
 * 2) compra loja
 * 3) mês anterior planilha (por nome)
 * 4) compra grupo / outra loja
 * 5) CMV teórico
 * 6) pendente
 */
/**
 * O saldo entra no recálculo quando o mês está aberto, a quantidade é positiva
 * e o custo não foi informado à mão.
 * Custo vazio ou pendente entra sempre. Custo positivo só entra com
 * `recalcularExistentes` (fechamento aberto, nota aprovada/editada ou contagem).
 */
/** Variação acima de 50% para cima ou para baixo não grava sozinha. */
export function variacaoCustoBloqueada(
  atual: number | null,
  novo: number,
): boolean {
  if (atual == null || !(atual > 0) || !(novo > 0)) return false;
  return Math.abs(novo - atual) / atual > 0.5;
}

export function custoSaldoEntraNoRecalculo(params: {
  fechamentoFechado: boolean;
  qtd: number;
  custoOrigem: string | null;
  custoMedio: number | null;
  recalcularExistentes: boolean;
}): boolean {
  if (params.fechamentoFechado) return false;
  if (!(params.qtd > 0)) return false;
  if (params.custoOrigem === 'MANUAL') return false;
  const vazio =
    params.custoOrigem === 'PENDENTE' ||
    params.custoMedio == null ||
    !(params.custoMedio > 0);
  if (vazio) return true;
  return params.recalcularExistentes;
}

export function resolverUmCusto(params: {
  nomeProduto: string;
  custoRecalculado?: number | null;
  estoqueInsumoId?: string;
  competencia: string;
  agAnterior?: Map<string, AgAnteriorHit>;
  comprasLoja?: Map<string, CompraHit>;
  comprasGrupo?: Map<string, CompraHit>;
  outraLoja?: Map<string, { custo: number; storeSlug: string }>;
  cmvTeorico?: Map<string, { custo: number; nomeIng: string }>;
}): CustoResolvido {
  if (isCustoPlanilhaValido(params.custoRecalculado ?? null)) {
    return {
      custoMedio: params.custoRecalculado!,
      custoOrigem: 'PLANILHA_RECALCULADO',
      custoOrigemDetalhe: 'Planilha (recalculado)',
    };
  }

  const id = params.estoqueInsumoId;

  if (id) {
    const loja = params.comprasLoja?.get(id);
    if (loja) {
      return {
        custoMedio: loja.custo,
        custoOrigem: 'ULTIMA_COMPRA_LOJA',
        custoOrigemDetalhe: detalheCompra(loja),
      };
    }
  }

  const ag = params.agAnterior?.get(params.nomeProduto);
  if (ag) {
    return {
      custoMedio: ag.custo,
      custoOrigem: 'PLANILHA_MES_ANTERIOR',
      custoOrigemDetalhe: ag.custoAntigo
        ? `${ag.aba} AG · custo antigo (>3 meses)`
        : `${ag.aba} AG`,
      custoAntigo: ag.custoAntigo,
    };
  }

  if (id) {
    const grupo = params.comprasGrupo?.get(id);
    if (grupo) {
      return {
        custoMedio: grupo.custo,
        custoOrigem: 'ULTIMA_COMPRA_GRUPO',
        custoOrigemDetalhe: detalheCompra(grupo),
      };
    }

    const outra = params.outraLoja?.get(id);
    if (outra) {
      return {
        custoMedio: outra.custo,
        custoOrigem: 'OUTRA_LOJA',
        custoOrigemDetalhe: `Saldo ${storeLabel(outra.storeSlug)} ${params.competencia}`,
      };
    }

    const teo = params.cmvTeorico?.get(id);
    if (teo) {
      return {
        custoMedio: teo.custo,
        custoOrigem: 'CMV_TEORICO',
        custoOrigemDetalhe: `CMV teórico: ${teo.nomeIng}`,
      };
    }
  }

  return {
    custoMedio: null,
    custoOrigem: 'PENDENTE',
    custoOrigemDetalhe: null,
  };
}
