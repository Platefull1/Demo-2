/**
 * Importação de SALDO (estoque final + custo médio) da planilha CMV DESPERDÍCIO.
 * Parser puro em importar-saldo-parse.ts; aqui: match, fallbacks de custo e persistência.
 */

import type { CmvCustoOrigem } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  matchCatalogoPorNome,
  type EstoqueCatalogoItem,
} from '@/lib/estoque/catalogo';
import { listarAbas } from './importar-catalogo';
import { competenciaAnterior } from './lojas';
import { normalizarDescricao } from './normalize';
import {
  fimCompetenciaUtc,
  isCustoPlanilhaValido,
  lerSaldoDoBuffer,
  parseSaldoDaAba,
  type CustoOrigemSaldo,
  type LinhaSaldoPlanilha,
} from './importar-saldo-parse';

export type { CustoOrigemSaldo, LinhaSaldoPlanilha };
export {
  fimCompetenciaUtc,
  isCustoPlanilhaValido,
  lerSaldoDoBuffer,
  parseSaldoDaAba,
};

export type MatchStatusSaldo = 'casado' | 'sugerido' | 'nao_encontrado';

export type PreviewSaldoItem = LinhaSaldoPlanilha & {
  status: MatchStatusSaldo;
  /** Status de exibição/filtro (inclui custo_pendente). */
  statusExibicao: MatchStatusSaldo | 'custo_pendente';
  estoqueInsumoId?: string;
  estoqueNome?: string;
  score?: number;
};

export function previewSaldoComCatalogo(
  linhas: LinhaSaldoPlanilha[],
  catalogo: EstoqueCatalogoItem[],
): PreviewSaldoItem[] {
  return linhas.map((l) => {
    const match = matchCatalogoPorNome(l.nome, catalogo);
    if (match.status === 'nao_encontrado' || !match.item) {
      return {
        ...l,
        status: 'nao_encontrado' as const,
        statusExibicao: 'nao_encontrado' as const,
      };
    }
    return {
      ...l,
      status: match.status,
      statusExibicao: match.status,
      estoqueInsumoId: match.item.id,
      estoqueNome: match.item.nome,
      score: match.score,
    };
  });
}

function statusExibicaoDe(item: PreviewSaldoItem): PreviewSaldoItem['statusExibicao'] {
  if (item.status === 'nao_encontrado') return 'nao_encontrado';
  if (item.custoOrigem === 'PENDENTE' || (item.qtdFinal > 0 && item.custoMedio == null)) {
    return 'custo_pendente';
  }
  return item.status;
}

function custoUnitarioLancamento(quantidade: unknown, valorTotal: unknown): number | null {
  const q = Number(quantidade);
  const v = Number(valorTotal);
  if (!Number.isFinite(q) || q <= 0 || !Number.isFinite(v)) return null;
  const u = v / q;
  return u > 0 && Number.isFinite(u) ? u : null;
}

/**
 * Resolve custo quando a planilha não traz AG válido e qtd > 0:
 * 1) última compra (mesma loja, senão qualquer) até fim da competência
 * 2) custo médio do mês anterior
 * 3) PENDENTE (grava qtd sem custo)
 */
export async function resolverCustosSaldo(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
  itens: PreviewSaldoItem[];
}): Promise<PreviewSaldoItem[]> {
  const precisa = params.itens.filter(
    (i) =>
      i.qtdFinal > 0 &&
      !isCustoPlanilhaValido(i.custoPlanilha) &&
      i.estoqueInsumoId,
  );
  if (precisa.length === 0) {
    return params.itens.map((i) => {
      const next = { ...i };
      if (i.custoPlanilha != null) {
        next.custoMedio = i.custoPlanilha;
        next.custoOrigem = 'PLANILHA';
      } else if (i.qtdFinal > 0) {
        next.custoMedio = null;
        next.custoOrigem = 'PENDENTE';
      }
      next.statusExibicao = statusExibicaoDe(next);
      return next;
    });
  }

  const ids = [...new Set(precisa.map((i) => i.estoqueInsumoId!))];
  const fim = fimCompetenciaUtc(params.competencia);
  const ant = competenciaAnterior(params.competencia);

  const [lancamentos, saldosAnt] = await Promise.all([
    prisma.cmvLancamento.findMany({
      where: {
        userId: params.tenantUserId,
        estoqueInsumoId: { in: ids },
        tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
        data: { lt: fim },
        quantidade: { gt: 0 },
      },
      select: {
        storeSlug: true,
        estoqueInsumoId: true,
        data: true,
        quantidade: true,
        valorTotal: true,
      },
      orderBy: { data: 'desc' },
    }),
    prisma.cmvSaldoEstoque.findMany({
      where: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: ant,
        estoqueInsumoId: { in: ids },
      },
      select: {
        estoqueInsumoId: true,
        custoMedio: true,
      },
    }),
  ]);

  const ultimaMesmaLoja = new Map<string, number>();
  const ultimaQualquer = new Map<string, number>();
  for (const l of lancamentos) {
    const u = custoUnitarioLancamento(l.quantidade, l.valorTotal);
    if (u == null) continue;
    if (!ultimaQualquer.has(l.estoqueInsumoId)) {
      ultimaQualquer.set(l.estoqueInsumoId, u);
    }
    if (
      l.storeSlug === params.storeSlug &&
      !ultimaMesmaLoja.has(l.estoqueInsumoId)
    ) {
      ultimaMesmaLoja.set(l.estoqueInsumoId, u);
    }
  }

  const mesAnterior = new Map<string, number>();
  for (const s of saldosAnt) {
    const c = s.custoMedio != null ? Number(s.custoMedio) : NaN;
    if (Number.isFinite(c) && c > 0) mesAnterior.set(s.estoqueInsumoId, c);
  }

  return params.itens.map((i) => {
    const next: PreviewSaldoItem = { ...i };

    if (isCustoPlanilhaValido(i.custoPlanilha)) {
      next.custoMedio = i.custoPlanilha;
      next.custoOrigem = 'PLANILHA';
      next.statusExibicao = statusExibicaoDe(next);
      return next;
    }

    if (!(i.qtdFinal > 0)) {
      next.custoMedio = null;
      next.custoOrigem = null;
      next.statusExibicao = statusExibicaoDe(next);
      return next;
    }

    if (!i.estoqueInsumoId) {
      next.custoMedio = null;
      next.custoOrigem = 'PENDENTE';
      next.statusExibicao = statusExibicaoDe(next);
      return next;
    }

    const compra =
      ultimaMesmaLoja.get(i.estoqueInsumoId) ??
      ultimaQualquer.get(i.estoqueInsumoId);
    if (compra != null) {
      next.custoMedio = compra;
      next.custoOrigem = 'ULTIMA_COMPRA';
      next.statusExibicao = statusExibicaoDe(next);
      return next;
    }

    const antCusto = mesAnterior.get(i.estoqueInsumoId);
    if (antCusto != null) {
      next.custoMedio = antCusto;
      next.custoOrigem = 'MES_ANTERIOR';
      next.statusExibicao = statusExibicaoDe(next);
      return next;
    }

    next.custoMedio = null;
    next.custoOrigem = 'PENDENTE';
    next.statusExibicao = statusExibicaoDe(next);
    return next;
  });
}

export function contadoresPreviewSaldo(itens: PreviewSaldoItem[]) {
  const porSecao = {
    MATERIA_PRIMA: { total: 0, casados: 0, sugeridos: 0, naoEncontrados: 0, custoPendente: 0 },
    EMBALAGEM: { total: 0, casados: 0, sugeridos: 0, naoEncontrados: 0, custoPendente: 0 },
    BEBIDA: { total: 0, casados: 0, sugeridos: 0, naoEncontrados: 0, custoPendente: 0 },
  };

  let casados = 0;
  let sugeridos = 0;
  let naoEncontrados = 0;
  let custoPendente = 0;
  let qtdSemCorrespondencia = 0;

  for (const i of itens) {
    const bucket = porSecao[i.secao];
    bucket.total += 1;
    if (i.status === 'casado') {
      casados += 1;
      bucket.casados += 1;
    } else if (i.status === 'sugerido') {
      sugeridos += 1;
      bucket.sugeridos += 1;
    } else {
      naoEncontrados += 1;
      bucket.naoEncontrados += 1;
      if (i.qtdFinal > 0) qtdSemCorrespondencia += 1;
    }
    if (i.statusExibicao === 'custo_pendente' || i.custoOrigem === 'PENDENTE') {
      custoPendente += 1;
      bucket.custoPendente += 1;
    }
  }

  return {
    total: itens.length,
    casados,
    sugeridos,
    naoEncontrados,
    custoPendente,
    qtdSemCorrespondencia,
    porSecao,
  };
}

export type ConfirmSaldoItem = {
  estoqueInsumoId: string;
  qtdFinal: number;
  custoMedio: number | null;
  custoOrigem?: CustoOrigemSaldo | null;
};

/**
 * Grava CmvSaldoEstoque com origem IMPORTACAO (upsert por loja+competência+produto).
 * Esse saldo vira estoque inicial do mês seguinte.
 */
export async function confirmarSaldo(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
  itens: ConfirmSaldoItem[];
}): Promise<{ upserted: number }> {
  let upserted = 0;
  for (const it of params.itens) {
    if (!it.estoqueInsumoId) continue;
    const custoOrigem: CmvCustoOrigem =
      (it.custoOrigem as CmvCustoOrigem | null | undefined) ??
      (isCustoPlanilhaValido(it.custoMedio) ? 'PLANILHA' : 'PENDENTE');
    await prisma.cmvSaldoEstoque.upsert({
      where: {
        userId_storeSlug_competencia_estoqueInsumoId: {
          userId: params.tenantUserId,
          storeSlug: params.storeSlug,
          competencia: params.competencia,
          estoqueInsumoId: it.estoqueInsumoId,
        },
      },
      create: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
        estoqueInsumoId: it.estoqueInsumoId,
        qtdFinal: it.qtdFinal,
        custoMedio: it.custoMedio,
        custoOrigem,
        origem: 'IMPORTACAO',
      },
      update: {
        qtdFinal: it.qtdFinal,
        custoMedio: it.custoMedio,
        custoOrigem,
        origem: 'IMPORTACAO',
      },
    });
    upserted++;
  }
  return { upserted };
}

export { listarAbas, normalizarDescricao };
