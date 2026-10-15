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
import {
  resolverUmCusto,
  type CompraHit,
  type CustoResolvido,
} from './importar-saldo-custo-resolve';
import { normalizarDescricao } from './normalize';
import {
  buscarCustoAgAbasAnteriores,
  fimCompetenciaUtc,
  isCustoPlanilhaValido,
  lerSaldoDoBuffer,
  parseSaldoDaAba,
  type AgAnteriorHit,
  type CustoOrigemSaldo,
  type LinhaSaldoPlanilha,
} from './importar-saldo-parse';

export type { CustoOrigemSaldo, LinhaSaldoPlanilha, CustoResolvido };
export {
  fimCompetenciaUtc,
  isCustoPlanilhaValido,
  lerSaldoDoBuffer,
  parseSaldoDaAba,
  buscarCustoAgAbasAnteriores,
  resolverUmCusto,
};

export type MatchStatusSaldo = 'casado' | 'sugerido' | 'nao_encontrado';

export type PreviewSaldoItem = LinhaSaldoPlanilha & {
  status: MatchStatusSaldo;
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

async function buscarUltimasComprasAprovadas(params: {
  tenantUserId: string;
  storeSlug: string;
  estoqueInsumoIds: string[];
  fim: Date;
}): Promise<{
  mesmaLoja: Map<string, CompraHit>;
  qualquerLoja: Map<string, CompraHit>;
}> {
  const mesmaLoja = new Map<string, CompraHit>();
  const qualquerLoja = new Map<string, CompraHit>();
  if (params.estoqueInsumoIds.length === 0) return { mesmaLoja, qualquerLoja };

  const itens = await prisma.nfeItem.findMany({
    where: {
      estoqueInsumoId: { in: params.estoqueInsumoIds },
      status: 'MAPEADO',
      quantidadeConvertida: { gt: 0 },
      valorLiquido: { gt: 0 },
      nota: {
        userId: params.tenantUserId,
        status: 'APROVADA',
        dataEntrada: { lt: params.fim },
      },
    },
    select: {
      estoqueInsumoId: true,
      valorLiquido: true,
      quantidadeConvertida: true,
      nota: {
        select: {
          numero: true,
          storeSlug: true,
          dataEntrada: true,
        },
      },
    },
    orderBy: { nota: { dataEntrada: 'desc' } },
  });

  for (const it of itens) {
    if (!it.estoqueInsumoId) continue;
    const q = Number(it.quantidadeConvertida);
    const v = Number(it.valorLiquido);
    if (!(q > 0) || !(v > 0)) continue;
    const custo = v / q;
    if (!(custo > 0) || !Number.isFinite(custo)) continue;
    const hit: CompraHit = {
      custo,
      storeSlug: it.nota.storeSlug,
      numero: it.nota.numero,
      dataEntrada: it.nota.dataEntrada,
    };
    if (!qualquerLoja.has(it.estoqueInsumoId)) {
      qualquerLoja.set(it.estoqueInsumoId, hit);
    }
    if (
      it.nota.storeSlug === params.storeSlug &&
      !mesmaLoja.has(it.estoqueInsumoId)
    ) {
      mesmaLoja.set(it.estoqueInsumoId, hit);
    }
  }

  return { mesmaLoja, qualquerLoja };
}

async function buscarCustoOutraLoja(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
  estoqueInsumoIds: string[];
}): Promise<Map<string, { custo: number; storeSlug: string }>> {
  const out = new Map<string, { custo: number; storeSlug: string }>();
  if (!params.estoqueInsumoIds.length) return out;
  const rows = await prisma.cmvSaldoEstoque.findMany({
    where: {
      userId: params.tenantUserId,
      competencia: params.competencia,
      estoqueInsumoId: { in: params.estoqueInsumoIds },
      storeSlug: { not: params.storeSlug },
      custoMedio: { gt: 0 },
    },
    select: {
      estoqueInsumoId: true,
      storeSlug: true,
      custoMedio: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
  for (const r of rows) {
    if (out.has(r.estoqueInsumoId)) continue;
    const c = Number(r.custoMedio);
    if (c > 0) out.set(r.estoqueInsumoId, { custo: c, storeSlug: r.storeSlug });
  }
  return out;
}

type IngTeorico = { id: string; nome: string; precoPorKg: number; unidade?: string };

function extrairIngredientesTeoricos(data: unknown): IngTeorico[] {
  if (!data || typeof data !== 'object') return [];
  const o = data as Record<string, unknown>;
  const list = Array.isArray(o.ingredientes) ? o.ingredientes : [];
  const out: IngTeorico[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== 'object') continue;
    const i = raw as Record<string, unknown>;
    const nome = String(i.nome || '').trim();
    const preco = Number(i.precoPorKg);
    if (!nome || !(preco > 0)) continue;
    out.push({
      id: String(i.id || nome),
      nome,
      precoPorKg: preco,
      unidade: i.unidade != null ? String(i.unidade) : undefined,
    });
  }
  return out;
}

async function buscarCustoCmvTeorico(params: {
  tenantUserId: string;
  storeSlug: string;
  nomesPorInsumoId: Map<string, string>;
}): Promise<Map<string, { custo: number; nomeIng: string }>> {
  const out = new Map<string, { custo: number; nomeIng: string }>();
  const record = await prisma.cmvStoreData.findFirst({
    where: {
      OR: [
        { userId: params.tenantUserId, storeSlug: params.storeSlug },
        { storeSlug: params.storeSlug },
      ],
    },
    orderBy: { updatedAt: 'desc' },
    select: { data: true },
  });
  if (!record) return out;
  const ings = extrairIngredientesTeoricos(record.data);
  if (!ings.length) return out;

  for (const [insumoId, nome] of params.nomesPorInsumoId) {
    const alvo = normalizarDescricao(nome);
    let best: { score: number; ing: IngTeorico } | null = null;
    for (const ing of ings) {
      const n = normalizarDescricao(ing.nome);
      if (n === alvo) {
        best = { score: 1, ing };
        break;
      }
      if (n.includes(alvo) || alvo.includes(n)) {
        const score = Math.min(n.length, alvo.length) / Math.max(n.length, alvo.length);
        if (!best || score > best.score) best = { score, ing };
      }
    }
    if (best && best.score >= 0.7) {
      out.set(insumoId, { custo: best.ing.precoPorKg, nomeIng: best.ing.nome });
    }
  }
  return out;
}

/**
 * Resolve custo quando a planilha não traz AG válido e qtd > 0.
 */
export async function resolverCustosSaldo(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
  itens: PreviewSaldoItem[];
  planilhaBuffer?: ArrayBuffer | null;
}): Promise<PreviewSaldoItem[]> {
  const precisa = params.itens.filter(
    (i) => i.qtdFinal > 0 && !isCustoPlanilhaValido(i.custoPlanilha),
  );

  const base = params.itens.map((i) => {
    if (isCustoPlanilhaValido(i.custoPlanilha)) {
      const next: PreviewSaldoItem = {
        ...i,
        custoMedio: i.custoPlanilha,
        custoOrigem: 'PLANILHA',
        custoOrigemDetalhe: null,
        custoAntigo: false,
      };
      next.statusExibicao = statusExibicaoDe(next);
      return next;
    }
    if (!(i.qtdFinal > 0)) {
      const next: PreviewSaldoItem = {
        ...i,
        custoMedio: null,
        custoOrigem: null,
        custoOrigemDetalhe: null,
        custoAntigo: false,
      };
      next.statusExibicao = statusExibicaoDe(next);
      return next;
    }
    return { ...i };
  });

  const comId = precisa.filter((i) => i.estoqueInsumoId);
  const ids = [...new Set(comId.map((i) => i.estoqueInsumoId!))];
  const fim = fimCompetenciaUtc(params.competencia);

  const nomesSemCusto = precisa.map((i) => i.nome);
  const agAnterior = params.planilhaBuffer
    ? buscarCustoAgAbasAnteriores(
        params.planilhaBuffer,
        params.competencia,
        nomesSemCusto,
      )
    : new Map<string, AgAnteriorHit>();

  const [compras, outraLoja, cmvTeorico] = await Promise.all([
    buscarUltimasComprasAprovadas({
      tenantUserId: params.tenantUserId,
      storeSlug: params.storeSlug,
      estoqueInsumoIds: ids,
      fim,
    }),
    buscarCustoOutraLoja({
      tenantUserId: params.tenantUserId,
      storeSlug: params.storeSlug,
      competencia: params.competencia,
      estoqueInsumoIds: ids,
    }),
    buscarCustoCmvTeorico({
      tenantUserId: params.tenantUserId,
      storeSlug: params.storeSlug,
      nomesPorInsumoId: new Map(
        comId.map((i) => [i.estoqueInsumoId!, i.estoqueNome || i.nome]),
      ),
    }),
  ]);

  return base.map((i) => {
    if (isCustoPlanilhaValido(i.custoPlanilha) || !(i.qtdFinal > 0)) {
      return i;
    }

    const resolved = resolverUmCusto({
      nomeProduto: i.nome,
      custoRecalculado: i.custoRecalculado,
      estoqueInsumoId: i.estoqueInsumoId,
      competencia: params.competencia,
      agAnterior,
      comprasLoja: compras.mesmaLoja,
      comprasGrupo: compras.qualquerLoja,
      outraLoja,
      cmvTeorico,
    });

    const next: PreviewSaldoItem = {
      ...i,
      ...resolved,
    };
    next.statusExibicao = statusExibicaoDe(next);
    return next;
  });
}

/**
 * Preenche custo faltante no fechamento (produto com qtd e sem custo).
 * Persiste no CmvSaldoEstoque correspondente.
 */
export async function preencherCustosPendentesFechamento(params: {
  tenantUserId: string;
  storeSlug: string;
  competenciaSaldo: string;
  itens: Array<{
    estoqueInsumoId: string;
    nome: string;
    qtd: number;
    custoMedio: number | null;
    custoOrigem: string | null;
  }>;
}): Promise<number> {
  const precisa = params.itens.filter(
    (i) =>
      i.qtd > 0 &&
      (i.custoOrigem === 'PENDENTE' ||
        i.custoMedio == null ||
        !(Number(i.custoMedio) > 0)),
  );
  if (!precisa.length) return 0;

  const ids = precisa.map((i) => i.estoqueInsumoId);
  const fim = fimCompetenciaUtc(params.competenciaSaldo);

  const [compras, outraLoja, cmvTeorico] = await Promise.all([
    buscarUltimasComprasAprovadas({
      tenantUserId: params.tenantUserId,
      storeSlug: params.storeSlug,
      estoqueInsumoIds: ids,
      fim,
    }),
    buscarCustoOutraLoja({
      tenantUserId: params.tenantUserId,
      storeSlug: params.storeSlug,
      competencia: params.competenciaSaldo,
      estoqueInsumoIds: ids,
    }),
    buscarCustoCmvTeorico({
      tenantUserId: params.tenantUserId,
      storeSlug: params.storeSlug,
      nomesPorInsumoId: new Map(precisa.map((i) => [i.estoqueInsumoId, i.nome])),
    }),
  ]);

  let updated = 0;
  for (const it of precisa) {
    const resolved = resolverUmCusto({
      nomeProduto: it.nome,
      estoqueInsumoId: it.estoqueInsumoId,
      competencia: params.competenciaSaldo,
      comprasLoja: compras.mesmaLoja,
      comprasGrupo: compras.qualquerLoja,
      outraLoja,
      cmvTeorico,
    });
    if (resolved.custoMedio == null || resolved.custoOrigem === 'PENDENTE') {
      // marca pendente se ainda sem custo
      await prisma.cmvSaldoEstoque.updateMany({
        where: {
          userId: params.tenantUserId,
          storeSlug: params.storeSlug,
          competencia: params.competenciaSaldo,
          estoqueInsumoId: it.estoqueInsumoId,
        },
        data: {
          custoOrigem: 'PENDENTE',
          custoOrigemDetalhe: null,
        },
      });
      continue;
    }
    const r = await prisma.cmvSaldoEstoque.updateMany({
      where: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competenciaSaldo,
        estoqueInsumoId: it.estoqueInsumoId,
      },
      data: {
        custoMedio: resolved.custoMedio,
        custoOrigem: resolved.custoOrigem as CmvCustoOrigem,
        custoOrigemDetalhe: resolved.custoOrigemDetalhe,
      },
    });
    updated += r.count;
  }
  return updated;
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
  custoOrigemDetalhe?: string | null;
};

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
        custoOrigemDetalhe: it.custoOrigemDetalhe ?? null,
        origem: 'IMPORTACAO',
      },
      update: {
        qtdFinal: it.qtdFinal,
        custoMedio: it.custoMedio,
        custoOrigem,
        custoOrigemDetalhe: it.custoOrigemDetalhe ?? null,
        origem: 'IMPORTACAO',
      },
    });
    upserted++;
  }
  return { upserted };
}

export { listarAbas, normalizarDescricao };
