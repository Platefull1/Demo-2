/**
 * Aprovação manual de NF-e: botão (manual) ou Enter (manual_enter).
 * Salva drafts de itens + aprova em uma única transação (itens + status).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { gerarLancamentosAprovacao } from './approve';
import { preservarMarcasManuais } from './bonificacao';
import {
  ensureCmvRealInsumoConfig,
  secaoFromCategoriaId,
  unidadeFromEstoque,
} from './cmv-catalogo';
import { itemEstaPronto, motivoItemNaoPronto } from './item-pronto';

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

export type ItemDraftAprovacao = {
  itemId: string;
  estoqueInsumoId: string;
  fatorConversao: number;
  criarMapeamento?: boolean;
};

export type PendenteAprovacao = {
  itemId: string;
  descricao: string;
  motivo: string;
};

export type AprovarManualResult =
  | {
      ok: true;
      lancamentos: number;
      numero: string;
      itensPropagados: number;
    }
  | {
      ok: false;
      status: number;
      error: string;
      pendentes?: PendenteAprovacao[];
    };

type InsumoResolvido = {
  id: string;
  unidade: 'KG' | 'UN';
};

async function confirmarItemNoTx(
  tx: Prisma.TransactionClient,
  params: {
    tenantUserId: string;
    actorUserId: string;
    notaId: string;
    fornecedorId: string;
    draft: ItemDraftAprovacao;
    canCreateMap: boolean;
    unidade: 'KG' | 'UN';
  },
): Promise<{
  mapeamentoChave?: string;
  mapeamentoId?: string;
  chaves?: string[];
  mapeamentoIdsExtras?: string[];
  unidade: 'KG' | 'UN';
}> {
  const item = await tx.nfeItem.findFirst({
    where: {
      id: params.draft.itemId,
      notaId: params.notaId,
      nota: { userId: params.tenantUserId },
    },
  });
  if (!item) {
    throw Object.assign(new Error('Item não encontrado'), {
      code: 'ITEM_NOT_FOUND',
      itemId: params.draft.itemId,
    });
  }

  const fator = Number(params.draft.fatorConversao);
  if (!Number.isFinite(fator) || fator <= 0) {
    throw Object.assign(new Error('Fator de conversão inválido'), {
      code: 'FATOR_INVALIDO',
      itemId: params.draft.itemId,
      descricao: item.descricao,
    });
  }
  const qtdConv = Number(item.quantidade) * fator;
  const unidade = params.unidade;

  let mapeamentoId: string | null = item.mapeamentoId;
  let mapeamentoChave: string | undefined;
  let chaves: string[] | undefined;
  let mapeamentoIdsExtras: string[] | undefined;

  if (params.draft.criarMapeamento && params.canCreateMap) {
    const { salvarMapeamentoEPropagar } = await import('./aplicar-mapeamento');
    const salvo = await salvarMapeamentoEPropagar({
      tenantUserId: params.tenantUserId,
      actorUserId: params.actorUserId,
      fornecedorId: params.fornecedorId,
      ean: item.ean,
      descricao: item.descricao,
      unidadeComercial: item.unidadeComercial,
      estoqueInsumoId: params.draft.estoqueInsumoId,
      fatorConversao: fator,
      unidadeConvertida: unidade,
      excludeItemId: item.id,
      tx,
      // Propaga depois do commit (mesma ordem de antes).
      propagar: false,
    });
    mapeamentoId = salvo.mapeamentoId;
    mapeamentoChave = salvo.chave;
    chaves = salvo.chaves;
    mapeamentoIdsExtras = salvo.mapeamentoIds.slice(1);
  }

  await tx.nfeItem.update({
    where: { id: item.id },
    data: {
      status: 'MAPEADO',
      estoqueInsumoId: params.draft.estoqueInsumoId,
      fatorConversao: decimal(fator),
      quantidadeConvertida: decimal(qtdConv),
      unidadeConvertida: unidade,
      mapeamentoId,
      custoUnitario:
        item.valorLiquido != null && qtdConv > 0
          ? decimal(Number(item.valorLiquido) / qtdConv)
          : null,
      // Mantém Bonificação/Troca marcadas manualmente.
      alertas: preservarMarcasManuais(item.alertas),
    },
  });

  return {
    mapeamentoChave,
    mapeamentoId: mapeamentoId ?? undefined,
    chaves,
    mapeamentoIdsExtras,
    unidade,
  };
}

/**
 * Salva drafts (se houver) e aprova a nota numa única transação.
 * `aprovacaoRegra`: `manual` (botão) | `manual_enter` (Enter).
 */
export async function salvarEAprovarNota(params: {
  tenantUserId: string;
  actorUserId: string;
  userIds: string[];
  allowedStoreSlugs: string[] | null;
  isAdmin: boolean;
  notaId: string;
  itens: ItemDraftAprovacao[];
  canCreateMap: boolean;
  aprovacaoRegra: 'manual' | 'manual_enter';
}): Promise<AprovarManualResult> {
  const nota = await prisma.nfeNota.findFirst({
    where: { id: params.notaId, userId: params.tenantUserId },
    include: { itens: true },
  });
  if (!nota) {
    return { ok: false, status: 404, error: 'Não encontrada' };
  }
  if (
    !params.isAdmin &&
    params.allowedStoreSlugs &&
    !params.allowedStoreSlugs.includes(nota.storeSlug)
  ) {
    return { ok: false, status: 403, error: 'Sem acesso a esta loja' };
  }
  if (nota.status === 'APROVADA') {
    return { ok: false, status: 400, error: 'Nota já aprovada' };
  }
  if (nota.status !== 'EM_REVISAO') {
    return {
      ok: false,
      status: 400,
      error: `Nota em status ${nota.status} — só EM_REVISAO pode ser aprovada`,
    };
  }

  for (const d of params.itens) {
    if (!nota.itens.some((i) => i.id === d.itemId)) {
      return {
        ok: false,
        status: 400,
        error: `Item ${d.itemId} não pertence à nota`,
      };
    }
  }

  // Resolve insumos + cria config CMV fora da tx (helper usa prisma global).
  const unidadePorInsumo = new Map<string, InsumoResolvido>();
  for (const draft of params.itens) {
    const item = nota.itens.find((i) => i.id === draft.itemId)!;
    if (item.status === 'IGNORADO') continue;
    if (unidadePorInsumo.has(draft.estoqueInsumoId)) continue;

    const insumo = await prisma.estoqueInsumo.findFirst({
      where: {
        id: draft.estoqueInsumoId,
        userId: { in: params.userIds },
      },
      select: { id: true, unidade: true, categoriaId: true },
    });
    if (!insumo) {
      return {
        ok: false,
        status: 400,
        error: 'Produto não encontrado no estoque',
        pendentes: [
          {
            itemId: draft.itemId,
            descricao: item.descricao,
            motivo: 'produto não encontrado',
          },
        ],
      };
    }
    const unidade = unidadeFromEstoque(insumo.unidade);
    await ensureCmvRealInsumoConfig({
      tenantUserId: params.tenantUserId,
      estoqueInsumoId: draft.estoqueInsumoId,
      secao: secaoFromCategoriaId(insumo.categoriaId),
      unidade,
    });
    unidadePorInsumo.set(draft.estoqueInsumoId, {
      id: insumo.id,
      unidade: unidade === 'UN' ? 'UN' : 'KG',
    });
  }

  const propagacoes: Array<{
    chaves: string[];
    estoqueInsumoId: string;
    fatorConversao: number;
    mapeamentoId: string;
    mapeamentoIdsExtras?: string[];
    unidadeConvertida: 'KG' | 'UN';
    excludeItemId: string;
  }> = [];

  try {
    await prisma.$transaction(async (tx) => {
      for (const draft of params.itens) {
        const item = nota.itens.find((i) => i.id === draft.itemId)!;
        if (item.status === 'IGNORADO') continue;
        const resolved = unidadePorInsumo.get(draft.estoqueInsumoId)!;

        const out = await confirmarItemNoTx(tx, {
          tenantUserId: params.tenantUserId,
          actorUserId: params.actorUserId,
          notaId: params.notaId,
          fornecedorId: nota.fornecedorId,
          draft,
          canCreateMap: params.canCreateMap,
          unidade: resolved.unidade,
        });
        if (
          out.mapeamentoId &&
          out.chaves &&
          draft.criarMapeamento
        ) {
          propagacoes.push({
            chaves: out.chaves,
            estoqueInsumoId: draft.estoqueInsumoId,
            fatorConversao: draft.fatorConversao,
            mapeamentoId: out.mapeamentoId,
            mapeamentoIdsExtras: out.mapeamentoIdsExtras,
            unidadeConvertida: out.unidade,
            excludeItemId: draft.itemId,
          });
        }
      }

      const itensAtualizados = await tx.nfeItem.findMany({
        where: { notaId: params.notaId },
      });

      const pendentes: PendenteAprovacao[] = [];
      for (const it of itensAtualizados) {
        if (!itemEstaPronto(it)) {
          pendentes.push({
            itemId: it.id,
            descricao: it.descricao,
            motivo: motivoItemNaoPronto(it) || 'pendente',
          });
        }
      }
      if (pendentes.length > 0) {
        throw Object.assign(
          new Error(
            `${pendentes.length} item(ns) ainda sem conversão/produto`,
          ),
          { code: 'ITENS_PENDENTES', pendentes },
        );
      }

      await tx.nfeNota.update({
        where: { id: nota.id },
        data: {
          status: 'APROVADA',
          aprovadaEm: new Date(),
          aprovadaPorId: params.actorUserId,
          aprovacaoAutomatica: false,
          aprovacaoRegra: params.aprovacaoRegra,
        },
      });
    });
  } catch (err) {
    const e = err as {
      code?: string;
      message?: string;
      pendentes?: PendenteAprovacao[];
      itemId?: string;
      descricao?: string;
    };
    if (e.code === 'ITENS_PENDENTES') {
      return {
        ok: false,
        status: 400,
        error: e.message || 'Itens pendentes',
        pendentes: e.pendentes,
      };
    }
    if (
      e.code === 'ITEM_NOT_FOUND' ||
      e.code === 'INSUMO_NOT_FOUND' ||
      e.code === 'FATOR_INVALIDO'
    ) {
      return {
        ok: false,
        status: 400,
        error: e.message || 'Falha ao salvar item',
        pendentes: e.itemId
          ? [
              {
                itemId: e.itemId,
                descricao: e.descricao || '',
                motivo: e.message || 'erro',
              },
            ]
          : undefined,
      };
    }
    throw err;
  }

  let itensPropagados = 0;
  if (propagacoes.length > 0) {
    const { aplicarMapeamentoEmNotasPendentes } = await import(
      './aplicar-mapeamento'
    );
    for (const p of propagacoes) {
      itensPropagados += await aplicarMapeamentoEmNotasPendentes({
        tenantUserId: params.tenantUserId,
        fornecedorId: nota.fornecedorId,
        chave: p.chaves,
        estoqueInsumoId: p.estoqueInsumoId,
        fatorConversao: p.fatorConversao,
        mapeamentoId: p.mapeamentoId,
        mapeamentoIdsExtras: p.mapeamentoIdsExtras,
        unidadeConvertida: p.unidadeConvertida,
        excludeItemId: p.excludeItemId,
      });
    }
  }

  const n = await gerarLancamentosAprovacao({
    userId: params.tenantUserId,
    notaId: nota.id,
    storeSlug: nota.storeSlug,
    competencia: nota.competencia,
    dataEntrada: nota.dataEntrada,
  });

  return {
    ok: true,
    lancamentos: n,
    numero: nota.numero,
    itensPropagados,
  };
}
