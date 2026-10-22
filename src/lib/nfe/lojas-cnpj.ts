/**
 * CNPJ por loja CMV: lê/grava Store + RhLoja. Sem valor inventado.
 */

import { prisma } from '@/lib/prisma';
import {
  CMV_STORE_SLUGS,
  normalizarCnpjLoja,
  storeSlugFromLojaNome,
  type CmvStoreSlug,
} from './lojas';

export async function carregarCnpjsPorLoja(
  tenantUserId: string,
): Promise<Partial<Record<CmvStoreSlug, string>>> {
  const [rh, stores] = await Promise.all([
    prisma.rhLoja.findMany({
      where: { userId: tenantUserId },
      select: { nome: true, cnpj: true },
    }),
    prisma.store.findMany({
      where: { userId: tenantUserId },
      select: { name: true, abbreviation: true, cnpj: true },
    }),
  ]);

  const out: Partial<Record<CmvStoreSlug, string>> = {};
  for (const s of stores) {
    const slug = storeSlugFromLojaNome(s.name) || storeSlugFromLojaNome(s.abbreviation);
    const cnpj = normalizarCnpjLoja(s.cnpj);
    if (slug && cnpj) out[slug] = cnpj;
  }
  for (const l of rh) {
    const slug = storeSlugFromLojaNome(l.nome);
    const cnpj = normalizarCnpjLoja(l.cnpj);
    if (slug && cnpj) out[slug] = cnpj;
  }
  return out;
}

export async function listarCnpjsLojasCmv(tenantUserId: string) {
  const map = await carregarCnpjsPorLoja(tenantUserId);
  return CMV_STORE_SLUGS.map((slug) => ({
    storeSlug: slug,
    cnpj: map[slug] ?? '',
  }));
}

export async function gravarCnpjLojaCmv(params: {
  tenantUserId: string;
  storeSlug: CmvStoreSlug;
  cnpj: string | null;
}): Promise<void> {
  const cnpj = normalizarCnpjLoja(params.cnpj);
  if (params.cnpj && params.cnpj.replace(/\D/g, '').length > 0 && !cnpj) {
    throw new Error('CNPJ deve ter 14 dígitos');
  }

  const [rh, stores] = await Promise.all([
    prisma.rhLoja.findMany({
      where: { userId: params.tenantUserId },
      select: { id: true, nome: true },
    }),
    prisma.store.findMany({
      where: { userId: params.tenantUserId },
      select: { id: true, name: true, abbreviation: true },
    }),
  ]);

  const rhMatch = rh.find((l) => storeSlugFromLojaNome(l.nome) === params.storeSlug);
  if (rhMatch) {
    await prisma.rhLoja.update({
      where: { id: rhMatch.id },
      data: { cnpj },
    });
  }

  const storeMatch = stores.find(
    (s) =>
      storeSlugFromLojaNome(s.name) === params.storeSlug ||
      storeSlugFromLojaNome(s.abbreviation) === params.storeSlug,
  );
  if (storeMatch) {
    await prisma.store.update({
      where: { id: storeMatch.id },
      data: { cnpj },
    });
  }
}

export async function sincronizarStoreCnpjDeRhLoja(params: {
  tenantUserId: string;
  rhNome: string;
  cnpj: string | null;
}): Promise<void> {
  const slug = storeSlugFromLojaNome(params.rhNome);
  if (!slug) return;
  await gravarCnpjLojaCmv({
    tenantUserId: params.tenantUserId,
    storeSlug: slug,
    cnpj: params.cnpj,
  });
}
