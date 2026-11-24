/**
 * Aplica um mapeamento recém-salvo a itens de notas em revisão
 * (todas as lojas do tenant) com a mesma chave fornecedor+produto.
 *
 * Regra: o último mapeamento salvo vence — atualiza pendentes e também
 * itens já MAPEADO com fator/produto antigo. Notas aprovadas não mudam.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  chaveMapeamentoDesc,
  chaveMapeamentoEan,
  normalizarDescricao,
  normalizarUnidade,
} from './normalize';
import type { CmvRealUnidade } from './pipeline';

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

type Db = Prisma.TransactionClient | typeof prisma;

/** IDs de fornecedores do tenant com a mesma raiz de CNPJ (matriz/filiais). */
export async function fornecedorIdsMesmaRaiz(
  tenantUserId: string,
  fornecedorId: string,
  db: Db = prisma,
): Promise<string[]> {
  const base = await db.nfeFornecedor.findFirst({
    where: { id: fornecedorId, userId: tenantUserId },
    select: { cnpj: true },
  });
  if (!base) return [fornecedorId];
  const raiz = base.cnpj.replace(/\D/g, '').slice(0, 8);
  if (raiz.length < 8) return [fornecedorId];
  const irmaos = await db.nfeFornecedor.findMany({
    where: { userId: tenantUserId, cnpj: { startsWith: raiz } },
    select: { id: true },
  });
  return [...new Set([fornecedorId, ...irmaos.map((f) => f.id)])];
}

function itemCasaComChaves(
  it: {
    ean: string | null;
    descricaoNormalizada: string;
    unidadeComercial: string;
  },
  chaves: Set<string>,
): boolean {
  const und = normalizarUnidade(it.unidadeComercial);
  if (it.ean) {
    if (chaves.has(chaveMapeamentoEan(it.ean, und))) return true;
    if (chaves.has(chaveMapeamentoEan(it.ean))) return true;
  }
  return chaves.has(chaveMapeamentoDesc(it.descricaoNormalizada, und));
}

/**
 * Propaga o mapeamento salvo (último vence) para itens de notas em revisão.
 */
export async function aplicarMapeamentoEmNotasPendentes(params: {
  tenantUserId: string;
  fornecedorId: string;
  /** Uma ou mais chaves (ean + desc) que representam o mesmo produto. */
  chave: string | string[];
  estoqueInsumoId: string;
  fatorConversao: number;
  mapeamentoId: string;
  /** Outros ids de mapeamento espelho (ex.: chave desc quando a principal é ean). */
  mapeamentoIdsExtras?: string[];
  unidadeConvertida: CmvRealUnidade;
  excludeItemId: string;
}): Promise<number> {
  const chaves = new Set(
    Array.isArray(params.chave) ? params.chave : [params.chave],
  );
  const mapIds = new Set([
    params.mapeamentoId,
    ...(params.mapeamentoIdsExtras ?? []),
  ]);

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
      mapeamentoId: true,
      fatorConversao: true,
      estoqueInsumoId: true,
      status: true,
    },
  });

  const matches = candidatos.filter((it) => {
    if (it.mapeamentoId && mapIds.has(it.mapeamentoId)) return true;
    return itemCasaComChaves(it, chaves);
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

/**
 * Upsert do mapeamento (EAN e/ou descrição) + propaga para notas em revisão.
 * Com EAN: grava as duas chaves para o próximo item casar por código ou por texto.
 */
export async function salvarMapeamentoEPropagar(params: {
  tenantUserId: string;
  actorUserId: string;
  fornecedorId: string;
  ean: string | null;
  descricao: string;
  unidadeComercial: string;
  estoqueInsumoId: string;
  fatorConversao: number;
  unidadeConvertida: CmvRealUnidade;
  excludeItemId: string;
  /** Quando dentro de transação (aprovação), só faz upsert; propaga depois. */
  tx?: Prisma.TransactionClient;
  /** Se false, só upsert (sem propagar). Default true quando sem tx. */
  propagar?: boolean;
}): Promise<{
  mapeamentoId: string;
  chave: string;
  chaves: string[];
  mapeamentoIds: string[];
  itensPropagados: number;
}> {
  const db: Db = params.tx ?? prisma;
  const und = normalizarUnidade(params.unidadeComercial);
  const descNorm = normalizarDescricao(params.descricao);
  const chaveDesc = chaveMapeamentoDesc(descNorm, und);
  const chaveEan = params.ean ? chaveMapeamentoEan(params.ean, und) : null;
  const fator = Number(params.fatorConversao);

  const upsertUma = async (chave: string, ean: string | null) => {
    return db.nfeMapeamento.upsert({
      where: {
        userId_fornecedorId_chave: {
          userId: params.tenantUserId,
          fornecedorId: params.fornecedorId,
          chave,
        },
      },
      create: {
        userId: params.tenantUserId,
        fornecedorId: params.fornecedorId,
        chave,
        ean,
        descricaoNormalizada: descNorm,
        unidadeComercial: und,
        estoqueInsumoId: params.estoqueInsumoId,
        fatorConversao: decimal(fator),
        criadoPorId: params.actorUserId,
        usos: 1,
        ultimoUsoEm: new Date(),
      },
      update: {
        estoqueInsumoId: params.estoqueInsumoId,
        fatorConversao: decimal(fator),
        ean: ean ?? undefined,
        descricaoNormalizada: descNorm,
        unidadeComercial: und,
        usos: { increment: 1 },
        ultimoUsoEm: new Date(),
      },
    });
  };

  const chaves: string[] = [];
  const mapeamentoIds: string[] = [];

  // Principal: EAN se houver; senão descrição.
  const chavePrincipal = chaveEan ?? chaveDesc;
  const principal = await upsertUma(chavePrincipal, params.ean);
  chaves.push(chavePrincipal);
  mapeamentoIds.push(principal.id);

  // Espelho por descrição quando gravou por EAN — próximos itens sem EAN (ou
  // com EAN diferente mas mesmo texto) ainda herdam o fator.
  if (chaveEan && chaveDesc !== chaveEan) {
    const espelho = await upsertUma(chaveDesc, params.ean);
    chaves.push(chaveDesc);
    mapeamentoIds.push(espelho.id);
  }

  const devePropagar = params.propagar ?? !params.tx;
  let itensPropagados = 0;
  if (devePropagar) {
    itensPropagados = await aplicarMapeamentoEmNotasPendentes({
      tenantUserId: params.tenantUserId,
      fornecedorId: params.fornecedorId,
      chave: chaves,
      estoqueInsumoId: params.estoqueInsumoId,
      fatorConversao: fator,
      mapeamentoId: principal.id,
      mapeamentoIdsExtras: mapeamentoIds.slice(1),
      unidadeConvertida: params.unidadeConvertida,
      excludeItemId: params.excludeItemId,
    });
  }

  return {
    mapeamentoId: principal.id,
    chave: chavePrincipal,
    chaves,
    mapeamentoIds,
    itensPropagados,
  };
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
