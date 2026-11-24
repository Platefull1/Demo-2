/**
 * Aplica um mapeamento recém-salvo a itens pendentes de outras notas
 * (todas as lojas do tenant) com a mesma chave fornecedor+produto.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  chaveMapeamentoDesc,
  chaveMapeamentoEan,
  normalizarUnidade,
} from './normalize';
import type { CmvRealUnidade } from './pipeline';

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

/** IDs de fornecedores do tenant com a mesma raiz de CNPJ (matriz/filiais). */
export async function fornecedorIdsMesmaRaiz(
  tenantUserId: string,
  fornecedorId: string,
): Promise<string[]> {
  const base = await prisma.nfeFornecedor.findFirst({
    where: { id: fornecedorId, userId: tenantUserId },
    select: { cnpj: true },
  });
  if (!base) return [fornecedorId];
  const raiz = base.cnpj.replace(/\D/g, '').slice(0, 8);
  if (raiz.length < 8) return [fornecedorId];
  const irmaos = await prisma.nfeFornecedor.findMany({
    where: { userId: tenantUserId, cnpj: { startsWith: raiz } },
    select: { id: true },
  });
  return [...new Set([fornecedorId, ...irmaos.map((f) => f.id)])];
}

/**
 * Propaga o mapeamento salvo (último vence) para itens de outras notas em
 * revisão: pendentes (SUGERIDO / SEM_MAPEAMENTO) e também itens já MAPEADO
 * por um mapeamento anterior com a mesma chave.
 * Notas aprovadas não são alteradas.
 */
export async function aplicarMapeamentoEmNotasPendentes(params: {
  tenantUserId: string;
  fornecedorId: string;
  chave: string;
  estoqueInsumoId: string;
  fatorConversao: number;
  mapeamentoId: string;
  unidadeConvertida: CmvRealUnidade;
  excludeItemId: string;
}): Promise<number> {
  const fornecedorIds = await fornecedorIdsMesmaRaiz(
    params.tenantUserId,
    params.fornecedorId,
  );
  const candidatos = await prisma.nfeItem.findMany({
    where: {
      id: { not: params.excludeItemId },
      status: { in: ['SUGERIDO', 'SEM_MAPEAMENTO', 'MAPEADO'] },
      nota: {
        userId: params.tenantUserId,
        fornecedorId: { in: fornecedorIds },
        status: 'EM_REVISAO',
      },
    },
    select: {
      id: true,
      ean: true,
      descricaoNormalizada: true,
      unidadeComercial: true,
      quantidade: true,
      valorLiquido: true,
    },
  });

  const matches = candidatos.filter((it) => {
    const und = normalizarUnidade(it.unidadeComercial);
    if (it.ean) {
      return (
        chaveMapeamentoEan(it.ean, und) === params.chave ||
        chaveMapeamentoEan(it.ean) === params.chave
      );
    }
    return chaveMapeamentoDesc(it.descricaoNormalizada, und) === params.chave;
  });

  if (matches.length === 0) return 0;

  const fator = params.fatorConversao;
  await prisma.$transaction(
    matches.map((it) => {
      const qtdConv = Number(it.quantidade) * fator;
      return prisma.nfeItem.update({
        where: { id: it.id },
        data: {
          status: 'MAPEADO',
          estoqueInsumoId: params.estoqueInsumoId,
          fatorConversao: decimal(fator),
          quantidadeConvertida: decimal(qtdConv),
          unidadeConvertida: params.unidadeConvertida,
          mapeamentoId: params.mapeamentoId,
          custoUnitario:
            it.valorLiquido != null && qtdConv > 0
              ? decimal(Number(it.valorLiquido) / qtdConv)
              : null,
        },
      });
    }),
  );

  return matches.length;
}

/** Marca todas as notas EM_REVISAO do fornecedor como fora do CMV. */
export async function ignorarNotasFornecedorEmRevisao(params: {
  tenantUserId: string;
  fornecedorId: string;
  motivoIgnorar: string;
}): Promise<number> {
  const notas = await prisma.nfeNota.findMany({
    where: {
      userId: params.tenantUserId,
      fornecedorId: params.fornecedorId,
      status: 'EM_REVISAO',
    },
    select: { id: true },
  });
  const ids = notas.map((n) => n.id);
  if (ids.length === 0) {
    await prisma.nfeFornecedor.update({
      where: { id: params.fornecedorId },
      data: {
        ignorarCmv: true,
        motivoIgnorar: params.motivoIgnorar,
      },
    });
    return 0;
  }

  await prisma.$transaction(async (tx) => {
    await tx.nfeFornecedor.update({
      where: { id: params.fornecedorId },
      data: {
        ignorarCmv: true,
        motivoIgnorar: params.motivoIgnorar,
      },
    });
    await tx.nfeNota.updateMany({
      where: { id: { in: ids } },
      data: { status: 'IGNORADA' },
    });
    await tx.nfeItem.updateMany({
      where: { notaId: { in: ids } },
      data: { status: 'IGNORADO' },
    });
  });

  return ids.length;
}
