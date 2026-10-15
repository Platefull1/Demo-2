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
